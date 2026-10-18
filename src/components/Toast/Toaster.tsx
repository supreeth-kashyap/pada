import { useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from 'react';
import { Portal } from '../../headless/utils/Portal';
import { usePresence } from '../../headless/utils/usePresence';
import { Icon } from '../Icon';
import { toast, toastStore, type ToastRecord } from './toastStore';
import './Toast.css';

export type ToasterPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

export interface ToasterProps {
  /** Corner (or edge) where toasts appear. */
  position?: ToasterPosition;
  /** How many toasts show at once; older ones wait in the stack. */
  visibleToasts?: number;
  /** Accessible name of the region. The hotkey is appended: "Notifications (F8)". */
  label?: string;
  /** Key that moves focus to the toasts. */
  hotkey?: string;
  className?: string;
}

const TONE_ICON = { neutral: null, info: 'info', success: 'tick_2', warning: 'alert_1', danger: 'alert_2' } as const;
const SWIPE_THRESHOLD = 60;

/**
 * Renders toasts created with `toast()`. Toasts stack in a corner and expand on hover or focus;
 * timers pause while the stack is hovered or focused, or the window is in the background.
 * Swipe a toast sideways or press Escape on it to dismiss it. F8 jumps to the toasts.
 */
export function Toaster({ position = 'bottom-right', visibleToasts = 3, label = 'Notifications', hotkey = 'F8', className }: ToasterProps) {
  const toasts = useSyncExternalStore(toastStore.subscribe, toastStore.getSnapshot, toastStore.getSnapshot);
  const regionRef = useRef<HTMLOListElement>(null);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [windowActive, setWindowActive] = useState(true);
  const [heights, setHeights] = useState<Record<string, number>>({});
  const expanded = hovered || focused;
  const paused = expanded || !windowActive;
  const reportHeight = useCallback((id: string, height: number) => {
    setHeights((current) => (current[id] === height ? current : { ...current, [id]: height }));
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === hotkey) regionRef.current?.querySelector<HTMLElement>('.toast')?.focus();
    };
    const onBlur = () => setWindowActive(false);
    const onFocus = () => setWindowActive(true);
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('blur', onBlur);
    window.addEventListener('focus', onFocus);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('focus', onFocus);
    };
  }, [hotkey]);

  // Newest first, so the newest sits at the front of the stack.
  const ordered = [...toasts].reverse();
  const [vertical, horizontal] = position.split('-') as ['top' | 'bottom', 'left' | 'center' | 'right'];
  const shown = ordered.filter((item, index) => index < visibleToasts && item.open);
  const GAP = 8;
  const PEEK = 10;
  // Expanded: each toast sits below (or above) the newer ones. Collapsed: they peek behind the front.
  const offsets = new Map<string, number>();
  let running = 0;
  ordered.forEach((item) => {
    offsets.set(item.id, running);
    if (item.open) running += (heights[item.id] ?? 0) + GAP;
  });
  const frontHeight = shown[0] ? (heights[shown[0].id] ?? 0) : 0;
  const listHeight = expanded ? Math.max(0, running - GAP) : frontHeight + Math.max(0, shown.length - 1) * PEEK;

  return (
    <Portal>
    <section aria-label={`${label} (${hotkey})`} tabIndex={-1} className={['toaster', className].filter(Boolean).join(' ')} data-position={position} data-vertical={vertical} data-horizontal={horizontal} data-expanded={expanded ? '' : undefined}>
      <ol
        ref={regionRef}
        className="toaster-list"
        style={{ '--pada-toaster-height': `${listHeight}px`, '--pada-toast-front-height': `${frontHeight}px` } as CSSProperties}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onFocus={() => setFocused(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false);
        }}
      >
        {ordered.map((item, index) => (
          <ToastItem
            key={item.id}
            toast={item}
            index={index}
            offset={offsets.get(item.id) ?? 0}
            hidden={index >= visibleToasts}
            paused={paused}
            onHeight={reportHeight}
          />
        ))}
      </ol>
    </section>
    </Portal>
  );
}

interface ToastItemProps {
  toast: ToastRecord;
  index: number;
  offset: number;
  hidden: boolean;
  paused: boolean;
  onHeight: (id: string, height: number) => void;
}

function ToastItem({ toast: item, index, offset, hidden, paused, onHeight }: ToastItemProps) {
  const presence = usePresence(item.open);
  const nodeRef = useRef<HTMLLIElement | null>(null);

  // Report the natural height (measured without the collapsed clamp) for stack layout.
  useLayoutEffect(() => {
    const node = nodeRef.current;
    if (!node) return;
    const measure = () => onHeight(item.id, node.scrollHeight);
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [item.id, onHeight]);
  const [remaining, setRemaining] = useState(item.duration);
  const startedAt = useRef(Date.now());
  const [swipe, setSwipe] = useState<{ start: number; offset: number } | null>(null);
  const dismiss = useCallback(() => toast.dismiss(item.id), [item.id]);

  // Remove from the store once the exit animation has finished.
  useEffect(() => {
    if (!presence.isPresent) toastStore.remove(item.id);
  }, [presence.isPresent, item.id]);

  // Count down only while visible and not paused; resume where it left off.
  useEffect(() => {
    if (!item.open || paused || hidden || !Number.isFinite(item.duration)) return;
    startedAt.current = Date.now();
    const timer = window.setTimeout(dismiss, remaining);
    return () => {
      window.clearTimeout(timer);
      setRemaining((left) => Math.max(0, left - (Date.now() - startedAt.current)));
    };
  }, [item.open, paused, hidden, item.duration, remaining, dismiss]);

  if (!presence.isPresent) return null;
  const iconName = TONE_ICON[item.tone];
  const assertive = item.tone === 'danger';

  return (
    <li
      ref={(node) => {
        nodeRef.current = node;
        presence.ref(node);
      }}
      className="toast"
      tabIndex={0}
      data-tone={item.tone}
      data-state={item.open ? 'open' : 'closed'}
      data-hidden={hidden ? '' : undefined}
      data-front={index === 0 ? '' : undefined}
      data-swiping={swipe ? '' : undefined}
      style={
        {
          '--pada-toast-index': index,
          '--pada-toast-offset': `${offset}px`,
          '--pada-toast-swipe': `${swipe?.offset ?? 0}px`,
          '--pada-toast-duration': Number.isFinite(item.duration) ? `${item.duration}ms` : '0ms',
        } as CSSProperties
      }
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          event.stopPropagation();
          dismiss();
        }
      }}
      onPointerDown={(event) => {
        if ((event.target as HTMLElement).closest('button')) return;
        event.currentTarget.setPointerCapture?.(event.pointerId);
        setSwipe({ start: event.clientX, offset: 0 });
      }}
      onPointerMove={(event) => swipe && setSwipe({ ...swipe, offset: event.clientX - swipe.start })}
      onPointerUp={() => {
        if (swipe && Math.abs(swipe.offset) > SWIPE_THRESHOLD) dismiss();
        setSwipe(null);
      }}
      onPointerCancel={() => setSwipe(null)}
    >
      {/* The live region wraps only the message, so button labels are not announced. */}
      <div className="toast-message" role={assertive ? 'alert' : 'status'} aria-live={assertive ? 'assertive' : 'polite'} aria-atomic="true">
        {iconName && <Icon name={iconName} size={16} aria-hidden="true" className="toast-icon" />}
        <div className="toast-body">
          {item.title && <p className="toast-title">{item.title}</p>}
          {item.description && <p className="toast-description">{item.description}</p>}
        </div>
      </div>
      {item.action && (
        <button
          type="button"
          className="toast-action"
          onClick={() => {
            item.action?.onClick();
            dismiss();
          }}
        >
          {item.action.label}
        </button>
      )}
      <button type="button" className="toast-close" aria-label="Dismiss notification" onClick={dismiss}>
        <Icon name="cross_1" size={12} aria-hidden="true" />
      </button>
      {Number.isFinite(item.duration) && <span className="toast-timer" aria-hidden="true" data-paused={paused ? '' : undefined} />}
    </li>
  );
}

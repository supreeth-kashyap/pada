import { useEffect, useRef, useState, type ComponentPropsWithRef, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react';
import {
  DialogContent as HeadlessContent,
  DialogOverlay as HeadlessOverlay,
  DialogPortal as HeadlessPortal,
  type DialogContentProps as HeadlessContentProps,
} from '../../headless/Dialog/Dialog';
import { useDialog } from '../../headless/Dialog/dialogContext';
import { composeEventHandlers, dataFlag } from '../../headless/utils/events';
import { useControllableState } from '../../headless/utils/useControllableState';
import './Sheet.css';

const cx = (...names: (string | undefined | false)[]) => names.filter(Boolean).join(' ');

/** Moving less than this many pixels is a click, not a drag. */
const DRAG_THRESHOLD = 4;
/** A release faster than this (px/ms) counts as a flick in its direction. */
const FLICK_VELOCITY = 0.5;
/** Release velocity is measured over the last this many milliseconds of the drag. */
const VELOCITY_WINDOW = 100;
/** Without snap points, dragging down more than this share of the height closes the sheet. */
const CLOSE_RATIO = 0.3;
/** Pointer-downs on these never start a drag, so controls keep working. */
const NO_DRAG = 'input, textarea, select, button:not([data-sheet-grabber]), a[href], [contenteditable="true"], [role="slider"], [data-sheet-no-drag]';

export interface SheetContentProps extends HeadlessContentProps {
  /**
   * Heights the sheet rests at, as fractions of the viewport height in ascending order, e.g.
   * `[0.4, 0.9]`. Without them the sheet fits its content (up to the maximum height).
   */
  snapPoints?: number[];
  /** Controlled snap point (one of `snapPoints`). */
  snap?: number;
  /** Initial snap point when uncontrolled. @default the first snap point */
  defaultSnap?: number;
  /** Called when the sheet settles at another snap point. */
  onSnapChange?: (snap: number) => void;
  /** Close when dragged or flicked down past the lowest position. @default true */
  dismissible?: boolean;
  /** Element to portal into. Defaults to `document.body`. */
  container?: Element | null;
  /** Props for the backdrop behind the sheet. */
  overlayProps?: ComponentPropsWithRef<'div'>;
}

/**
 * A bottom sheet: a dialog that rises from the bottom edge, for mobile-first flows (filters, a
 * share menu, details). Drag it down to close, or between `snapPoints`; Escape and the backdrop
 * close it too. Use the Dialog parts inside (`Sheet.Header`, `Sheet.Title`, `Sheet.Body`, …).
 */
export function SheetContent({
  snapPoints,
  snap: snapProp,
  defaultSnap,
  onSnapChange,
  dismissible = true,
  container,
  overlayProps,
  className,
  style,
  children,
  onPointerDown,
  ...props
}: SheetContentProps) {
  const { setOpen } = useDialog();
  const points = snapPoints?.length ? snapPoints : undefined;
  const highest = points ? points[points.length - 1] : 1;
  const [snap, setSnap] = useControllableState({ prop: snapProp, defaultProp: defaultSnap ?? points?.[0] ?? 1, onChange: onSnapChange });
  const [drag, setDrag] = useState(0);
  const [dragging, setDragging] = useState(false);
  // A drag that starts on the grabber ends with a click on it; that click must not also cycle.
  const suppressClick = useRef(false);

  const viewport = () => window.innerHeight || 1;
  // How far the sheet sits below its full height for the current snap point, in px.
  const restingOffset = points ? (highest - snap) * viewport() : 0;

  const settle = (moved: number, velocity: number, height: number) => {
    setDrag(0);
    setDragging(false);
    if (!points) {
      if (dismissible && (moved > height * CLOSE_RATIO || velocity > FLICK_VELOCITY)) setOpen(false);
      return;
    }
    const visible = snap - moved / viewport();
    let index = points.indexOf(snap);
    if (velocity > FLICK_VELOCITY) index -= 1;
    else if (velocity < -FLICK_VELOCITY) index += 1;
    else {
      // The nearest resting place, counting "closed" (0) when the sheet can be dismissed.
      const candidates = dismissible ? [0, ...points] : points;
      const nearest = candidates.reduce((best, point) => (Math.abs(point - visible) < Math.abs(best - visible) ? point : best));
      index = nearest === 0 ? -1 : points.indexOf(nearest);
    }
    if (index < 0) {
      if (dismissible) setOpen(false);
      else setSnap(points[0]);
      return;
    }
    setSnap(points[Math.min(index, points.length - 1)]);
  };

  // The gesture is followed on the document from the first pointer-down, so moves that leave the
  // sheet before the drag threshold still count, without capturing the pointer (which would turn
  // a click on a label into a click on the sheet).
  const stopGesture = useRef<() => void>(undefined);
  useEffect(() => () => stopGesture.current?.(), []);

  const startGesture = (element: HTMLElement, pointerId: number, startY: number) => {
    stopGesture.current?.();
    let active = false;
    let samples = [{ y: startY, time: performance.now() }];

    const move = (event: PointerEvent) => {
      if (event.pointerId !== pointerId) return;
      const moved = event.clientY - startY;
      if (!active) {
        if (Math.abs(moved) < DRAG_THRESHOLD) return;
        active = true;
        setDragging(true);
      }
      const now = performance.now();
      samples = [...samples.filter((sample) => now - sample.time <= VELOCITY_WINDOW), { y: event.clientY, time: now }];
      // Upwards it follows the pointer until the highest snap point, then resists.
      const room = restingOffset;
      setDrag(moved >= -room ? moved : -room + (moved + room) / 4);
    };
    const up = (event: PointerEvent) => {
      if (event.pointerId !== pointerId) return;
      stop();
      if (!active) return;
      suppressClick.current = true;
      window.setTimeout(() => (suppressClick.current = false), 0);
      const now = performance.now();
      const first = samples.find((sample) => now - sample.time <= VELOCITY_WINDOW) ?? samples[samples.length - 1];
      const velocity = now > first.time ? (event.clientY - first.y) / (now - first.time) : 0;
      settle(event.clientY - startY, velocity, element.getBoundingClientRect().height);
    };
    const cancel = (event: PointerEvent) => {
      if (event.pointerId !== pointerId) return;
      stop();
      setDrag(0);
      setDragging(false);
    };
    const stop = () => {
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', up);
      document.removeEventListener('pointercancel', cancel);
      stopGesture.current = undefined;
    };
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', up);
    document.addEventListener('pointercancel', cancel);
    stopGesture.current = stop;
  };

  const cycle = () => {
    if (suppressClick.current) {
      suppressClick.current = false;
      return;
    }
    if (!points) return;
    const index = points.indexOf(snap);
    setSnap(points[index >= points.length - 1 ? 0 : index + 1]);
  };

  const sheetStyle = {
    '--pada-sheet-drag': `${drag}px`,
    '--pada-sheet-offset': `${restingOffset}px`,
    ...(points ? { '--pada-sheet-height': `${highest * 100}dvh` } : {}),
    ...style,
  } as CSSProperties;

  const atHighest = !points || snap >= highest;

  return (
    <HeadlessPortal container={container}>
      <HeadlessOverlay {...overlayProps} className={cx('dialog-overlay', overlayProps?.className)} />
      <HeadlessContent
        data-snap={points ? snap : undefined}
        data-dragging={dataFlag(dragging)}
        {...props}
        className={cx('sheet', className)}
        style={sheetStyle}
        onPointerDown={composeEventHandlers(onPointerDown, (event: ReactPointerEvent<HTMLDivElement>) => {
          if (event.button !== 0 || !(event.target instanceof Element)) return;
          if (event.target.closest(NO_DRAG)) return;
          // Content scrolled away from its top scrolls instead of dragging the sheet.
          for (let node: Element | null = event.target; node && node !== event.currentTarget; node = node.parentElement) {
            if (node.scrollTop > 0) return;
          }
          startGesture(event.currentTarget, event.pointerId, event.clientY);
        })}
      >
        {points ? (
          <button
            type="button"
            className="sheet-grabber"
            data-sheet-grabber=""
            aria-label={atHighest ? 'Collapse sheet' : 'Expand sheet'}
            onClick={cycle}
          />
        ) : (
          <span className="sheet-grabber" aria-hidden="true" />
        )}
        {children}
      </HeadlessContent>
    </HeadlessPortal>
  );
}

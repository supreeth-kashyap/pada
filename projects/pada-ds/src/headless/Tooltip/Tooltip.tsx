import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ComponentPropsWithRef,
  type ReactNode,
} from 'react';
import { createPartContext } from '../utils/context';
import { composeEventHandlers, openState } from '../utils/events';
import { useFloatingPosition, type FloatingOptions } from '../utils/floating';
import { Portal, type PortalProps } from '../utils/Portal';
import { useComposedRefs } from '../utils/refs';
import { Slot } from '../utils/Slot';
import { useControllableState } from '../utils/useControllableState';
import { useDismissable, type DismissEvent } from '../utils/useDismissable';
import { usePresence } from '../utils/usePresence';

// ── Provider: shared delays ────────────────────────────────────────────────────────────────
interface TooltipProviderValue {
  delayDuration: number;
  skipDelayDuration: number;
  /** True for `skipDelayDuration` ms after any tooltip closed, so the next one opens instantly. */
  isWarm: () => boolean;
  onClose: () => void;
}

function createProviderValue(delayDuration: number, skipDelayDuration: number): TooltipProviderValue {
  let lastClosed = -Infinity;
  return {
    delayDuration,
    skipDelayDuration,
    isWarm: () => performance.now() - lastClosed < skipDelayDuration,
    onClose: () => {
      lastClosed = performance.now();
    },
  };
}

const defaultProvider = createProviderValue(700, 300);
const TooltipProviderContext = createContext<TooltipProviderValue>(defaultProvider);

export interface TooltipProviderProps {
  children?: ReactNode;
  /** Hover time before a tooltip opens, in ms. @default 700 */
  delayDuration?: number;
  /** After a tooltip closes, others open instantly for this long, in ms. @default 300 */
  skipDelayDuration?: number;
}

/** Shares open delays between tooltips: moving from one trigger to the next skips the delay. */
export function TooltipProvider({ children, delayDuration = 700, skipDelayDuration = 300 }: TooltipProviderProps) {
  const value = useMemo(() => createProviderValue(delayDuration, skipDelayDuration), [delayDuration, skipDelayDuration]);
  return <TooltipProviderContext value={value}>{children}</TooltipProviderContext>;
}

// ── Root ───────────────────────────────────────────────────────────────────────────────────
interface TooltipContextValue {
  open: boolean;
  contentId: string;
  trigger: HTMLElement | null;
  setTrigger: (trigger: HTMLElement | null) => void;
  /** Open now, or after the delay. */
  requestOpen: (immediate: boolean) => void;
  /** Close now, or after a short grace period so the pointer can reach hoverable content. */
  requestClose: (immediate: boolean) => void;
  cancelPending: () => void;
  disableHoverableContent: boolean;
}

const [TooltipRootProvider, useTooltipContext] = createPartContext<TooltipContextValue>('Tooltip.Root');

export interface TooltipRootProps {
  children?: ReactNode;
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Called when the tooltip opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Overrides the provider's hover delay, in ms. */
  delayDuration?: number;
  /** Close as soon as the pointer leaves the trigger, even towards the content. @default false */
  disableHoverableContent?: boolean;
}

const GRACE_MS = 120;

/** Holds the state for one tooltip. Renders no element. WAI-ARIA APG: Tooltip. */
export function TooltipRoot({
  children,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  delayDuration,
  disableHoverableContent = false,
}: TooltipRootProps) {
  const provider = useContext(TooltipProviderContext);
  const [open, setOpen] = useControllableState({ prop: openProp, defaultProp: defaultOpen, onChange: onOpenChange });
  const timer = useRef<number | undefined>(undefined);
  const contentId = `${useId()}tooltip`;
  const [trigger, setTrigger] = useState<HTMLElement | null>(null);

  const cancelPending = useCallback(() => window.clearTimeout(timer.current), []);
  useEffect(() => cancelPending, [cancelPending]);

  const wasOpen = useRef(open);
  useEffect(() => {
    if (wasOpen.current && !open) provider.onClose();
    wasOpen.current = open;
  }, [open, provider]);

  const requestOpen = useCallback(
    (immediate: boolean) => {
      cancelPending();
      const delay = delayDuration ?? provider.delayDuration;
      if (immediate || delay <= 0 || provider.isWarm()) setOpen(true);
      else timer.current = window.setTimeout(() => setOpen(true), delay);
    },
    [cancelPending, delayDuration, provider, setOpen],
  );
  const requestClose = useCallback(
    (immediate: boolean) => {
      cancelPending();
      if (immediate) setOpen(false);
      else timer.current = window.setTimeout(() => setOpen(false), GRACE_MS);
    },
    [cancelPending, setOpen],
  );

  const value = useMemo(
    () => ({
      open,
      contentId,
      trigger,
      setTrigger,
      requestOpen,
      requestClose,
      cancelPending,
      disableHoverableContent,
    }),
    [open, contentId, trigger, requestOpen, requestClose, cancelPending, disableHoverableContent],
  );
  return <TooltipRootProvider value={value}>{children}</TooltipRootProvider>;
}

// ── Trigger ────────────────────────────────────────────────────────────────────────────────
export interface TooltipTriggerProps extends ComponentPropsWithRef<'button'> {
  /** Merge the trigger behaviour onto its only child (a button, link or icon button). */
  asChild?: boolean;
}

/**
 * Element the tooltip describes. Opens on hover (after the delay) and immediately on keyboard
 * focus; closes on leave, blur, Escape and pointer-down. Gets `aria-describedby` while open.
 */
export function TooltipTrigger({
  asChild,
  ref,
  onPointerEnter,
  onPointerLeave,
  onPointerDown,
  onFocus,
  onBlur,
  ...props
}: TooltipTriggerProps) {
  const context = useTooltipContext('Tooltip.Trigger');
  const composedRef = useComposedRefs(ref, context.setTrigger);
  const pointerDown = useRef(false);
  const Component = asChild ? Slot : 'button';
  const describedBy = [props['aria-describedby'], context.open ? context.contentId : undefined].filter(Boolean).join(' ');
  return (
    <Component
      type={asChild ? undefined : 'button'}
      data-state={openState(context.open)}
      {...props}
      aria-describedby={describedBy || undefined}
      ref={composedRef}
      onPointerEnter={composeEventHandlers(onPointerEnter, (event) => {
        if (event.pointerType !== 'touch') context.requestOpen(false);
      })}
      onPointerLeave={composeEventHandlers(onPointerLeave, () => context.requestClose(context.disableHoverableContent))}
      onPointerDown={composeEventHandlers(onPointerDown, () => {
        pointerDown.current = true;
        context.requestClose(true);
        window.setTimeout(() => (pointerDown.current = false), 0);
      })}
      onFocus={composeEventHandlers(onFocus, () => {
        // Focus that comes from a click is not keyboard focus; do not reopen.
        if (!pointerDown.current) context.requestOpen(true);
      })}
      onBlur={composeEventHandlers(onBlur, () => context.requestClose(true))}
    />
  );
}

export type TooltipPortalProps = PortalProps;

/** Renders the content into `document.body` (or `container`). */
export function TooltipPortal(props: TooltipPortalProps) {
  return <Portal {...props} />;
}

// ── Content ────────────────────────────────────────────────────────────────────────────────
export interface TooltipContentProps extends ComponentPropsWithRef<'div'>, FloatingOptions {
  /** Keep mounted while closed, for animation libraries that manage presence themselves. */
  forceMount?: boolean;
  /** Called on Escape. Prevent it to keep the tooltip open. */
  onEscapeKeyDown?: (event: DismissEvent<KeyboardEvent>) => void;
}

/** The tooltip bubble: `role="tooltip"`, positioned with `data-side` and `data-align`. */
export function TooltipContent({ forceMount, ref, ...props }: TooltipContentProps) {
  const context = useTooltipContext('Tooltip.Content');
  const presence = usePresence(context.open);
  const composedRef = useComposedRefs(ref, presence.ref);
  if (!(forceMount || presence.isPresent)) return null;
  return <TooltipContentImpl {...props} ref={composedRef} context={context} />;
}

function TooltipContentImpl({
  context,
  ref,
  side = 'top',
  align,
  sideOffset,
  alignOffset,
  avoidCollisions,
  collisionPadding,
  arrowPadding,
  hideWhenDetached,
  onEscapeKeyDown,
  onPointerEnter,
  onPointerLeave,
  style,
  children,
  ...props
}: Omit<TooltipContentProps, 'forceMount'> & { context: TooltipContextValue }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const floating = useFloatingPosition(context.open, { side, align, sideOffset, alignOffset, avoidCollisions, collisionPadding, arrowPadding, hideWhenDetached });
  const composedRef = useComposedRefs(ref, contentRef, floating.refs.setFloating);
  const { setReference } = floating.refs;
  const { trigger, requestClose, cancelPending, disableHoverableContent } = context;

  useLayoutEffect(() => {
    setReference(trigger);
  }, [trigger, setReference]);

  useDismissable(contentRef, {
    enabled: context.open,
    onDismiss: useCallback(() => requestClose(true), [requestClose]),
    onEscapeKeyDown,
    // A tooltip never steals clicks: pointer-down elsewhere just closes it.
    onPointerDownOutside: () => {},
  });

  return (
    <div
      id={context.contentId}
      role="tooltip"
      data-state={openState(context.open)}
      data-side={floating.side}
      data-align={floating.align}
      data-pada-layer=""
      {...props}
      ref={composedRef}
      style={{ ...floating.floatingStyles, ...(disableHoverableContent ? { pointerEvents: 'none' } : {}), ...style }}
      onPointerEnter={composeEventHandlers(onPointerEnter, () => cancelPending())}
      onPointerLeave={composeEventHandlers(onPointerLeave, () => requestClose(false))}
    >
      <TooltipArrowContext value={floating}>{children}</TooltipArrowContext>
    </div>
  );
}

const [TooltipArrowContext, useTooltipArrowContext] = createPartContext<ReturnType<typeof useFloatingPosition>>('Tooltip.Content');

export interface TooltipArrowProps extends ComponentPropsWithRef<'span'> {
  /** Render your own arrow element (an SVG, usually). */
  asChild?: boolean;
}

/** Arrow pointing at the trigger. Positioned automatically; style its size and shape. */
export function TooltipArrow({ asChild, ref, style, ...props }: TooltipArrowProps) {
  const floating = useTooltipArrowContext('Tooltip.Arrow');
  const composedRef = useComposedRefs(ref, floating.setArrowElement);
  const Component = asChild ? Slot : 'span';
  return <Component aria-hidden="true" data-side={floating.side} {...props} ref={composedRef} style={{ ...floating.arrowStyles, ...style }} />;
}

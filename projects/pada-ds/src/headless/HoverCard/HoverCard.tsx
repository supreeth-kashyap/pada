import {
  useCallback,
  useEffect,
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

interface HoverCardContextValue {
  open: boolean;
  trigger: HTMLElement | null;
  setTrigger: (trigger: HTMLElement | null) => void;
  /** Opens after `openDelay`. */
  scheduleOpen: () => void;
  /** Closes after `closeDelay`, so the pointer can travel to the card. */
  scheduleClose: () => void;
  cancel: () => void;
  close: () => void;
}

const [HoverCardProvider, useHoverCardContext] = createPartContext<HoverCardContextValue>('HoverCard.Root');

export interface HoverCardRootProps {
  children?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Hover (or focus) time before the card opens, in ms. @default 700 */
  openDelay?: number;
  /** Time after the pointer leaves before the card closes, in ms. @default 300 */
  closeDelay?: number;
}

/**
 * A preview card for a link or name, shown on hover and keyboard focus. Renders no element.
 * The card is supplementary: everything in it must also be reachable through the trigger
 * (the profile the link goes to), since touch and screen-reader users may never see it.
 */
export function HoverCardRoot({
  children,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  openDelay = 700,
  closeDelay = 300,
}: HoverCardRootProps) {
  const [open, setOpen] = useControllableState({ prop: openProp, defaultProp: defaultOpen, onChange: onOpenChange });
  const [trigger, setTrigger] = useState<HTMLElement | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const cancel = useCallback(() => window.clearTimeout(timer.current), []);
  useEffect(() => cancel, [cancel]);

  const scheduleOpen = useCallback(() => {
    cancel();
    timer.current = window.setTimeout(() => setOpen(true), openDelay);
  }, [cancel, openDelay, setOpen]);
  const scheduleClose = useCallback(() => {
    cancel();
    timer.current = window.setTimeout(() => setOpen(false), closeDelay);
  }, [cancel, closeDelay, setOpen]);
  const close = useCallback(() => {
    cancel();
    setOpen(false);
  }, [cancel, setOpen]);

  const value = useMemo(
    () => ({ open, trigger, setTrigger, scheduleOpen, scheduleClose, cancel, close }),
    [open, trigger, scheduleOpen, scheduleClose, cancel, close],
  );
  return <HoverCardProvider value={value}>{children}</HoverCardProvider>;
}

export interface HoverCardTriggerProps extends ComponentPropsWithRef<'a'> {
  /** Merge the behaviour onto your own element (a router link, a name). */
  asChild?: boolean;
}

/** The link the card previews. Opens the card on hover (not touch) and on keyboard focus. */
export function HoverCardTrigger({ asChild, ref, onPointerEnter, onPointerLeave, onFocus, onBlur, ...props }: HoverCardTriggerProps) {
  const context = useHoverCardContext('HoverCard.Trigger');
  const composedRef = useComposedRefs(ref, context.setTrigger);
  const Component = asChild ? Slot : 'a';
  return (
    <Component
      data-state={openState(context.open)}
      {...props}
      ref={composedRef}
      onPointerEnter={composeEventHandlers(onPointerEnter, (event) => {
        if (event.pointerType !== 'touch') context.scheduleOpen();
      })}
      onPointerLeave={composeEventHandlers(onPointerLeave, (event) => {
        if (event.pointerType !== 'touch') context.scheduleClose();
      })}
      onFocus={composeEventHandlers(onFocus, () => context.scheduleOpen())}
      onBlur={composeEventHandlers(onBlur, () => context.scheduleClose())}
    />
  );
}

export type HoverCardPortalProps = PortalProps;

/** Renders the card into `document.body` (or the nearest portal container). */
export function HoverCardPortal(props: HoverCardPortalProps) {
  return <Portal {...props} />;
}

export interface HoverCardContentProps extends ComponentPropsWithRef<'div'>, FloatingOptions {
  forceMount?: boolean;
  /** Called on Escape. Prevent it to keep the card open. */
  onEscapeKeyDown?: (event: DismissEvent<KeyboardEvent>) => void;
}

/** The card, positioned next to the trigger with `data-side` and `data-align`. */
export function HoverCardContent({ forceMount, ref, ...props }: HoverCardContentProps) {
  const context = useHoverCardContext('HoverCard.Content');
  const presence = usePresence(context.open);
  const composedRef = useComposedRefs(ref, presence.ref);
  if (!(forceMount || presence.isPresent)) return null;
  return <HoverCardContentImpl {...props} ref={composedRef} context={context} />;
}

function HoverCardContentImpl({
  context,
  ref,
  side = 'bottom',
  align,
  sideOffset = 8,
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
}: Omit<HoverCardContentProps, 'forceMount'> & { context: HoverCardContextValue }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const floating = useFloatingPosition(context.open, { side, align, sideOffset, alignOffset, avoidCollisions, collisionPadding, arrowPadding, hideWhenDetached });
  const composedRef = useComposedRefs(ref, contentRef, floating.refs.setFloating);
  const { setReference } = floating.refs;
  const { trigger, close, cancel, scheduleClose } = context;

  useLayoutEffect(() => {
    setReference(trigger);
  }, [trigger, setReference]);

  useDismissable(contentRef, {
    enabled: context.open,
    onDismiss: close,
    onEscapeKeyDown,
    onInteractOutside: (event) => {
      if (event.target instanceof Node && trigger?.contains(event.target)) event.preventDefault();
    },
  });

  return (
    <div
      data-state={openState(context.open)}
      data-side={floating.side}
      data-align={floating.align}
      data-pada-layer=""
      {...props}
      ref={composedRef}
      style={{ ...floating.floatingStyles, ...style }}
      onPointerEnter={composeEventHandlers(onPointerEnter, () => cancel())}
      onPointerLeave={composeEventHandlers(onPointerLeave, (event) => {
        if (event.pointerType !== 'touch') scheduleClose();
      })}
      onFocus={composeEventHandlers(props.onFocus, () => cancel())}
      onBlur={composeEventHandlers(props.onBlur, (event) => {
        if (!contentRef.current?.contains(event.relatedTarget as Node | null)) scheduleClose();
      })}
    >
      <HoverCardArrowContext value={floating}>{children}</HoverCardArrowContext>
    </div>
  );
}

const [HoverCardArrowContext, useHoverCardArrowContext] = createPartContext<ReturnType<typeof useFloatingPosition>>('HoverCard.Content');

export interface HoverCardArrowProps extends ComponentPropsWithRef<'span'> {
  asChild?: boolean;
}

/** Arrow pointing at the trigger. */
export function HoverCardArrow({ asChild, ref, style, ...props }: HoverCardArrowProps) {
  const floating = useHoverCardArrowContext('HoverCard.Arrow');
  const composedRef = useComposedRefs(ref, floating.setArrowElement);
  const Component = asChild ? Slot : 'span';
  return <Component aria-hidden="true" data-side={floating.side} {...props} ref={composedRef} style={{ ...floating.arrowStyles, ...style }} />;
}

import {
  useCallback,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ComponentPropsWithRef,
  type ReactNode,
  type RefObject,
} from 'react';
import { createPartContext } from '../utils/context';
import { composeEventHandlers, openState } from '../utils/events';
import { useFloatingPosition, type FloatingOptions } from '../utils/floating';
import { useFocusScope, type AutoFocusEvent } from '../utils/focus';
import { useHideOthers } from '../utils/modal';
import { Portal, type PortalProps } from '../utils/Portal';
import { useComposedRefs } from '../utils/refs';
import { Slot } from '../utils/Slot';
import { useControllableState } from '../utils/useControllableState';
import { useDismissable, type DismissEvent } from '../utils/useDismissable';
import { usePresence } from '../utils/usePresence';

interface PopoverContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  modal: boolean;
  triggerRef: RefObject<HTMLButtonElement | null>;
  customAnchor: HTMLElement | null;
  setCustomAnchor: (anchor: HTMLElement | null) => void;
  contentId: string;
}

const [PopoverProvider, usePopoverContext] = createPartContext<PopoverContextValue>('Popover.Root');

export interface PopoverRootProps {
  children?: ReactNode;
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Called when the popover asks to open or close. */
  onOpenChange?: (open: boolean) => void;
  /**
   * Modal popovers trap focus and hide the rest of the page from assistive technology.
   * @default false
   */
  modal?: boolean;
}

/** Holds the open state for a popover. Renders no element. */
export function PopoverRoot({ children, open: openProp, defaultOpen = false, onOpenChange, modal = false }: PopoverRootProps) {
  const [open, setOpen] = useControllableState({ prop: openProp, defaultProp: defaultOpen, onChange: onOpenChange });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [customAnchor, setCustomAnchor] = useState<HTMLElement | null>(null);
  const contentId = `${useId()}popover`;
  const value = useMemo(
    () => ({ open, setOpen, modal, triggerRef, customAnchor, setCustomAnchor, contentId }),
    [open, setOpen, modal, customAnchor, contentId],
  );
  return <PopoverProvider value={value}>{children}</PopoverProvider>;
}

export interface PopoverTriggerProps extends ComponentPropsWithRef<'button'> {
  /** Merge the trigger's behaviour onto its only child instead of rendering a `<button>`. */
  asChild?: boolean;
}

/** Toggles the popover. The content is positioned against it unless a Popover.Anchor exists. */
export function PopoverTrigger({ asChild, onClick, ref, ...props }: PopoverTriggerProps) {
  const context = usePopoverContext('Popover.Trigger');
  const composedRef = useComposedRefs(ref, context.triggerRef);
  const Component = asChild ? Slot : 'button';
  return (
    <Component
      type={asChild ? undefined : 'button'}
      aria-haspopup="dialog"
      aria-expanded={context.open}
      aria-controls={context.open ? context.contentId : undefined}
      data-state={openState(context.open)}
      {...props}
      ref={composedRef}
      onClick={composeEventHandlers(onClick, () => context.setOpen(!context.open))}
    />
  );
}

export interface PopoverAnchorProps extends ComponentPropsWithRef<'div'> {
  /** Use your own element as the anchor instead of rendering a `<div>`. */
  asChild?: boolean;
}

/** Positions the content against this element instead of the trigger. */
export function PopoverAnchor({ asChild, ref, ...props }: PopoverAnchorProps) {
  const context = usePopoverContext('Popover.Anchor');
  const composedRef = useComposedRefs(ref, context.setCustomAnchor);
  const Component = asChild ? Slot : 'div';
  return <Component {...props} ref={composedRef} />;
}

export type PopoverPortalProps = PortalProps;

/** Renders the content into `document.body` (or `container`). */
export function PopoverPortal(props: PopoverPortalProps) {
  return <Portal {...props} />;
}

export interface PopoverContentProps extends ComponentPropsWithRef<'div'>, FloatingOptions {
  /** Keep mounted while closed, for animation libraries that manage presence themselves. */
  forceMount?: boolean;
  /** Called when focus moves into the popover on open. Prevent it to keep focus where it is. */
  onOpenAutoFocus?: (event: AutoFocusEvent) => void;
  /** Called when focus returns to the trigger on close. Prevent it to focus something else. */
  onCloseAutoFocus?: (event: AutoFocusEvent) => void;
  /** Called on Escape. Prevent it to keep the popover open. */
  onEscapeKeyDown?: (event: DismissEvent<KeyboardEvent>) => void;
  /** Called on a pointer-down outside. Prevent it to keep the popover open. */
  onPointerDownOutside?: (event: DismissEvent<PointerEvent>) => void;
  /** Called when focus moves outside. Prevent it to keep the popover open. */
  onFocusOutside?: (event: DismissEvent<FocusEvent>) => void;
  /** Called on any interaction outside. Prevent it to keep the popover open. */
  onInteractOutside?: (event: DismissEvent<PointerEvent | FocusEvent>) => void;
}

/**
 * The floating panel: `role="dialog"`, positioned with `data-side` and `data-align`. Give it an
 * accessible name with `aria-label` or `aria-labelledby`.
 */
export function PopoverContent({ forceMount, ref, ...props }: PopoverContentProps) {
  const context = usePopoverContext('Popover.Content');
  const presence = usePresence(context.open);
  const composedRef = useComposedRefs(ref, presence.ref);
  if (!(forceMount || presence.isPresent)) return null;
  return <PopoverContentImpl {...props} ref={composedRef} context={context} />;
}

function PopoverContentImpl({
  context,
  ref,
  side,
  align,
  sideOffset,
  alignOffset,
  avoidCollisions,
  collisionPadding,
  arrowPadding,
  hideWhenDetached,
  onOpenAutoFocus,
  onCloseAutoFocus,
  onEscapeKeyDown,
  onPointerDownOutside,
  onFocusOutside,
  onInteractOutside,
  style,
  children,
  ...props
}: Omit<PopoverContentProps, 'forceMount'> & { context: PopoverContextValue }) {
  const { open, setOpen, modal, triggerRef, customAnchor } = context;
  const contentRef = useRef<HTMLDivElement>(null);
  const floating = useFloatingPosition(open, { side, align, sideOffset, alignOffset, avoidCollisions, collisionPadding, arrowPadding, hideWhenDetached });
  const composedRef = useComposedRefs(ref, contentRef, floating.refs.setFloating);

  const { setReference } = floating.refs;
  useLayoutEffect(() => {
    setReference(customAnchor ?? triggerRef.current);
  }, [customAnchor, triggerRef, setReference]);

  useHideOthers(contentRef, modal && open);
  useDismissable(contentRef, {
    enabled: open,
    onDismiss: useCallback(() => setOpen(false), [setOpen]),
    onEscapeKeyDown,
    onPointerDownOutside,
    onFocusOutside,
    dismissOnFocusOutside: !modal,
    onInteractOutside: (event) => {
      onInteractOutside?.(event);
      if (event.target instanceof Node && triggerRef.current?.contains(event.target)) event.preventDefault();
    },
  });
  // Focus moves in after the layer registers, so outer layers see the focus as inside a nested layer.
  useFocusScope(contentRef, { trapped: modal && open, onMountAutoFocus: onOpenAutoFocus, onUnmountAutoFocus: onCloseAutoFocus });

  return (
    <div
      id={context.contentId}
      role="dialog"
      aria-modal={modal || undefined}
      tabIndex={-1}
      data-state={openState(open)}
      data-side={floating.side}
      data-align={floating.align}
      data-pada-layer=""
      {...props}
      ref={composedRef}
      style={{ ...floating.floatingStyles, ...style }}
    >
      <ArrowContext value={floating}>{children}</ArrowContext>
    </div>
  );
}

const [ArrowContext, useArrowContext] = createPartContext<ReturnType<typeof useFloatingPosition>>('Popover.Content');

export interface PopoverArrowProps extends ComponentPropsWithRef<'span'> {
  /** Render your own arrow element (an SVG, usually). */
  asChild?: boolean;
}

/** Arrow pointing at the anchor. Positioned automatically; style its size and shape. */
export function PopoverArrow({ asChild, ref, style, ...props }: PopoverArrowProps) {
  const floating = useArrowContext('Popover.Arrow');
  const composedRef = useComposedRefs(ref, floating.setArrowElement);
  const Component = asChild ? Slot : 'span';
  return <Component aria-hidden="true" data-side={floating.side} {...props} ref={composedRef} style={{ ...floating.arrowStyles, ...style }} />;
}

export interface PopoverCloseProps extends ComponentPropsWithRef<'button'> {
  /** Merge the close behaviour onto its only child instead of rendering a `<button>`. */
  asChild?: boolean;
}

/** Closes the popover. Give icon-only close buttons an `aria-label`. */
export function PopoverClose({ asChild, onClick, ...props }: PopoverCloseProps) {
  const context = usePopoverContext('Popover.Close');
  const Component = asChild ? Slot : 'button';
  return (
    <Component type={asChild ? undefined : 'button'} {...props} onClick={composeEventHandlers(onClick, () => context.setOpen(false))} />
  );
}

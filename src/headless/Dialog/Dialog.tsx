import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ComponentPropsWithRef,
  type ReactNode,
  type RefObject,
} from 'react';
import { createPartContext } from '../utils/context';
import { composeEventHandlers, openState } from '../utils/events';
import { useFocusScope, type AutoFocusEvent } from '../utils/focus';
import { useHideOthers, useScrollLock } from '../utils/modal';
import { Portal, type PortalProps } from '../utils/Portal';
import { usePresence } from '../utils/usePresence';
import { useComposedRefs } from '../utils/refs';
import { Slot } from '../utils/Slot';
import { useControllableState } from '../utils/useControllableState';
import { useDismissable, type DismissEvent } from '../utils/useDismissable';

interface DialogContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  modal: boolean;
  triggerRef: RefObject<HTMLButtonElement | null>;
  contentId: string;
  titleId: string;
  descriptionId: string;
  hasTitle: boolean;
  setHasTitle: (value: boolean) => void;
  hasDescription: boolean;
  setHasDescription: (value: boolean) => void;
}

const [DialogProvider, useDialogContext] = createPartContext<DialogContextValue>('Dialog.Root');

export interface DialogRootProps {
  children?: ReactNode;
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Called when the dialog asks to open or close. */
  onOpenChange?: (open: boolean) => void;
  /**
   * Modal dialogs trap focus, lock page scroll and hide the rest of the page from assistive
   * technology. Non-modal dialogs do none of that and close when focus leaves them.
   * @default true
   */
  modal?: boolean;
}

/** Holds the open state for a dialog. Renders no element. WAI-ARIA APG: Dialog (Modal). */
export function DialogRoot({ children, open: openProp, defaultOpen = false, onOpenChange, modal = true }: DialogRootProps) {
  const [open, setOpen] = useControllableState({ prop: openProp, defaultProp: defaultOpen, onChange: onOpenChange });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const baseId = useId();
  const [hasTitle, setHasTitle] = useState(false);
  const [hasDescription, setHasDescription] = useState(false);
  const value = useMemo(
    () => ({
      open,
      setOpen,
      modal,
      triggerRef,
      contentId: `${baseId}content`,
      titleId: `${baseId}title`,
      descriptionId: `${baseId}description`,
      hasTitle,
      setHasTitle,
      hasDescription,
      setHasDescription,
    }),
    [open, setOpen, modal, baseId, hasTitle, hasDescription],
  );
  return <DialogProvider value={value}>{children}</DialogProvider>;
}

export interface DialogTriggerProps extends ComponentPropsWithRef<'button'> {
  /** Merge the trigger's behaviour onto its only child instead of rendering a `<button>`. */
  asChild?: boolean;
}

/** Opens the dialog. Gets `aria-expanded`, `aria-controls` and `data-state`. */
export function DialogTrigger({ asChild, onClick, ref, ...props }: DialogTriggerProps) {
  const context = useDialogContext('Dialog.Trigger');
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

export type DialogPortalProps = PortalProps;

/** Renders the overlay and content into `document.body` (or `container`). */
export function DialogPortal(props: DialogPortalProps) {
  return <Portal {...props} />;
}

export interface DialogOverlayProps extends ComponentPropsWithRef<'div'> {
  /** Keep mounted while closed, for animation libraries that manage presence themselves. */
  forceMount?: boolean;
}

/** Backdrop behind a modal dialog. Not rendered for non-modal dialogs. */
export function DialogOverlay({ forceMount, ref, ...props }: DialogOverlayProps) {
  const context = useDialogContext('Dialog.Overlay');
  const presence = usePresence(context.open);
  const composedRef = useComposedRefs(ref, presence.ref);
  if (!context.modal || !(forceMount || presence.isPresent)) return null;
  return <div data-state={openState(context.open)} data-pada-layer="" {...props} ref={composedRef} />;
}

export interface DialogContentProps extends ComponentPropsWithRef<'div'> {
  /** Keep mounted while closed, for animation libraries that manage presence themselves. */
  forceMount?: boolean;
  /** Called when focus moves into the dialog on open. Prevent it to focus something else. */
  onOpenAutoFocus?: (event: AutoFocusEvent) => void;
  /** Called when focus returns to the trigger on close. Prevent it to focus something else. */
  onCloseAutoFocus?: (event: AutoFocusEvent) => void;
  /** Called on Escape. Prevent it to keep the dialog open. */
  onEscapeKeyDown?: (event: DismissEvent<KeyboardEvent>) => void;
  /** Called on a pointer-down outside the content. Prevent it to keep the dialog open. */
  onPointerDownOutside?: (event: DismissEvent<PointerEvent>) => void;
  /** Called on any interaction outside (pointer or focus). Prevent it to keep the dialog open. */
  onInteractOutside?: (event: DismissEvent<PointerEvent | FocusEvent>) => void;
}

/** The dialog panel: `role="dialog"`, labelled by its Title and described by its Description. */
export function DialogContent({ forceMount, ref, ...props }: DialogContentProps) {
  const context = useDialogContext('Dialog.Content');
  const presence = usePresence(context.open);
  const composedRef = useComposedRefs(ref, presence.ref);
  if (!(forceMount || presence.isPresent)) return null;
  return <DialogContentImpl {...props} ref={composedRef} context={context} />;
}

function DialogContentImpl({
  context,
  ref,
  onOpenAutoFocus,
  onCloseAutoFocus,
  onEscapeKeyDown,
  onPointerDownOutside,
  onInteractOutside,
  ...props
}: Omit<DialogContentProps, 'forceMount'> & { context: DialogContextValue }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const composedRef = useComposedRefs(ref, contentRef);
  const { open, modal, setOpen, triggerRef } = context;

  useScrollLock(modal && open);
  useHideOthers(contentRef, modal && open);
  useDismissable(contentRef, {
    enabled: open,
    onDismiss: useCallback(() => setOpen(false), [setOpen]),
    onEscapeKeyDown,
    onPointerDownOutside,
    dismissOnFocusOutside: !modal,
    onInteractOutside: (event) => {
      onInteractOutside?.(event);
      // A click on the trigger toggles the dialog itself; do not also close it here.
      if (event.target instanceof Node && triggerRef.current?.contains(event.target)) event.preventDefault();
    },
  });
  // Focus moves in after the layer registers, so outer layers see the focus as inside a nested layer.
  useFocusScope(contentRef, {
    trapped: modal && open,
    onMountAutoFocus: onOpenAutoFocus,
    onUnmountAutoFocus: onCloseAutoFocus,
  });

  return (
    <div
      id={context.contentId}
      role="dialog"
      aria-modal={modal || undefined}
      aria-labelledby={context.hasTitle ? context.titleId : undefined}
      aria-describedby={context.hasDescription ? context.descriptionId : undefined}
      tabIndex={-1}
      data-state={openState(open)}
      data-pada-layer=""
      {...props}
      ref={composedRef}
    />
  );
}

function useRegistration(setRegistered: (value: boolean) => void) {
  useEffect(() => {
    setRegistered(true);
    return () => setRegistered(false);
  }, [setRegistered]);
}

export interface DialogTitleProps extends ComponentPropsWithRef<'h2'> {
  /** Render the title's behaviour on your own heading element. */
  asChild?: boolean;
}

/** Accessible name of the dialog. Every dialog needs one (visually hidden if necessary). */
export function DialogTitle({ asChild, ...props }: DialogTitleProps) {
  const context = useDialogContext('Dialog.Title');
  useRegistration(context.setHasTitle);
  const Component = asChild ? Slot : 'h2';
  return <Component id={context.titleId} {...props} />;
}

export interface DialogDescriptionProps extends ComponentPropsWithRef<'p'> {
  /** Render the description's behaviour on your own element. */
  asChild?: boolean;
}

/** Optional description, announced after the title. */
export function DialogDescription({ asChild, ...props }: DialogDescriptionProps) {
  const context = useDialogContext('Dialog.Description');
  useRegistration(context.setHasDescription);
  const Component = asChild ? Slot : 'p';
  return <Component id={context.descriptionId} {...props} />;
}

export interface DialogCloseProps extends ComponentPropsWithRef<'button'> {
  /** Merge the close behaviour onto its only child instead of rendering a `<button>`. */
  asChild?: boolean;
}

/** Closes the dialog. Give icon-only close buttons an `aria-label`. */
export function DialogClose({ asChild, onClick, ...props }: DialogCloseProps) {
  const context = useDialogContext('Dialog.Close');
  const Component = asChild ? Slot : 'button';
  return (
    <Component
      type={asChild ? undefined : 'button'}
      {...props}
      onClick={composeEventHandlers(onClick, () => context.setOpen(false))}
    />
  );
}

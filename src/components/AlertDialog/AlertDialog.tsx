import { useRef } from 'react';
import { useComposedRefs } from '../../headless/utils/refs';
import { DialogClose as HeadlessClose, type DialogContentProps as HeadlessContentProps } from '../../headless/Dialog/Dialog';
import { Button, type ButtonProps } from '../Button';
import { DialogContent, type DialogContentProps } from '../Dialog/Dialog';

export interface AlertDialogContentProps extends Omit<DialogContentProps, 'onPointerDownOutside' | 'onInteractOutside'> {
  /** Called when focus moves in. By default it lands on the Cancel button, the safe choice. */
  onOpenAutoFocus?: HeadlessContentProps['onOpenAutoFocus'];
}

/**
 * The confirmation panel: `role="alertdialog"`. Unlike a dialog it does not close on a click
 * outside: the user has to choose. Focus starts on Cancel.
 */
export function AlertDialogContent({ size = 'sm', onOpenAutoFocus, ref, ...props }: AlertDialogContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const composedRef = useComposedRefs(ref, contentRef);
  return (
    <DialogContent
      role="alertdialog"
      size={size}
      {...props}
      ref={composedRef}
      onPointerDownOutside={(event) => event.preventDefault()}
      onOpenAutoFocus={(event) => {
        onOpenAutoFocus?.(event);
        if (event.defaultPrevented) return;
        const cancel = contentRef.current?.querySelector<HTMLElement>('[data-alert-dialog-cancel]');
        if (cancel) {
          event.preventDefault();
          cancel.focus({ preventScroll: true });
        }
      }}
    />
  );
}

/** The safe choice. Closes the dialog. */
export function AlertDialogCancel({ variant = 'secondary', ...props }: ButtonProps) {
  return (
    <HeadlessClose asChild>
      <Button variant={variant} data-alert-dialog-cancel="" {...props} />
    </HeadlessClose>
  );
}

/** The confirming action. Closes the dialog after `onClick`, unless the handler prevents it. */
export function AlertDialogAction({ variant = 'primary', ...props }: ButtonProps) {
  return (
    <HeadlessClose asChild>
      <Button variant={variant} {...props} />
    </HeadlessClose>
  );
}

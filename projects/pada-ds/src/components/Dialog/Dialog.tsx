import type { ComponentPropsWithRef } from 'react';
import {
  DialogClose as HeadlessClose,
  DialogContent as HeadlessContent,
  DialogDescription as HeadlessDescription,
  DialogOverlay as HeadlessOverlay,
  DialogPortal as HeadlessPortal,
  DialogTitle as HeadlessTitle,
  type DialogCloseProps as HeadlessCloseProps,
  type DialogContentProps as HeadlessContentProps,
  type DialogDescriptionProps as HeadlessDescriptionProps,
  type DialogTitleProps as HeadlessTitleProps,
} from '../../headless/Dialog/Dialog';
import { Icon } from '../Icon';
import './Dialog.css';

export {
  DialogRoot,
  DialogTrigger,
  type DialogRootProps,
  type DialogTriggerProps,
} from '../../headless/Dialog/Dialog';

const cx = (...names: (string | undefined | false)[]) => names.filter(Boolean).join(' ');

export type DialogSize = 'auto' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface DialogContentProps extends HeadlessContentProps {
  /** Width preset: auto (fits the content), sm 24rem, md 32rem, lg 44rem, xl 56rem, full (fills the viewport less a margin). */
  size?: DialogSize;
  /** Element to portal into. Defaults to `document.body`. */
  container?: Element | null;
  /** Props for the backdrop behind the dialog. */
  overlayProps?: ComponentPropsWithRef<'div'>;
}

/**
 * The dialog panel, with its backdrop, rendered in a portal. Animates in and out; respects
 * reduced motion. Restyle through `--pada-dialog-*` tokens on the element or a parent.
 */
export function DialogContent({ size = 'md', container, overlayProps, className, children, ...props }: DialogContentProps) {
  return (
    <HeadlessPortal container={container}>
      <HeadlessOverlay {...overlayProps} className={cx('dialog-overlay', overlayProps?.className)} />
      <HeadlessContent data-size={size} {...props} className={cx('dialog', className)}>
        {children}
      </HeadlessContent>
    </HeadlessPortal>
  );
}

export interface DialogSectionProps extends ComponentPropsWithRef<'div'> {
  /** Main axis alignment of the section's children. */
  justify?: 'start' | 'end' | 'between';
}

/** Top section: the title, description and close button. */
export function DialogHeader({ className, ...props }: ComponentPropsWithRef<'div'>) {
  return <div {...props} className={cx('dialog-header', className)} />;
}

/** The dialog's accessible name, styled as its heading. */
export function DialogTitle({ className, ...props }: HeadlessTitleProps) {
  return <HeadlessTitle {...props} className={cx('dialog-title', className)} />;
}

/** Supporting text under the title, announced after it. */
export function DialogDescription({ className, ...props }: HeadlessDescriptionProps) {
  return <HeadlessDescription {...props} className={cx('dialog-description', className)} />;
}

/** Scrollable main content. */
export function DialogBody({ className, ...props }: ComponentPropsWithRef<'div'>) {
  return <div {...props} className={cx('dialog-body', className)} />;
}

/** Bottom section for actions. Defaults to right-aligned buttons. */
export function DialogFooter({ justify = 'end', className, ...props }: DialogSectionProps) {
  return <div data-justify={justify} {...props} className={cx('dialog-footer', className)} />;
}

/** Closes the dialog. Unstyled: wrap your own button with `asChild`. */
export function DialogClose(props: HeadlessCloseProps) {
  return <HeadlessClose {...props} />;
}

export interface DialogCloseButtonProps extends Omit<HeadlessCloseProps, 'children' | 'asChild'> {
  /** Accessible name of the icon button. */
  label?: string;
}

/** Icon button in the top corner that closes the dialog. */
export function DialogCloseButton({ label = 'Close', className, ...props }: DialogCloseButtonProps) {
  return (
    <HeadlessClose aria-label={label} {...props} className={cx('dialog-close', className)}>
      <Icon name="cross_1" size={16} aria-hidden="true" />
    </HeadlessClose>
  );
}

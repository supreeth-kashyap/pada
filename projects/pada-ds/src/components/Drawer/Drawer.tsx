import type { ComponentPropsWithRef } from 'react';
import {
  DialogContent as HeadlessContent,
  DialogOverlay as HeadlessOverlay,
  DialogPortal as HeadlessPortal,
  type DialogContentProps as HeadlessContentProps,
} from '../../headless/Dialog/Dialog';
import './Drawer.css';

const cx = (...names: (string | undefined | false)[]) => names.filter(Boolean).join(' ');

export type DrawerSide = 'left' | 'right' | 'top' | 'bottom';
export type DrawerSize = 'sm' | 'md' | 'lg' | 'xl';

export interface DrawerContentProps extends HeadlessContentProps {
  /** Edge the drawer slides in from. */
  side?: DrawerSide;
  /** Width (left/right) or height (top/bottom): sm 496px, md 640px, lg 800px, xl 960px. */
  size?: DrawerSize;
  /** Element to portal into. Defaults to `document.body`. */
  container?: Element | null;
  /** Props for the backdrop behind the drawer. */
  overlayProps?: ComponentPropsWithRef<'div'>;
}

/**
 * A dialog panel that slides in from an edge of the screen, with its backdrop, rendered in a
 * portal. Use the Dialog parts inside it (`Drawer.Header`, `Drawer.Title`, `Drawer.Body`, …).
 */
export function DrawerContent({ side = 'right', size = 'sm', container, overlayProps, className, ...props }: DrawerContentProps) {
  return (
    <HeadlessPortal container={container}>
      <HeadlessOverlay {...overlayProps} className={cx('dialog-overlay', overlayProps?.className)} />
      <HeadlessContent data-side={side} data-size={size} {...props} className={cx('drawer', className)} />
    </HeadlessPortal>
  );
}

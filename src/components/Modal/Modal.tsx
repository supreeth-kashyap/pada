import React from 'react';
import { DialogBody, DialogCloseButton, DialogContent, DialogHeader, DialogRoot, DialogTitle } from '../Dialog/Dialog';
import { dialogSizeStyle } from '../Dialog/dialogSizeStyle';

export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  title?: string;
  width?: number | string;
  height?: number | string;
}

/**
 * A modal dialog with an optional title and a close button.
 *
 * @deprecated Since 2.0. Use `Dialog` (`Dialog.Root`, `Dialog.Content`, `Dialog.Title`, …),
 * which this wraps and which adds a trigger, description, footer and sizes. Removed in 3.0.
 */
export const Modal: React.FC<ModalProps> = ({ open, onOpenChange, children, title, width, height }) => (
  <DialogRoot open={open} onOpenChange={onOpenChange}>
    <DialogContent size="auto" style={dialogSizeStyle(width, height)}>
      {title && (
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
      )}
      <DialogBody>{children}</DialogBody>
      <DialogCloseButton label="Close modal" />
    </DialogContent>
  </DialogRoot>
);

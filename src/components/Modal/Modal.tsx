import React, { useEffect, useId, useRef } from 'react';
import './Modal.css';
import { Icon } from '../Icon';
import { Text, TextSize } from '../Text';


export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  title?: string;
  width?: number | string;
  height?: number | string;
}

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]',
  '[contenteditable="true"]',
].join(', ');

// Tabbable elements inside the dialog, in DOM order. Scoped to the dialog
// node, never the document (instructions.md §6.a).
const getTabbable = (root: HTMLElement | null): HTMLElement[] =>
  root
    ? Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
        (element) => element.tabIndex >= 0 && !element.closest('[hidden]'),
      )
    : [];

export const Modal: React.FC<ModalProps> = ({ open, onOpenChange, children, title, width, height }) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onOpenChange(false);
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
    } else {
      document.removeEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, onOpenChange]);

  // WAI-ARIA APG dialog (modal): move focus in on open, lock page scroll
  // while open, and hand focus back to whatever opened the dialog on close.
  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const dialog = dialogRef.current;
    const [first] = getTabbable(dialog);
    (first ?? dialog)?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      if (previouslyFocused?.isConnected) {
        previouslyFocused.focus();
      }
    };
  }, [open]);

  // Keep Tab / Shift+Tab cycling inside the dialog.
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Tab') return;

    const tabbable = getTabbable(dialogRef.current);
    if (tabbable.length === 0) {
      event.preventDefault();
      return;
    }

    const first = tabbable[0];
    const last = tabbable[tabbable.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && (active === first || active === dialogRef.current)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  };

  if (!open) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={() => onOpenChange(false)}>
      <div
        ref={dialogRef}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
        style={{
          ...(width ? { width } : {}),
          ...(height ? { height } : {}),
        }}
      >
        {title && (
          <Text as="h2" id={titleId} size={TextSize.BASE} style={{ margin: 0 }}>
            {title}
          </Text>
        )}
        <div className="modal-content">
          {children}
        </div>
        <button className="modal-close" onClick={() => onOpenChange(false)} aria-label="Close modal" type="button">
          <Icon name="cross_1" size={16} color="var(--color-neutral-600)" />
        </button>
      </div>
    </div>
  );
};

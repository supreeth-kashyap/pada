import React, { useEffect } from 'react';
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

export const Modal: React.FC<ModalProps> = ({ open, onOpenChange, children, title, width, height }) => {
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

  if (!open) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={() => onOpenChange(false)}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
        style={{
          ...(width ? { width } : {}),
          ...(height ? { height } : {}),
        }}
      >
        {title && <Text size={TextSize.BASE}>{title}</Text>}
        <div className="modal-content">
          {children}
        </div>
        <button className="modal-close" onClick={() => onOpenChange(false)} aria-label="Close modal" type="button">
          <Icon name="close" src="e5cd" size={16} color="var(--color-neutral-600)" />
        </button>
      </div>
    </div>
  );
};

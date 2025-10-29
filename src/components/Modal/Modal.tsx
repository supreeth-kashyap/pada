import React, { useEffect, useRef } from 'react';
import './Modal.css';

export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  title?: string;
}

export const Modal: React.FC<ModalProps> = ({ open, onOpenChange, children, title }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onOpenChange(false);
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
      modalRef.current?.focus();
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
        ref={modalRef}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        {title && <h2 id="modal-title" className="modal-title">{title}</h2>}
        <div className="modal-content">
          {children}
        </div>
        <button className="modal-close" onClick={() => onOpenChange(false)} aria-label="Close modal">&times;</button>
      </div>
    </div>
  );
};

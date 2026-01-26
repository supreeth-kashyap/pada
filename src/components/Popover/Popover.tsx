import React, { useEffect, useRef, useState } from 'react';
import './Popover.css';
import { Icon } from '../Icon';

export type PopoverPosition = 'top' | 'bottom' | 'left' | 'right' | 'auto';
export type PopoverVariant = 'default' | 'active';

export interface PopoverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  trigger?: React.ReactElement;
  position?: PopoverPosition;
  title?: string;
  variant?: PopoverVariant;
  showClose?: boolean;
  className?: string;
  clickPosition?: { x: number; y: number };
}

export const Popover: React.FC<PopoverProps> = ({
  open,
  onOpenChange,
  children,
  trigger,
  position = 'auto',
  title,
  variant = 'default',
  showClose = true,
  className = '',
  clickPosition
}) => {
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement>(null);
  const [calculatedPosition, setCalculatedPosition] = useState<PopoverPosition>(position);
  const [popoverStyles, setPopoverStyles] = useState<React.CSSProperties>({});
  const [triggerClickPosition, setTriggerClickPosition] = useState<{ x: number; y: number } | null>(null);
  const lastPointerPositionRef = useRef<{ x: number; y: number } | null>(null);

  // Callback ref to handle trigger element ref
  const setTriggerRef = React.useCallback((node: HTMLElement | null) => {
    triggerRef.current = node;
    // If trigger has its own ref, call it too
    if (trigger) {
      const existingRef = (trigger as any).ref;
      if (typeof existingRef === 'function') {
        existingRef(node);
      } else if (existingRef && typeof existingRef === 'object' && 'current' in existingRef) {
        existingRef.current = node;
      }
    }
  }, [trigger]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onOpenChange(false);
      }
    };
    const handlePointerDown = (event: PointerEvent) => {
      lastPointerPositionRef.current = { x: event.clientX, y: event.clientY };
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
    } else {
      document.removeEventListener('keydown', handleEscape);
    }

    document.addEventListener('pointerdown', handlePointerDown, true);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('pointerdown', handlePointerDown, true);
    };
  }, [open, onOpenChange]);

  useEffect(() => {
    if (open && popoverRef.current) {
      const popoverRect = popoverRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let finalPosition = position;
      let top = 0;
      let left = 0;

      // If clickPosition is provided, use it
      if (clickPosition) {
        top = clickPosition.y;
        left = clickPosition.x;
        finalPosition = 'bottom';
      } else if (triggerClickPosition) {
        top = triggerClickPosition.y;
        left = triggerClickPosition.x;
        finalPosition = 'bottom';
      } else if (lastPointerPositionRef.current) {
        top = lastPointerPositionRef.current.y;
        left = lastPointerPositionRef.current.x;
        finalPosition = 'bottom';
      } else if (triggerRef.current) {
        // Otherwise, position relative to trigger
        const triggerRect = triggerRef.current.getBoundingClientRect();

        if (position === 'auto') {
          // Auto-detect best position
          const spaceBelow = viewportHeight - triggerRect.bottom;
          const spaceAbove = triggerRect.top;
          const spaceRight = viewportWidth - triggerRect.right;

          if (spaceBelow >= popoverRect.height) {
            finalPosition = 'bottom';
          } else if (spaceAbove >= popoverRect.height) {
            finalPosition = 'top';
          } else if (spaceRight >= popoverRect.width) {
            finalPosition = 'right';
          } else {
            finalPosition = 'left';
          }
        }

        // Calculate position based on final position
        switch (finalPosition) {
          case 'bottom':
            top = triggerRect.bottom + 8;
            left = triggerRect.left + (triggerRect.width / 2) - (popoverRect.width / 2);
            break;
          case 'top':
            top = triggerRect.top - popoverRect.height - 8;
            left = triggerRect.left + (triggerRect.width / 2) - (popoverRect.width / 2);
            break;
          case 'right':
            top = triggerRect.top + (triggerRect.height / 2) - (popoverRect.height / 2);
            left = triggerRect.right + 8;
            break;
          case 'left':
            top = triggerRect.top + (triggerRect.height / 2) - (popoverRect.height / 2);
            left = triggerRect.left - popoverRect.width - 8;
            break;
        }
      }

      // Keep popover within viewport
      if (left < 8) left = 8;
      if (left + popoverRect.width > viewportWidth - 8) {
        left = viewportWidth - popoverRect.width - 8;
      }
      if (top < 8) top = 8;
      if (top + popoverRect.height > viewportHeight - 8) {
        top = viewportHeight - popoverRect.height - 8;
      }

      setCalculatedPosition(finalPosition);
      setPopoverStyles({ top: `${top}px`, left: `${left}px` });
    }
  }, [open, position, clickPosition, triggerClickPosition]);

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTriggerClickPosition({ x: e.clientX, y: e.clientY });
    onOpenChange(!open);
  };

  const handleOutsideClick = () => {
    onOpenChange(false);
  };

  const clonedTrigger = trigger ? React.cloneElement(trigger, {
    ...(trigger.props || {}),
    ref: setTriggerRef,
    onClick: (e: React.MouseEvent) => {
      handleTriggerClick(e);
      if (trigger.props && typeof trigger.props === 'object' && 'onClick' in trigger.props) {
        (trigger.props as any).onClick?.(e);
      }
    }
  } as any) : null;

  if (!open) {
    return clonedTrigger;
  }

  return (
    <>
      {clonedTrigger}
      <div className="popover-overlay" onClick={handleOutsideClick}>
        <div
          ref={popoverRef}
          className={`popover popover--${calculatedPosition} popover--${variant} ${className}`.trim()}
          role="dialog"
          aria-labelledby={title ? "popover-title" : undefined}
          onClick={(e) => e.stopPropagation()}
          style={popoverStyles}
        >
          {title && <h3 id="popover-title" className="popover-title">{title}</h3>}
          <div className="popover-content">
            {children}
          </div>
          {variant === 'active' && (
            <div className="popover-icon">
              <Icon name="star" size={16} color="var(--color-purple-600)" />
            </div>
          )}
          {showClose && (
            <button 
              className="popover-close" 
              onClick={() => onOpenChange(false)} 
              aria-label="Close popover"
            >
              &times;
            </button>
          )}
        </div>
      </div>
    </>
  );
};

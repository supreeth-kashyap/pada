import React, { useState } from 'react';
import './Accordion.css';
import { Icon } from '../Icon';

export interface AccordionProps {
  header: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  header,
  children,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
  className = '',
}) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const headerId = React.useId();
  const contentId = React.useId();
  
  // Use controlled state if provided, otherwise use internal state
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  
  const handleToggle = () => {
    const newOpen = !isOpen;
    if (controlledOpen === undefined) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleToggle();
    }
  };

  return (
    <div className={`accordion ${className}`}>
      <button
        id={headerId}
        className={`accordion__header ${isOpen ? 'accordion__header--open' : ''}`}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-controls={contentId}
        type="button"
      >
        <div className="accordion__header-content">
          {header}
        </div>
        <div className="accordion__header-icon">
          <Icon 
            name="chevron_down" 
            size="sm" 
            color="Icy"
            className={`accordion__chevron ${isOpen ? 'accordion__chevron--open' : ''}`}
          />
        </div>
      </button>
      {isOpen && (
        <div 
          id={contentId}
          className="accordion__body"
          role="region"
          aria-labelledby={headerId}
        >
          {children}
        </div>
      )}
    </div>
  );
};

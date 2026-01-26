import React, { useState } from 'react';
import './Accordion.css';
import { AccordionHeader } from './AccordionHeader/AccordionHeader';
import { AccordionContent } from './AccordionContent/AccordionContent';

export interface AccordionProps {
  header: React.ReactNode;
  headerIconName?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  disabled?: boolean;
}

export const Accordion: React.FC<AccordionProps> = ({
  header,
  children,
  headerIconName,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
  className = '',
  disabled = false,
}) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const headerId = React.useId();
  const contentId = React.useId();
  
  // Use controlled state if provided, otherwise use internal state
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  
  const handleToggle = () => {
    if (disabled) return;
    const newOpen = !isOpen;
    if (controlledOpen === undefined) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  };

  return (
    <div className={`accordion ${className}`}>
      <AccordionHeader
        id={headerId}
        title={header}
        iconName={headerIconName}
        collapsed={!isOpen}
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-controls={contentId}
        disabled={disabled}
      />
      {isOpen && (
        <AccordionContent
          id={contentId}
          role="region"
          aria-labelledby={headerId}
        >
          {children}
        </AccordionContent>
      )}
    </div>
  );
};

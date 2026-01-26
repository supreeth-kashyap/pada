import React from 'react';
import './AccordionContent.css';

export interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const AccordionContent: React.FC<AccordionContentProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div className={`accordion__body ${className}`} {...props}>
      {children}
    </div>
  );
};

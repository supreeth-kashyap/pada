import React from 'react';
import './Dropdown.css';

export interface DropdownFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const DropdownFooter = ({
  children,
  className = '',
}: DropdownFooterProps) => {
  return (
    <div className={`dropdown__footer ${className}`}>
      {children}
    </div>
  );
};

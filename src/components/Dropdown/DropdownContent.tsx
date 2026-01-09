import React from 'react';
import './Dropdown.css';

export interface DropdownContentProps {
  children: React.ReactNode;
  className?: string;
}

export const DropdownContent = ({
  children,
  className = '',
}: DropdownContentProps) => {
  return (
    <div className={`dropdown__content ${className}`}>
      {children}
    </div>
  );
};

DropdownContent.displayName = 'DropdownContent';

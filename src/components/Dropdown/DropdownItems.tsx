import React from 'react';
import './Dropdown.css';

export interface DropdownItemsProps {
  children: React.ReactNode;
  className?: string;
}

export const DropdownItems = ({
  children,
  className = '',
}: DropdownItemsProps) => {
  return (
    <div className={`dropdown__items ${className}`}>
      {children}
    </div>
  );
};

import React from 'react';
import { Text } from '../Text';
import './Dropdown.css';

export interface DropdownSectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const DropdownSection = ({
  title,
  children,
  className = '',
}: DropdownSectionProps) => {
  return (
    <div className={`dropdown__section ${className}`}>
      {title && (
        <div className="dropdown__section-title">
          <Text size="xs" weight={600} color="var(--color-neutral-500)">
            {title}
          </Text>
        </div>
      )}
      <div className="dropdown__section-content">
        {children}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import './SidebarCollapse.css';

export interface SidebarCollapseProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
  label?: string;
  className?: string;
}

export const SidebarCollapse: React.FC<SidebarCollapseProps> = ({
  children,
  defaultOpen = false,
  label,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`sidebar-collapse ${className}`.trim()}>
      {label && (
        <button
          className="sidebar-collapse__trigger"
          onClick={toggle}
          aria-expanded={isOpen}
          aria-controls="sidebar-collapse-content"
        >
          <span className="sidebar-collapse__label">{label}</span>
          <span className={`sidebar-collapse__icon ${isOpen ? 'sidebar-collapse__icon--open' : ''}`}>
            ▼
          </span>
        </button>
      )}
      <div
        id="sidebar-collapse-content"
        className={`sidebar-collapse__content ${isOpen ? 'sidebar-collapse__content--open' : ''}`}
      >
        {children}
      </div>
    </div>
  );
};

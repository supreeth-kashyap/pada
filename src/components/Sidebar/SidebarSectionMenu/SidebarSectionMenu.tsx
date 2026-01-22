import React from 'react';
import './SidebarSectionMenu.css';

export interface SidebarSectionMenuProps {
  children: React.ReactNode;
  className?: string;
}

export const SidebarSectionMenu: React.FC<SidebarSectionMenuProps> = ({
  children,
  className = ''
}) => {
  return (
    <ul className={`sidebar-section-menu ${className}`.trim()}>
      {children}
    </ul>
  );
};

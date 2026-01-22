import React from 'react';
import './SidebarMenu.css';

export interface SidebarMenuProps {
  children: React.ReactNode;
  className?: string;
}

export const SidebarMenu: React.FC<SidebarMenuProps> = ({ children, className = '' }) => {
  return (
    <nav className={`sidebar-menu ${className}`.trim()}>
      {children}
    </nav>
  );
};

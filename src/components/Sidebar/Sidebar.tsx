import React from 'react';
import './Sidebar.css';

export interface SidebarProps {
  children: React.ReactNode;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ children, className = '' }) => {
  return (
    <aside className={`sidebar ${className}`.trim()}>
      {children}
    </aside>
  );
};

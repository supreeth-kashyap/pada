import React from 'react';
import './SidebarSection.css';

export interface SidebarSectionProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export const SidebarSection: React.FC<SidebarSectionProps> = ({
  children,
  title,
  className = ''
}) => {
  return (
    <section className={`sidebar-section ${className}`.trim()}>
      {title && <h3 className="sidebar-section__title">{title}</h3>}
      <div className="sidebar-section__content">
        {children}
      </div>
    </section>
  );
};

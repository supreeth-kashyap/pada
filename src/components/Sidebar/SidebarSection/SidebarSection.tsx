import React from 'react';
import './SidebarSection.css';

export interface SidebarSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Section heading label. When omitted, the section renders only its children (acts as a group container). */
  label?: React.ReactNode;
  /** Optional icon shown before the label */
  icon?: React.ReactNode | string;
  /** Menu items / arbitrary children belonging to the section */
  children?: React.ReactNode;
  className?: string;
}

const renderIcon = (icon: SidebarSectionProps['icon']) => {
  if (icon === undefined || icon === null || icon === false) return null;
  if (typeof icon === 'string') {
    return (
      <span className="sidebar-section__icon" aria-hidden="true">
        <img src={icon} alt="" className="sidebar-section__icon-img" />
      </span>
    );
  }
  return (
    <span className="sidebar-section__icon" aria-hidden="true">
      {icon}
    </span>
  );
};

export const SidebarSection = React.forwardRef<HTMLDivElement, SidebarSectionProps>(
  ({ label, icon, children, className = '', ...rest }, ref) => {
    const classes = ['sidebar-section', className].filter(Boolean).join(' ');
    return (
      <div ref={ref} className={classes} {...rest}>
        {label !== undefined && (
          <div className="sidebar-section__header">
            {renderIcon(icon)}
            <span className="sidebar-section__label">{label}</span>
          </div>
        )}
        {children !== undefined && (
          <div className="sidebar-section__items">{children}</div>
        )}
      </div>
    );
  }
);

SidebarSection.displayName = 'SidebarSection';

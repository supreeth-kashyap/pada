import React from 'react';
import './SidebarMenu.css';

export interface SidebarMenuProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  /** Visible text for the menu item */
  label: React.ReactNode;
  /** Optional leading icon (16x16). Can be a ReactNode or an image src URL */
  icon?: React.ReactNode | string;
  /** Whether the item is currently selected (active route) */
  selected?: boolean;
  /** Optional badge / trailing content */
  trailing?: React.ReactNode;
  /** Renders as an anchor when provided; otherwise renders as a button */
  href?: string;
  /** Click handler – receives the synthetic event */
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  disabled?: boolean;
  className?: string;
}

const renderIcon = (icon: SidebarMenuProps['icon']) => {
  if (icon === undefined || icon === null || icon === false) return null;
  if (typeof icon === 'string') {
    return (
      <span className="sidebar-menu__icon" aria-hidden="true">
        <img src={icon} alt="" className="sidebar-menu__icon-img" />
      </span>
    );
  }
  return (
    <span className="sidebar-menu__icon" aria-hidden="true">
      {icon}
    </span>
  );
};

export const SidebarMenu = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  SidebarMenuProps
>(
  (
    {
      label,
      icon,
      selected = false,
      trailing,
      href,
      onClick,
      disabled = false,
      className = '',
      ...rest
    },
    ref
  ) => {
    const classes = [
      'sidebar-menu',
      selected && 'sidebar-menu--selected',
      disabled && 'sidebar-menu--disabled',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const content = (
      <>
        {renderIcon(icon)}
        <span className="sidebar-menu__label">{label}</span>
        {trailing !== undefined && (
          <span className="sidebar-menu__trailing">{trailing}</span>
        )}
      </>
    );

    if (href && !disabled) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          className={classes}
          href={href}
          aria-current={selected ? 'page' : undefined}
          onClick={onClick}
          {...(rest as unknown as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {content}
        </a>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type="button"
        className={classes}
        aria-current={selected ? 'page' : undefined}
        aria-disabled={disabled || undefined}
        disabled={disabled}
        onClick={onClick}
        {...rest}
      >
        {content}
      </button>
    );
  }
);

SidebarMenu.displayName = 'SidebarMenu';

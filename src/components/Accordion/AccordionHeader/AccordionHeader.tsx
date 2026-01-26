import React from 'react';
import './AccordionHeader.css';
import { Icon } from '../../Icon';

export interface AccordionHeaderProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: React.ReactNode;
  iconName?: string;
  collapsed?: boolean;
}

export const AccordionHeader: React.FC<AccordionHeaderProps> = ({
  title,
  iconName,
  collapsed = true,
  className = '',
  type = 'button',
  ...props
}) => {
  return (
    <button
      type={type}
      className={`accordion-header ${className}`}
      data-collapsed={collapsed}
      {...props}
    >
      {iconName ? (
        <div className="accordion-header__icon">
          <Icon name={iconName} size="xs" />
        </div>
      ) : null}
      <div className="accordion-header__title">{title}</div>
      <div className="accordion-header__chevron">
        <Icon name="chevron_down" size="xs" />
      </div>
    </button>
  );
};

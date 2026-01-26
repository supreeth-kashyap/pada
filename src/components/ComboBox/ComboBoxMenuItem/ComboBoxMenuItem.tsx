import React from 'react';
import './ComboBoxMenuItem.css';
import { Icon } from '../../Icon';

export interface ComboBoxMenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  iconName?: string;
  label: React.ReactNode;
  selected?: boolean;
  disabled?: boolean;
  multiSelect?: boolean;
}

export const ComboBoxMenuItem: React.FC<ComboBoxMenuItemProps> = ({
  iconName,
  label,
  selected = false,
  disabled = false,
  multiSelect = false,
  className = '',
  type = 'button',
  ...props
}) => {
  return (
    <button
      type={type}
      className={`combo-box-menu-item ${className}`.trim()}
      data-selected={selected}
      data-multiselect={multiSelect}
      disabled={disabled}
      aria-selected={selected}
      role="option"
      {...props}
    >
      {iconName && (
        <span className="combo-box-menu-item__icon" aria-hidden="true">
          <Icon name={iconName} size={16} />
        </span>
      )}
      <span className="combo-box-menu-item__label">{label}</span>
      {multiSelect && (
        <span className="combo-box-menu-item__tick" aria-hidden="true">
          <Icon name="tick_1" size={12} />
        </span>
      )}
    </button>
  );
};

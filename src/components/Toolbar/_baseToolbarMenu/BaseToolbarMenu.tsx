import React from 'react';
import './BaseToolbarMenu.css';
import { Icon } from '../../Icon';

export type BaseToolbarMenuState = 'default' | 'hover' | 'active' | 'focus' | 'disabled';

export interface BaseToolbarMenuProps {
  title?: string;
  count?: number | string;
  showCount?: boolean;
  dropdown?: boolean;
  disabled?: boolean;
  state?: BaseToolbarMenuState;
  className?: string;
  onClick?: () => void;
}

export const BaseToolbarMenu: React.FC<BaseToolbarMenuProps> = ({
  title = 'menu',
  count = 1232,
  showCount = true,
  dropdown = true,
  disabled = false,
  state = 'default',
  className = '',
  onClick
}) => {
  const isDisabled = disabled || state === 'disabled';

  return (
    <button
      type="button"
      className={`base-toolbar-menu base-toolbar-menu--${state} ${className}`.trim()}
      onClick={isDisabled ? undefined : onClick}
      disabled={isDisabled}
    >
      <span className="base-toolbar-menu__title">{title}</span>
      {showCount && (
        <span className="base-toolbar-menu__badge">
          <span className="base-toolbar-menu__badge-text">{count}</span>
        </span>
      )}
      {dropdown && <Icon name="chevron_down" size="xs" color="Icy" />}
    </button>
  );
};

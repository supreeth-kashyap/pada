import React, { useState, useRef, useEffect } from 'react';
import { Icon } from '../Icon';
import { Logo } from '../Logo';
import { useButtonGroupContext } from './ButtonGroup';
import type { ButtonGroupItemProps } from './ButtonGroupItem';
import './ButtonGroup.css';

export interface ButtonGroupSplitActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  items: ButtonGroupItemProps[];
}

const getIconColor = (variant: 'primary' | 'secondary'): 'Icy' | 'White' => {
  return variant === 'primary' ? 'White' : 'Icy';
};

export const ButtonGroupSplitAction = ({
  items = [],
  className = '',
  ...props 
}: ButtonGroupSplitActionProps) => {
  const context = useButtonGroupContext();
  const variant = context?.variant || 'primary';
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const iconColor = getIconColor(variant);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleDropdownToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleItemClick = (item: ButtonGroupItemProps, event: React.MouseEvent<HTMLButtonElement>) => {
    if (item.disabled) return;
    
    if (item.onClick) {
      item.onClick(event);
    }
    setIsDropdownOpen(false);
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <>
      <button
        ref={buttonRef}
        className={`button-group__item button-group__split-action-dropdown ${className}`}
        onClick={handleDropdownToggle}
        aria-expanded={isDropdownOpen}
        aria-haspopup="true"
        {...props}
      >
        <Icon name="chevron_down" size="xs" color={iconColor} />
      </button>
      {isDropdownOpen && items.length > 0 && (
        <div className="button-group__dropdown" ref={dropdownRef}>
          {items.map((item, index) => {
            const hasLabel = Boolean(item.children);
            return (
              <button
                key={index}
                className={`button-group__dropdown-item ${item.disabled ? 'button-group__dropdown-item--disabled' : ''}`}
                onClick={(e) => handleItemClick(item, e)}
                disabled={item.disabled}
              >
                {item.leftIcon && (
                  <Icon name={item.leftIcon} size="xs" color="Icy" className="button-group__icon" />
                )}
                {item.leftLogo && (
                  <Logo name={item.leftLogo} size="xs" className="button-group__logo" />
                )}
                {hasLabel && <span className="button-group__label">{item.children}</span>}
              </button>
            );
          })}
        </div>
      )}
    </>
  );
};

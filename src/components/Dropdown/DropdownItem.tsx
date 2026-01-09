import React from 'react';
import { Checkbox } from '../Checkbox';
import { Icon } from '../Icon';
import { Logo } from '../Logo';
import { Text } from '../Text';
import { TextWeight } from '../Text/helpers';
import { useDropdownContext } from './Dropdown';
import './Dropdown.css';

export type DropdownItemVisualType = 'icon' | 'logo';

export interface DropdownItemVisual {
  type: DropdownItemVisualType;
  name: string;
  background?: boolean;
}

export interface DropdownItemProps {
  value: string;
  label: string;
  subLabel?: string;
  visual?: DropdownItemVisual;
  disabled?: boolean;
  onClick?: (value: string) => void;
  className?: string;
}

export const DropdownItem = ({
  value,
  label,
  subLabel,
  visual,
  disabled = false,
  onClick,
  className = '',
}: DropdownItemProps) => {
  const context = useDropdownContext();
  const selectionMode = context.selectionMode;
  const selectedValues = context.selectedValues;
  const isSelected = selectedValues.includes(value);

  const handleClick = () => {
    if (disabled) return;

    if (selectionMode === 'single') {
      context.onSelect?.(value);
    } else if (selectionMode === 'multi') {
      if (isSelected) {
        context.onDeselect?.(value);
      } else {
        context.onSelect?.(value);
      }
    } else {
      onClick?.(value);
    }
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleClick();
  };

  const renderVisual = () => {
    if (!visual) return null;

    if (visual.type === 'icon') {
      return (
        <div className="dropdown__item-visual">
          <Icon
            name={visual.name}
            size="xs"
            color="Icy"
            background={visual.background}
          />
        </div>
      );
    }

    if (visual.type === 'logo') {
      return (
        <div className="dropdown__item-visual">
          <Logo
            name={visual.name}
            size="xs"
            background={visual.background}
          />
        </div>
      );
    }

    return null;
  };

  const renderContent = () => {
    if (subLabel) {
      return (
        <div className="dropdown__item-content">
          <Text size="sm" weight={TextWeight.NORMAL} className="dropdown__item-label">
            {label}
          </Text>
          <Text size="xs" weight={TextWeight.NORMAL} color="var(--color-neutral-500)" className="dropdown__item-sublabel">
            {subLabel}
          </Text>
        </div>
      );
    }

    return (
      <div className="dropdown__item-content">
        <Text size="sm" weight={TextWeight.NORMAL} className="dropdown__item-label">
          {label}
        </Text>
      </div>
    );
  };

  const classes = [
    'dropdown__item',
    isSelected && 'dropdown__item--selected',
    disabled && 'dropdown__item--disabled',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div
      className={classes}
      onClick={handleClick}
      role={selectionMode === 'button' ? 'button' : 'option'}
      aria-selected={selectionMode !== 'button' ? isSelected : undefined}
      aria-disabled={disabled}
    >
      {selectionMode === 'multi' && (
        <div className="dropdown__item-checkbox" onClick={handleCheckboxClick}>
          <Checkbox 
            checked={isSelected} 
            disabled={disabled}
            readOnly
          />
        </div>
      )}
      {selectionMode !== 'multi' && renderVisual()}
      {renderContent()}
      {selectionMode === 'single' && isSelected && (
        <Icon name="tick_1" size="xs" color="Icy" className="dropdown__item-check" />
      )}
    </div>
  );
};

import React from 'react';
import './ComboBox.css';
import { ComboBoxMenuItem } from './ComboBoxMenuItem/ComboBoxMenuItem';

export interface ComboBoxItem {
  id: string;
  label: React.ReactNode;
  iconName?: string;
  selected?: boolean;
  disabled?: boolean;
  /** The option an owning combobox currently points at with aria-activedescendant. */
  active?: boolean;
}

export interface ComboBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  items: ComboBoxItem[];
  multiSelect?: boolean;
  onItemClick?: (item: ComboBoxItem, index: number) => void;
}

export const ComboBox: React.FC<ComboBoxProps> = ({
  items,
  multiSelect = false,
  onItemClick,
  className = '',
  id,
  ...props
}) => {
  // With an id, every option gets a derived id so a combobox can reference it
  // through aria-activedescendant. Focus then stays on that combobox, so the
  // options leave the tab order.
  return (
    <div className={`combo-box ${className}`.trim()} role="listbox" id={id} {...props}>
      {items.map((item, index) => (
        <ComboBoxMenuItem
          key={item.id}
          id={id ? `${id}-option-${index}` : undefined}
          tabIndex={id ? -1 : undefined}
          data-active={item.active ? '' : undefined}
          iconName={item.iconName}
          label={item.label}
          selected={item.selected}
          disabled={item.disabled}
          multiSelect={multiSelect}
          onClick={() => onItemClick?.(item, index)}
        />
      ))}
    </div>
  );
};

import React from 'react';
import './ComboBox.css';
import { ComboBoxMenuItem } from './ComboBoxMenuItem/ComboBoxMenuItem';

export interface ComboBoxItem {
  id: string;
  label: React.ReactNode;
  iconName?: string;
  selected?: boolean;
  disabled?: boolean;
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
  ...props
}) => {
  return (
    <div className={`combo-box ${className}`.trim()} role="listbox" {...props}>
      {items.map((item, index) => (
        <ComboBoxMenuItem
          key={item.id}
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

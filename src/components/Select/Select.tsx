import React, { useState, useRef } from 'react';
import type { ComboBoxItem } from '../ComboBox/ComboBox';
import { ComboBox } from '../ComboBox/ComboBox';
import './Select.css';

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface SelectProps {
  label: string;
  options: SelectOption[];
  value?: string | number;
  onChange?: (value: string | number) => void;
  description?: string;
  error?: string;
  disabled?: boolean;
  name?: string;
  id?: string;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  value,
  onChange,
  description,
  error,
  disabled = false,
  className,
  name,
  id,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(opt => opt.value === value);
  const displayText = selectedOption?.label || 'Select an option';

  const handleItemClick = (item: ComboBoxItem) => {
    const option = options.find(opt => opt.value.toString() === item.id);
    if (option) {
      onChange?.(option.value);
      setIsOpen(false);
    }
  };

  const comboBoxItems: ComboBoxItem[] = options.map(option => ({
    id: option.value.toString(),
    label: option.label,
    selected: option.value === value,
    disabled: option.disabled,
  }));

  return (
    <div className={['select-group', className].filter(Boolean).join(' ')}>
      <label className="select-label" htmlFor={id || name}>
        {label}
      </label>
      <div
        className="select-container"
        ref={containerRef}
        data-error={error ? '' : undefined}
      >
        <button
          type="button"
          className="select-trigger"
          onClick={() => setIsOpen(!isOpen)}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-label={`${label}: ${displayText}`}
        >
          <span className="select-trigger-text">{displayText}</span>
          <span className="select-icon" aria-hidden="true" />
        </button>
        {isOpen && (
          <div className="select-dropdown">
            <ComboBox
              items={comboBoxItems}
              onItemClick={handleItemClick}
              role="listbox"
            />
          </div>
        )}
      </div>
      {description && <p className="select-description">{description}</p>}
      {error && <p className="select-error">{error}</p>}
    </div>
  );
};

import React, { useState, useRef } from 'react';
import type { ComboBoxItem } from '../ComboBox/ComboBox';
import { ComboBox } from '../ComboBox/ComboBox';
import { Icon } from '../Icon';
import './Select.css';

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface SelectProps {
  label: string;
  options: SelectOption[];
  /** Controlled value. When provided, the parent owns selection state and MUST update it from `onChange` for the trigger to reflect the click. */
  value?: string | number;
  /** Uncontrolled initial value. Ignored when `value` is provided. */
  defaultValue?: string | number;
  /** Placeholder shown when no value is selected. */
  placeholder?: string;
  /**
   * Fired after the user picks an option from the dropdown. Receives the
   * newly selected `value` plus the full `SelectOption` (label / disabled /
   * etc.) so consumers don't have to look it up.
   */
  onChange?: (value: string | number, option: SelectOption) => void;
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
  value: controlledValue,
  defaultValue,
  placeholder = 'Select an option',
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

  // Support both controlled (`value`) and uncontrolled (`defaultValue`) usage.
  // Without internal state the trigger would never reflect a click unless the
  // parent rewired `value` from `onChange`, which silently broke consumers
  // that wanted a "fire and forget" dropdown.
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState<string | number | undefined>(defaultValue);
  const currentValue = isControlled ? controlledValue : internalValue;

  const selectedOption = options.find(opt => opt.value === currentValue);
  const displayText = selectedOption?.label || placeholder;

  const handleItemClick = (item: ComboBoxItem) => {
    const option = options.find(opt => opt.value.toString() === item.id);
    if (!option || option.disabled) return;

    if (!isControlled) {
      setInternalValue(option.value);
    }
    onChange?.(option.value, option);
    setIsOpen(false);
  };

  const comboBoxItems: ComboBoxItem[] = options.map(option => ({
    id: option.value.toString(),
    label: option.label,
    selected: option.value === currentValue,
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
          data-filled={selectedOption ? '' : undefined}
        >
          <span
            className="select-trigger-text"
            data-placeholder={selectedOption ? undefined : ''}
          >
            {displayText}
          </span>
          <Icon
            name="keyboard_arrow_down"
            size={12}
            className="select-icon"
            aria-hidden="true"
          />
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

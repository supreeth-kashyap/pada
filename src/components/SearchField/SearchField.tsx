import React, { useState } from 'react';
import './SearchField.css';
import { Icon } from '../Icon';

export interface SearchFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange' | 'value' | 'defaultValue'> {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onClear?: () => void;
  className?: string;
}

export const SearchField: React.FC<SearchFieldProps> = ({
  value: controlledValue,
  defaultValue,
  onChange,
  onClear,
  placeholder = 'Search',
  disabled = false,
  className = '',
  ...props
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue ?? '');
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;
  const hasValue = value.length > 0;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;
    if (!isControlled) {
      setInternalValue(nextValue);
    }
    onChange?.(nextValue);
  };

  const handleClear = () => {
    if (!isControlled) {
      setInternalValue('');
    }
    onClear?.();
    onChange?.('');
  };

  return (
    <div
      className={['search-field', className].filter(Boolean).join(' ')}
      data-empty={!hasValue ? '' : undefined}
    >
      <span className="search-icon">
        <Icon name="search" src='e8b6' size={16} color="var(--color-neutral-600)" />
      </span>
      <input
        className="search-input"
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        aria-label={props['aria-label'] ?? 'Search'}
        {...props}
      />
      {hasValue && !disabled && (
        <button
          type="button"
          className="search-clear"
          onClick={handleClear}
          aria-label="Clear search"
        >
          <Icon name="cross_1" src="f508" size={12} color="var(--color-neutral-600)" />
        </button>
      )}
    </div>
  );
};

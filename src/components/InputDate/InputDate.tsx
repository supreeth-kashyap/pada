import React, { useState, useRef, useEffect } from 'react';
import './InputDate.css';
import { FormLabel } from '../FormLabel';
import { Icon } from '../Icon';
import { DatePickerDropdown } from '../DatePicker';
import type { DatePickerMode, DatePickerSelection } from '../DatePicker';

export interface InputDateProps {
  label?: string;
  error?: string;
  description?: string;
  required?: boolean;
  optional?: boolean;
  disabled?: boolean;
  placeholder?: string;
  mode?: DatePickerMode;
  selection?: DatePickerSelection;
  value?: Date | [Date, Date?] | null;
  onChange?: (value: Date | [Date, Date?] | null) => void;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const formatDate = (date: Date | null, mode: DatePickerMode): string => {
  if (!date) return '';
  if (mode === 'year') return date.getFullYear().toString();
  if (mode === 'month') return `${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatRange = (start: Date | null, end: Date | null, mode: DatePickerMode): string => {
  if (!start) return '';
  if (!end) return `${formatDate(start, mode)} - ...`;
  return `${formatDate(start, mode)} - ${formatDate(end, mode)}`;
};

export const InputDate = ({
  label,
  error,
  description,
  required = false,
  optional = false,
  disabled = false,
  placeholder = 'Select date',
  mode = 'date',
  selection = 'single',
  value,
  onChange,
  minDate,
  maxDate,
  className = '',
}: InputDateProps) => {
  const id = React.useId();
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const hasError = !!error;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const getDisplayValue = (): string => {
    if (selection === 'range') {
      const start = Array.isArray(value) && value[0] ? value[0] : null;
      const end = Array.isArray(value) && value[1] ? value[1] : null;
      return formatRange(start, end, mode);
    }
    if (value instanceof Date) {
      return formatDate(value, mode);
    }
    return '';
  };

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleChange = (newValue: Date | [Date, Date?] | null) => {
    onChange?.(newValue);
    if (selection === 'single') {
      setIsOpen(false);
    }
  };

  return (
    <div className={`input-date-wrapper ${className}`} ref={wrapperRef}>
      {label && (
        <FormLabel htmlFor={id} required={required} optional={optional}>
          {label}
        </FormLabel>
      )}
      <div className="input-date-container" ref={containerRef}>
        <button
          id={id}
          type="button"
          className={`input-date ${hasError ? 'input-date--error' : ''} ${disabled ? 'input-date--disabled' : ''}`}
          onClick={handleToggle}
          disabled={disabled}
          aria-expanded={isOpen}
          aria-haspopup="true"
          aria-invalid={hasError}
        >
          <span className={getDisplayValue() ? '' : 'input-date__placeholder'}>
            {getDisplayValue() || placeholder}
          </span>
          <Icon name="calendar_3" size="xs" color="Icy" />
        </button>
        {isOpen && (
          <div className="input-date__dropdown" ref={dropdownRef}>
            <DatePickerDropdown
              mode={mode}
              selection={selection}
              value={value}
              onChange={handleChange}
              minDate={minDate}
              maxDate={maxDate}
            />
          </div>
        )}
      </div>
      {description && !hasError && (
        <p id={`${id}-description`} className="input-date-description">
          {description}
        </p>
      )}
      {hasError && (
        <p id={`${id}-error`} className="input-date-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

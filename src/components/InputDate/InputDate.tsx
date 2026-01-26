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
  filled?: boolean;
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
  return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
};

const formatRange = (start: Date | null, end: Date | null, mode: DatePickerMode): string => {
  if (!start) return '';
  if (!end) return `${formatDate(start, mode)} -> ...`;
  return `${formatDate(start, mode)} -> ${formatDate(end, mode)}`;
};

export const InputDate = ({
  label,
  error,
  description,
  required = false,
  optional = false,
  disabled = false,
  placeholder = 'Select date',
  filled,
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
  const [internalFilled, setInternalFilled] = useState(false);
  const [internalValue, setInternalValue] = useState<Date | [Date, Date?] | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const hasError = !!error;
  const isFilled = typeof filled === 'boolean' ? filled : internalFilled;
  const resolvedValue = value !== undefined ? value : internalValue;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
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

  useEffect(() => {
    if (typeof filled === 'boolean') {
      return;
    }
    if (selection === 'range') {
      const start = Array.isArray(resolvedValue) && resolvedValue[0] ? resolvedValue[0] : null;
      const end = Array.isArray(resolvedValue) && resolvedValue[1] ? resolvedValue[1] : null;
      setInternalFilled(!!start || !!end);
      return;
    }
    setInternalFilled(resolvedValue instanceof Date);
  }, [filled, selection, resolvedValue]);

  const getDisplayValue = (): string => {
    if (selection === 'range') {
      const start = Array.isArray(resolvedValue) && resolvedValue[0] ? resolvedValue[0] : null;
      const end = Array.isArray(resolvedValue) && resolvedValue[1] ? resolvedValue[1] : null;
      return formatRange(start, end, mode);
    }
    if (resolvedValue instanceof Date) {
      return formatDate(resolvedValue, mode);
    }
    return '';
  };

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleChange = (newValue: Date | [Date, Date?] | null) => {
    if (typeof filled !== 'boolean') {
      if (selection === 'range') {
        const start = Array.isArray(newValue) && newValue[0] ? newValue[0] : null;
        const end = Array.isArray(newValue) && newValue[1] ? newValue[1] : null;
        setInternalFilled(!!start || !!end);
      } else {
        setInternalFilled(newValue instanceof Date);
      }
    }
    if (value === undefined) {
      setInternalValue(newValue);
    }
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
      <div className="input-date-container">
        <button
          id={id}
          type="button"
          className={`input-date ${isFilled ? 'input-date--filled' : ''} ${hasError ? 'input-date--error' : ''} ${disabled ? 'input-date--disabled' : ''} ${isOpen ? 'input-date--active' : ''}`}
          onClick={handleToggle}
          disabled={disabled}
          aria-expanded={isOpen}
          aria-haspopup="true"
          aria-invalid={hasError}
        >
          <span className={getDisplayValue() ? '' : 'input-date__placeholder'}>
            {getDisplayValue() || placeholder}
          </span>
          <span className="input-date__icon">
            <Icon name="calendar_3" size={12} color="var(--color-neutral-600)" />
          </span>
        </button>
        {isOpen && (

          <DatePickerDropdown
            mode={mode}
            selection={selection}
            value={resolvedValue}
            onChange={handleChange}
            minDate={minDate}
            maxDate={maxDate}
          />

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

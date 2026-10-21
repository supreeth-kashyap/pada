import React, { useState } from 'react';
import './InputDate.css';
import { ControlLabel } from '../FormLabel/ControlLabel';
import { Icon } from '../Icon';
import { DatePickerDropdown } from '../DatePicker';
import type { DatePickerMode, DatePickerSelection } from '../DatePicker';
import { PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from '../../headless/Popover/Popover';

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
  /** Marks other days unavailable (weekends, holidays, booked dates). */
  isDateUnavailable?: (date: Date) => boolean;
  /** First day of the week: 0 = Sunday … 6 = Saturday. @default 0 */
  weekStartsOn?: number;
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

/**
 * A date field: a button showing the chosen date (or range) that opens the date picker in a
 * popover. Focus moves to the selected day; Escape closes the picker and returns to the field.
 */
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
  isDateUnavailable,
  weekStartsOn,
  className = '',
}: InputDateProps) => {
  const id = React.useId();
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<Date | [Date, Date?] | null>(null);
  const hasError = !!error;
  const resolvedValue = value !== undefined ? value : internalValue;
  const hasValue = selection === 'range' ? Array.isArray(resolvedValue) && !!resolvedValue[0] : resolvedValue instanceof Date;
  const isFilled = typeof filled === 'boolean' ? filled : hasValue;


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

  const handleChange = (newValue: Date | [Date, Date?] | null) => {
    if (value === undefined) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
    // Close once the choice is complete: one date, or both ends of a range.
    if (selection === 'single' || (Array.isArray(newValue) && newValue[1])) {
      setIsOpen(false);
    }
  };

  const describedBy = hasError ? `${id}-error` : description ? `${id}-description` : undefined;

  return (
    <div className={`input-date-wrapper ${className}`}>
      {label && (
        <ControlLabel htmlFor={id} required={required} optional={optional}>
          {label}
        </ControlLabel>
      )}
      <div className="input-date-container">
        <PopoverRoot open={isOpen} onOpenChange={(open) => setIsOpen(open && !disabled)}>
          <PopoverTrigger
            id={id}
            className={`input-date ${isFilled ? 'input-date--filled' : ''} ${hasError ? 'input-date--error' : ''} ${disabled ? 'input-date--disabled' : ''} ${isOpen ? 'input-date--active' : ''}`}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={describedBy}
            aria-required={required || undefined}
          >
            <span className={getDisplayValue() ? '' : 'input-date__placeholder'}>
              {getDisplayValue() || placeholder}
            </span>
            <span className="input-date__icon" aria-hidden="true">
              <Icon name="calendar_3" size={12} color="var(--pada-color-neutral-600)" />
            </span>
          </PopoverTrigger>
          <PopoverPortal>
            <PopoverContent
              className="input-date-popover"
              aria-label={label ? `Choose ${label}` : 'Choose date'}
              side="bottom"
              align="start"
              sideOffset={4}
            >
              <DatePickerDropdown
                mode={mode}
                selection={selection}
                value={resolvedValue}
                onChange={handleChange}
                minDate={minDate}
                maxDate={maxDate}
                isDateUnavailable={isDateUnavailable}
                weekStartsOn={weekStartsOn}
              />
            </PopoverContent>
          </PopoverPortal>
        </PopoverRoot>
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

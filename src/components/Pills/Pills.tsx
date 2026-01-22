import React, { useState } from 'react';
import './Pills.css';

export interface PillOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface PillsProps {
  options: PillOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

export const Pills: React.FC<PillsProps> = ({
  options,
  value: controlledValue,
  defaultValue,
  onChange,
  className = '',
  size = 'md',
  disabled = false
}) => {
  const [internalValue, setInternalValue] = useState<string>(defaultValue || options[0]?.value || '');
  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;

  const handleChange = (optionValue: string) => {
    if (disabled) return;
    
    if (!isControlled) {
      setInternalValue(optionValue);
    }
    
    onChange?.(optionValue);
  };

  const handleKeyDown = (event: React.KeyboardEvent, optionValue: string, index: number) => {
    if (disabled) return;

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      const nextIndex = (index + 1) % options.length;
      const nextOption = options[nextIndex];
      if (nextOption && !nextOption.disabled) {
        handleChange(nextOption.value);
        const nextElement = event.currentTarget.parentElement?.children[nextIndex] as HTMLElement;
        nextElement?.focus();
      }
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      const prevIndex = (index - 1 + options.length) % options.length;
      const prevOption = options[prevIndex];
      if (prevOption && !prevOption.disabled) {
        handleChange(prevOption.value);
        const prevElement = event.currentTarget.parentElement?.children[prevIndex] as HTMLElement;
        prevElement?.focus();
      }
    } else if (event.key === 'Home') {
      event.preventDefault();
      const firstOption = options[0];
      if (firstOption && !firstOption.disabled) {
        handleChange(firstOption.value);
        const firstElement = event.currentTarget.parentElement?.children[0] as HTMLElement;
        firstElement?.focus();
      }
    } else if (event.key === 'End') {
      event.preventDefault();
      const lastOption = options[options.length - 1];
      if (lastOption && !lastOption.disabled) {
        handleChange(lastOption.value);
        const lastElement = event.currentTarget.parentElement?.children[options.length - 1] as HTMLElement;
        lastElement?.focus();
      }
    }
  };

  return (
    <div
      className={`pills pills--${size} ${disabled ? 'pills--disabled' : ''} ${className}`.trim()}
      role="tablist"
      aria-label="Pills navigation"
    >
      {options.map((option, index) => {
        const isSelected = currentValue === option.value;
        const isDisabled = disabled || option.disabled;

        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={isSelected}
            aria-disabled={isDisabled}
            disabled={isDisabled}
            className={`pills__pill ${isSelected ? 'pills__pill--selected' : ''} ${isDisabled ? 'pills__pill--disabled' : ''}`.trim()}
            onClick={() => handleChange(option.value)}
            onKeyDown={(e) => handleKeyDown(e, option.value, index)}
            tabIndex={isSelected && !isDisabled ? 0 : isDisabled ? -1 : -1}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};

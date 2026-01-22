import React, { useState } from 'react';
import './SegmentControl.css';
import { Icon } from '../Icon';

export interface SegmentOption {
  value: string;
  label?: string;
  icon?: string;
  disabled?: boolean;
}

export interface SegmentControlProps {
  options: SegmentOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

export const SegmentControl: React.FC<SegmentControlProps> = ({
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
      if (!nextOption.disabled) {
        handleChange(nextOption.value);
        const nextButton = document.getElementById(`segment-${nextIndex}`);
        nextButton?.focus();
      }
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      const prevIndex = (index - 1 + options.length) % options.length;
      const prevOption = options[prevIndex];
      if (!prevOption.disabled) {
        handleChange(prevOption.value);
        const prevButton = document.getElementById(`segment-${prevIndex}`);
        prevButton?.focus();
      }
    }
  };

  // Determine if this is icon-only mode (all options have icons but no labels)
  const isIconOnly = options.every(opt => opt.icon && !opt.label);
  const hasIcons = options.some(opt => opt.icon);

  return (
    <div 
      className={`segment-control segment-control--${size} ${disabled ? 'segment-control--disabled' : ''} ${isIconOnly ? 'segment-control--icon-only' : ''} ${hasIcons ? 'segment-control--with-icons' : ''} ${className}`.trim()}
      role="tablist"
      aria-label="Segment control"
    >
      <div className="segment-control__container">
        {options.map((option, index) => {
          const isSelected = option.value === currentValue;
          const isDisabled = disabled || option.disabled;
          const isLast = index === options.length - 1;

          return (
            <React.Fragment key={option.value}>
              <button
                id={`segment-${index}`}
                type="button"
                role="tab"
                aria-selected={isSelected}
                aria-disabled={isDisabled}
                className={`segment-control__option ${isSelected ? 'segment-control__option--selected' : ''} ${isDisabled ? 'segment-control__option--disabled' : ''}`}
                onClick={() => handleChange(option.value)}
                onKeyDown={(e) => handleKeyDown(e, option.value, index)}
                disabled={isDisabled}
                tabIndex={isSelected ? 0 : -1}
              >
                {option.icon && (
                  <Icon 
                    name={option.icon} 
                    size="sm" 
                    color={isSelected ? 'Blue' : 'Icy'}
                    className="segment-control__icon"
                  />
                )}
                {option.label && (
                  <span className="segment-control__label">{option.label}</span>
                )}
              </button>
              {!isLast && (
                <div className="segment-control__divider" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

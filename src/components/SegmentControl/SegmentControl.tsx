import React, { useState, useRef } from 'react';
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
  const containerRef = useRef<HTMLDivElement>(null);
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
        const nextButton = containerRef.current?.querySelector(`[data-index="${nextIndex}"]`) as HTMLButtonElement;
        nextButton?.focus();
      }
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      const prevIndex = (index - 1 + options.length) % options.length;
      const prevOption = options[prevIndex];
      if (!prevOption.disabled) {
        handleChange(prevOption.value);
        const prevButton = containerRef.current?.querySelector(`[data-index="${prevIndex}"]`) as HTMLButtonElement;
        prevButton?.focus();
      }
    }
  };

  // Determine if this is icon-only mode (all options have icons but no labels)
  const isIconOnly = options.every(opt => opt.icon && !opt.label);

  return (
    <div
      ref={containerRef}
      className={['segment-control', className].filter(Boolean).join(' ')}
      role="tablist"
      aria-label="Segment control"
      data-size={size}
      data-icon-only={isIconOnly ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
    >
      <div className="segment-options">
        {options.map((option, index) => {
          const isSelected = option.value === currentValue;
          const isDisabled = disabled || option.disabled;
          const isLast = index === options.length - 1;

          return (
            <React.Fragment key={option.value}>
              <button
                type="button"
                role="tab"
                aria-selected={isSelected}
                data-index={index}
                className="segment-option"
                onClick={() => handleChange(option.value)}
                onKeyDown={(e) => handleKeyDown(e, option.value, index)}
                disabled={isDisabled}
                tabIndex={isSelected ? 0 : -1}
              >
                {option.icon && (
                  <Icon
                    name={option.icon}
                    size={16}
                    color={isSelected ? 'var(--color-primary-600)' : 'var(--color-neutral-600)'}
                    className="segment-icon"
                  />
                )}
                {option.label && (
                  <span className="segment-label">{option.label}</span>
                )}
              </button>
              {!isLast && (
                <div className="segment-divider" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

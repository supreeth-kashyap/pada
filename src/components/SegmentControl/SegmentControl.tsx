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
  /**
   * Fired whenever the active segment changes (via click or keyboard).
   * The callback receives the newly active option's `value` as well as the
   * full `SegmentOption` so consumers can read label/icon/etc. without an
   * extra lookup. When operating in controlled mode (`value` prop supplied),
   * the consumer MUST update the `value` from this callback for the visible
   * active segment to shift.
   */
  onChange?: (value: string, option: SegmentOption) => void;
  className?: string;
  disabled?: boolean;
}

export const SegmentControl: React.FC<SegmentControlProps> = ({
  options,
  value: controlledValue,
  defaultValue,
  onChange,
  className = '',
  disabled = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [internalValue, setInternalValue] = useState<string>(defaultValue || options[0]?.value || '');
  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;

  const handleChange = (option: SegmentOption) => {
    if (disabled || option.disabled) return;

    if (!isControlled) {
      setInternalValue(option.value);
    }

    onChange?.(option.value, option);
  };

  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (disabled) return;

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      const nextIndex = (index + 1) % options.length;
      const nextOption = options[nextIndex];
      if (!nextOption.disabled) {
        handleChange(nextOption);
        const nextButton = containerRef.current?.querySelector(`[data-index="${nextIndex}"]`) as HTMLButtonElement;
        nextButton?.focus();
      }
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      const prevIndex = (index - 1 + options.length) % options.length;
      const prevOption = options[prevIndex];
      if (!prevOption.disabled) {
        handleChange(prevOption);
        const prevButton = containerRef.current?.querySelector(`[data-index="${prevIndex}"]`) as HTMLButtonElement;
        prevButton?.focus();
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className={['segment-control', className].filter(Boolean).join(' ')}
      role="tablist"
      aria-label="Segment control"
      data-disabled={disabled ? '' : undefined}
    >
      <div className="segment-options">
        {options.map((option, index) => {
          const isSelected = option.value === currentValue;
          const isDisabled = disabled || option.disabled;

          return (
            <React.Fragment key={option.value}>
              <button
                type="button"
                role="tab"
                aria-selected={isSelected}
                data-index={index}
                className="segment-option"
                onClick={() => handleChange(option)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                disabled={isDisabled}
                tabIndex={isSelected ? 0 : -1}
              >
                {option.icon && (
                  <Icon
                    name={option.icon}
                    size={16}
                    color={isSelected ? 'var(--color-primary-700)' : 'var(--color-stone-900)'}
                    className="segment-icon"
                  />
                )}
                {option.label && (
                  <span className="segment-label">{option.label}</span>
                )}
              </button>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

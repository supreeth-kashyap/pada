import React, { useState, useRef } from 'react';
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
  className,
  size = 'md',
  disabled = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [internalValue, setInternalValue] = useState(
    defaultValue ?? options[0]?.value ?? ''
  );

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const setValue = (next: string) => {
    if (disabled) return;
    if (!isControlled) {
      setInternalValue(next);
    }
    onChange?.(next);
  };

  const moveFocus = (currentIndex: number, direction: 1 | -1) => {
    const count = options.length;
    let nextIndex = currentIndex;

    do {
      nextIndex = (nextIndex + direction + count) % count;
    } while (options[nextIndex]?.disabled && nextIndex !== currentIndex);

    const option = options[nextIndex];
    if (!option?.disabled) {
      setValue(option.value);
      const el = containerRef.current?.querySelectorAll<HTMLElement>('[role="tab"]')[nextIndex];
      el?.focus();
    }
  };

  const onKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number
  ) => {
    if (disabled) return;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        moveFocus(index, 1);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        moveFocus(index, -1);
        break;
      case 'Home':
        event.preventDefault();
        moveFocus(0, 1);
        break;
      case 'End':
        event.preventDefault();
        moveFocus(options.length - 1, -1);
        break;
    }
  };

  return (
    <div
      ref={containerRef}
      className={['pills', className].filter(Boolean).join(' ')}
      role="tablist"
      data-size={size}
      data-disabled={disabled ? '' : undefined}
      aria-label="Pills navigation"
    >
      {options.map((option, index) => {
        const isSelected = option.value === value;
        const isDisabled = disabled || option.disabled;

        return (
          <button
            key={option.value}
            type="button"
            className="pill"
            role="tab"
            aria-selected={isSelected}
            disabled={isDisabled}
            tabIndex={isSelected && !isDisabled ? 0 : -1}
            onClick={() => setValue(option.value)}
            onKeyDown={(e) => onKeyDown(e, index)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};

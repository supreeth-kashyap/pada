import React, { useRef, useState, useEffect, useCallback } from 'react';
import './Slider.css';
import { FormLabel } from '../FormLabel';

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label?: string;
  description?: string;
  error?: string;
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onValueChange?: (value: number) => void;
  showValue?: boolean;
  disabled?: boolean;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  label,
  description,
  error,
  value: controlledValue,
  defaultValue = 0,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  onValueChange,
  showValue = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const id = React.useId();
  const sliderRef = useRef<HTMLInputElement>(null);
  const [internalValue, setInternalValue] = useState<number>(defaultValue);
  const [isDragging, setIsDragging] = useState(false);
  
  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;
  const hasError = !!error;

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    
    if (!isControlled) {
      setInternalValue(newValue);
    }
    
    onChange?.(e);
    onValueChange?.(newValue);
  }, [isControlled, onChange, onValueChange]);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  const percentage = ((currentValue - min) / (max - min)) * 100;

  return (
    <div className={`slider-wrapper ${className}`.trim()}>
      {(label || showValue) && (
        <div className="slider-header">
          {label && (
            <FormLabel htmlFor={id} required={props.required}>
              {label}
            </FormLabel>
          )}
          {showValue && (
            <span className="slider-value" aria-live="polite">
              {currentValue}
            </span>
          )}
        </div>
      )}
      
      <div className={`slider-container ${disabled ? 'slider-container--disabled' : ''} ${hasError ? 'slider-container--error' : ''}`}>
        <div className="slider-track">
          <div 
            className="slider-fill" 
            style={{ width: `${percentage}%` }}
          />
        </div>
        <input
          ref={sliderRef}
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={currentValue}
          onChange={handleChange}
          onMouseDown={handleMouseDown}
          disabled={disabled}
          className={`slider ${isDragging ? 'slider--dragging' : ''}`}
          aria-invalid={hasError}
          aria-describedby={
            hasError ? `${id}-error` : description ? `${id}-description` : undefined
          }
          {...props}
        />
      </div>

      {description && !hasError && (
        <p id={`${id}-description`} className="slider-description">
          {description}
        </p>
      )}
      {hasError && (
        <p id={`${id}-error`} className="slider-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

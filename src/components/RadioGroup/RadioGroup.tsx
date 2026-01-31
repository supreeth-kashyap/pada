import React from 'react';
import './RadioGroup.css';

export interface RadioOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  name: string;
  label?: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  label,
  options,
  value,
  onChange,
  disabled = false,
  className
}) => {
  const id = React.useId();
  const handleChange = (optionValue: string) => {
    if (!disabled) {
      onChange(optionValue);
    }
  };

  return (
    <div className={['radiogroup', className].filter(Boolean).join(' ')}>
      {label && <label className="radiogroup-label">{label}</label>}
      <div role="radiogroup" className="radiogroup-options">
        {options.map(option => {
          const isDisabled = disabled || option.disabled;
          const optionId = `${id}-${option.value}`;

          return (
            <div key={option.value} className="radio-option">
              <input
                type="radio"
                id={optionId}
                name={name}
                value={option.value}
                checked={value === option.value}
                disabled={isDisabled}
                onChange={() => handleChange(option.value)}
                className="radio"
              />
              <label htmlFor={optionId} className="radio-label">
                {option.label}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};

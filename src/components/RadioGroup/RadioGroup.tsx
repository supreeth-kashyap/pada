import React from 'react';
import './RadioGroup.css';

export interface RadioGroupProps {
  name: string;
  label?: string;
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({ name, label, options, value, onChange }) => {
  const id = React.useId();
  return (
    <div className="radiogroup-wrapper">
      {label && <label className="radiogroup-label">{label}</label>}
      <div role="radiogroup" className="radiogroup-container">
        {options.map(option => (
          <div key={option.value} className="radio-option-wrapper">
            <input
              type="radio"
              id={`${id}-${option.value}`}
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="radio-input"
            />
            <label htmlFor={`${id}-${option.value}`} className="radio-label">{option.label}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

import React from 'react';
import './Select.css';

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  description?: string;
  error?: string;
}

export const Select: React.FC<SelectProps> = ({ label, options, description, error, ...props }) => {
  const wrapperClasses = ['select-wrapper', error ? 'has-error' : '' ].join(' ');

  return (
    <div className={wrapperClasses}>
      <label className="select-label" htmlFor={props.id || props.name}>{label}</label>
      <div className="select-container">
        <select className="select" {...props}>
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span className="select-icon" aria-hidden="true"></span>
      </div>
      {description && <p className="select-description">{description}</p>}
      {error && <p className="select-error">{error}</p>}
    </div>
  );
};

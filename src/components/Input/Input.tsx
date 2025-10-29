import React from 'react';
import './Input.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  description?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>((
  { label, error, description, prefix, suffix, ...props },
  ref
) => {
  const id = React.useId();
  return (
    <div className="input-wrapper">
      {label && <label htmlFor={id} className="input-label">{label}</label>}
      <div className="input-container">
        {prefix && <div className="input-prefix">{prefix}</div>}
        <input
          ref={ref}
          id={id}
          className={`input ${error ? 'input--error' : ''}`}
          {...props}
        />
        {suffix && <div className="input-suffix">{suffix}</div>}
      </div>
      {description && <p className="input-description">{description}</p>}
      {error && <p className="input-error">{error}</p>}
    </div>
  );
});

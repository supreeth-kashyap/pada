import React from 'react';
import './InputText.css';
import { FormLabel } from '../FormLabel';

const messageId = (id: string, error?: string, description?: string) =>
  error ? `${id}-error` : description ? `${id}-description` : undefined;

export interface InputTextProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix' | 'suffix'> {
  label?: string;
  error?: string;
  description?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  required?: boolean;
  optional?: boolean;
}

export const InputText = ({
  label,
  error,
  description,
  prefix,
  suffix,
  disabled,
  required = false,
  optional = false,
  className = '',
  id: idProp,
  'aria-describedby': describedByProp,
  ...props
}: InputTextProps) => {
  const generatedId = React.useId();
  // A consumer id must reach both the control and the label, or the label stops naming it.
  const id = idProp ?? generatedId;
  const describedBy = [describedByProp, messageId(id, error, description)].filter(Boolean).join(' ') || undefined;
  const hasError = !!error;
  
  return (
    <div className="input-text-wrapper">
      {label && (
        <FormLabel htmlFor={id} required={required} optional={optional}>
          {label}
        </FormLabel>
      )}
      <div className="input-text-container">
        {prefix && <div className="input-text-prefix">{prefix}</div>}
        <input
          id={id}
          className={`input-text ${hasError ? 'input-text--error' : ''} ${className}`.trim()}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={describedBy}
          {...props}
        />
        {suffix && <div className="input-text-suffix">{suffix}</div>}
      </div>
      {description && !hasError && (
        <p id={`${id}-description`} className="input-text-description">
          {description}
        </p>
      )}
      {hasError && (
        <p id={`${id}-error`} className="input-text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

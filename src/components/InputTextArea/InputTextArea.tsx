import React from 'react';
import './InputTextArea.css';
import { FormLabel } from '../FormLabel';

export interface InputTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  description?: string;
  required?: boolean;
  optional?: boolean;
}

export const InputTextArea = ({
  label,
  error,
  description,
  disabled,
  required = false,
  optional = false,
  className = '',
  ...props
}: InputTextAreaProps) => {
  const id = React.useId();
  const hasError = !!error;

  return (
    <div className="input-textarea-wrapper">
      {label && (
        <FormLabel htmlFor={id} required={required} optional={optional}>
          {label}
        </FormLabel>
      )}
      <textarea
        id={id}
        className={`input-textarea ${hasError ? 'input-textarea--error' : ''} ${className}`.trim()}
        disabled={disabled}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${id}-error` : description ? `${id}-description` : undefined}
        {...props}
      />
      {description && !hasError && (
        <p id={`${id}-description`} className="input-textarea-description">
          {description}
        </p>
      )}
      {hasError && (
        <p id={`${id}-error`} className="input-textarea-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

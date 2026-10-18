import React from 'react';
import './InputTextArea.css';
import { FormLabel } from '../FormLabel';

const messageId = (id: string, error?: string, description?: string) =>
  error ? `${id}-error` : description ? `${id}-description` : undefined;

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
  id: idProp,
  'aria-describedby': describedByProp,
  ...props
}: InputTextAreaProps) => {
  const generatedId = React.useId();
  // A consumer id must reach both the control and the label, or the label stops naming it.
  const id = idProp ?? generatedId;
  const describedBy = [describedByProp, messageId(id, error, description)].filter(Boolean).join(' ') || undefined;
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
        aria-describedby={describedBy}
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

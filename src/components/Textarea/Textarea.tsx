import React from 'react';
import './Textarea.css';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  description?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>((
  { label, error, description, ...props },
  ref
) => {
  const id = React.useId();
  const hasError = !!error;

  return (
    <div className={`textarea-wrapper ${hasError ? 'has-error' : ''}`}>
      {label && <label htmlFor={id} className="textarea-label">{label}</label>}
      <textarea
        ref={ref}
        id={id}
        className="textarea"
        {...props}
      />
      {description && !hasError && <p className="textarea-description">{description}</p>}
      {hasError && <p className="textarea-error">{error}</p>}
    </div>
  );
});

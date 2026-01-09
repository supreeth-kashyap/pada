import React from 'react';
import './FormLabel.css';

export interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  required?: boolean;
  optional?: boolean;
  htmlFor?: string;
}

export const FormLabel = ({
  children,
  required = false,
  optional = false,
  htmlFor,
  className = '',
  ...props
}: FormLabelProps) => {
  const classes = [
    'form-label',
    className
  ].filter(Boolean).join(' ');

  return (
    <label htmlFor={htmlFor} className={classes} {...props}>
      {children}
      {required && <span className="form-label__required">*</span>}
      {optional && <span className="form-label__optional">(optional)</span>}
    </label>
  );
};

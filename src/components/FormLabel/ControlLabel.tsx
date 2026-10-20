import React from 'react';
import './FormLabel.css';

export interface ControlLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  required?: boolean;
  optional?: boolean;
  htmlFor?: string;
}

/**
 * The label the 1.x form controls (InputText, InputTextArea, InputDate, Slider, UploadField)
 * render. Internal: apps use `Field.Label`, or the deprecated `FormLabel`.
 */
export const ControlLabel = ({
  children,
  required = false,
  optional = false,
  htmlFor,
  className = '',
  ...props
}: ControlLabelProps) => {
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

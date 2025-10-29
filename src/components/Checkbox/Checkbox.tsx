import React from 'react';
import './Checkbox.css';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>((
  { label, ...props },
  ref
) => {
  const id = React.useId();
  return (
    <div className="checkbox-wrapper">
      <input
        ref={ref}
        id={id}
        type="checkbox"
        className="checkbox"
        {...props}
      />
      {label && <label htmlFor={id} className="checkbox-label">{label}</label>}
    </div>
  );
});

import React from 'react';
import './Switch.css';

export interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>((
  { label, ...props },
  ref
) => {
  const id = React.useId();
  return (
    <label htmlFor={id} className="switch-wrapper">
      {label && <span className="switch-label">{label}</span>}
      <input
        ref={ref}
        id={id}
        type="checkbox"
        role="switch"
        className="switch-input"
        {...props}
      />
      <div className="switch-track"></div>
    </label>
  );
});

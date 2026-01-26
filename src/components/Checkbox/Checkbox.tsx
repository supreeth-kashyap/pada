import React from 'react';
import { Icon } from '../Icon';
import './Checkbox.css';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Checkbox = ({
  label,
  className = '',
  ...props
}: CheckboxProps) => {
  const id = React.useId();
  
  const checkbox = (
    <div className="checkbox-container">
      <input
        id={id}
        type="checkbox"
        className={`checkbox ${className}`.trim()}
        {...props}
      />
      <Icon 
        name="tick_1" 
        size="xs" 
        color="White" 
        className="checkbox-icon checkbox-icon--tick"
      />
    </div>
  );

  if (!label) {
    return checkbox;
  }

  return (
    <div className="checkbox-wrapper">
      {checkbox}
      <label htmlFor={id} className="checkbox-label">{label}</label>
    </div>
  );
};

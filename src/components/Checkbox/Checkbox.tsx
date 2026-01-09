import React, { useRef, useEffect } from 'react';
import { Icon } from '../Icon';
import './Checkbox.css';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  indeterminate?: boolean;
}

export const Checkbox = ({
  label,
  className = '',
  indeterminate,
  ...props
}: CheckboxProps) => {
  const id = React.useId();
  const checkboxRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = indeterminate || false;
    }
  }, [indeterminate]);
  
  const checkbox = (
    <div className="checkbox-container">
      <input
        ref={checkboxRef}
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
      <div className="checkbox-icon checkbox-icon--square" />
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

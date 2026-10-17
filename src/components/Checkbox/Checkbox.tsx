import React, { useEffect, useRef } from 'react';
import { useComposedRefs } from '../../headless/utils/refs';
import { Icon } from '../Icon';
import './Checkbox.css';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  /** Mixed state, e.g. a "select all" box when only some items are selected. Announced as "mixed". */
  indeterminate?: boolean;
  ref?: React.Ref<HTMLInputElement>;
}

export const Checkbox = ({
  label,
  indeterminate = false,
  className = '',
  id: idProp,
  ref,
  ...props
}: CheckboxProps) => {
  const generatedId = React.useId();
  const id = idProp ?? generatedId;
  const inputRef = useRef<HTMLInputElement>(null);
  const composedRef = useComposedRefs(ref, inputRef);

  // `indeterminate` is a DOM property, not an attribute.
  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  const checkbox = (
    <div className="checkbox-container">
      <input
        {...props}
        id={id}
        ref={composedRef}
        type="checkbox"
        className={`checkbox ${className}`.trim()}
        aria-checked={indeterminate ? 'mixed' : undefined}
      />
      <Icon
        name="tick_1"
        size={16}
        color="var(--pada-color-accent-on-solid)"
        className="checkbox-icon checkbox-icon--tick"
      />
      <span className="checkbox-dash" aria-hidden="true" />
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

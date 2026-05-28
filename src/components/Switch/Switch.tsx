import React from 'react';
import { Icon } from '../Icon';
import './Switch.css';

export interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  /**
   * When `true`, renders an in-knob spinner and disables interaction.
   * Use this for async toggles (saving a server-side preference).
   */
  loading?: boolean;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>((
  { label, loading = false, disabled, className = '', ...props },
  ref
) => {
  const id = React.useId();
  const isInteractionBlocked = disabled || loading;
  return (
    <label
      htmlFor={id}
      className={`switch-wrapper ${className}`.trim()}
      data-loading={loading ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
    >
      <input
        ref={ref}
        id={id}
        type="checkbox"
        role="switch"
        className="switch-input"
        disabled={isInteractionBlocked}
        aria-busy={loading || undefined}
        {...props}
      />
      <span className="switch-track" aria-hidden="true">
        <span className="switch-knob">
          {loading && (
            <Icon name="progress_activity" size={12} className="switch-spinner" />
          )}
        </span>
      </span>
      {label && <span className="switch-label">{label}</span>}
    </label>
  );
});

Switch.displayName = 'Switch';

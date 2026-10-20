import React from 'react';
import './PickerBox.css';

export type PickerBoxState = 'rest' | 'hover' | 'active';

export interface PickerBoxProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  label: React.ReactNode;
  isActive?: boolean;
  isToday?: boolean;
  isMuted?: boolean;
  disabled?: boolean;
  state?: PickerBoxState;
  onClick?: () => void;
}

export const PickerBox = ({
  label,
  isActive = false,
  isToday = false,
  isMuted = false,
  disabled = false,
  state,
  onClick,
  ...props
}: PickerBoxProps) => {
  const resolvedState: PickerBoxState = state ?? (isActive ? 'active' : 'rest');

  const className = [
    'picker-box',
    `picker-box--${resolvedState}`,
    isToday ? 'picker-box--today' : '',
    isMuted ? 'picker-box--muted' : '',
    disabled ? 'picker-box--disabled' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={className}
      aria-pressed={isActive}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      <span className="picker-box__label">{label}</span>
      {isToday && <span className="picker-box__dot" aria-hidden="true" />}
    </button>
  );
};

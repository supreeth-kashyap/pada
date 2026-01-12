import React from 'react';
import './StepIndicator.css';

export type StepIndicatorType = 'concentric' | 'solid';
export type StepIndicatorState = 'rest' | 'hover' | 'active';

export interface StepIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Type of indicator - concentric (ring with inner circle) or solid (filled circle) */
  type?: StepIndicatorType;
  /** Visual state - rest, hover, or active */
  state?: StepIndicatorState;
  /** Size of the indicator */
  size?: 'sm' | 'md' | 'lg';
}

export const StepIndicator = ({
  type = 'concentric',
  state = 'rest',
  size = 'md',
  className = '',
  ...props
}: StepIndicatorProps) => {
  const classes = [
    'step-indicator',
    `step-indicator--${type}`,
    `step-indicator--${state}`,
    `step-indicator--${size}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} {...props}>
      {type === 'concentric' && (
        <>
          <div className="step-indicator__outer" />
          <div className="step-indicator__inner" />
        </>
      )}
      {type === 'solid' && (
        <div className="step-indicator__fill" />
      )}
    </div>
  );
};

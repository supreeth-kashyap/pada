import React from 'react';
import './StepIcon.css';
import { Icon } from '../../Icon';

export type StepIconStatus = 'active' | 'completed' | 'error';
export type StepIconContent = 'number' | 'dot' | 'symbol';

export interface StepIconProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Status of the step icon */
  status?: StepIconStatus;
  /** Content type to display */
  content?: StepIconContent;
  /** Number to display (when content is 'number') */
  number?: number;
  /** Symbol to display (when content is 'symbol') */
  symbol?: string;
  /** Size of the icon */
  size?: 'sm' | 'md' | 'lg';
}

export const StepIcon = ({
  status = 'active',
  content = 'dot',
  number,
  symbol,
  size = 'md',
  className = '',
  ...props
}: StepIconProps) => {
  const classes = [
    'step-icon',
    `step-icon--${status}`,
    `step-icon--${content}`,
    `step-icon--${size}`,
    className
  ].filter(Boolean).join(' ');

  const renderContent = () => {
    if (status === 'completed') {
      return (
        <Icon 
          name="tick_1" 
          size="sm" 
          color="Green" 
          variant="filled"
          className="step-icon__checkmark"
        />
      );
    }

    if (status === 'error') {
      return (
        <Icon 
          name="alert_1" 
          size="sm" 
          color="Red" 
          variant="filled"
          className="step-icon__exclamation"
        />
      );
    }

    // Active status with different content types
    if (content === 'number' && number !== undefined) {
      return (
        <span className="step-icon__number">{number}</span>
      );
    }

    if (content === 'symbol' && symbol) {
      return (
        <span className="step-icon__symbol">{symbol}</span>
      );
    }

    // Default: dot
    return (
      <div className="step-icon__dot" />
    );
  };

  return (
    <div className={classes} {...props}>
      {renderContent()}
    </div>
  );
};

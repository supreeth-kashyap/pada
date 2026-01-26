import React from 'react';
import './Steps.css';
import { Icon } from '../Icon';
import { Text } from '../Text';
import { TextWeight } from '../Text/helpers';

export type StepStatus = 'upcoming' | 'current' | 'completed';

export interface StepProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick' | 'onSelect'> {
  /** Optional title text */
  title?: string;
  /** Optional description text */
  description?: string;
  /** Step number or value. Defaults to auto-generated based on position */
  stepValue?: number | string;
  /** Status of the step */
  status?: StepStatus;
  /** Whether this is the last step (controls line extension) */
  isLast?: boolean;
  /** Click handler for the step */
  onClick?: (stepValue?: number | string) => void;
  /** Whether the step is clickable */
  clickable?: boolean;
  /** Callback when step is selected (changes to current) */
  onSelect?: (stepValue?: number | string) => void;
}

export const Step = ({
  title,
  description,
  stepValue,
  status = 'upcoming',
  isLast = false,
  onClick,
  clickable = true,
  onSelect,
  className = '',
  ...props
}: StepProps) => {
  // Determine if step should be interactive (upcoming and completed steps are clickable)
  const isInteractive = clickable && (status === 'upcoming' || status === 'completed');

  const handleClick = () => {
    if (isInteractive) {
      if (onSelect) {
        onSelect(stepValue);
      }
      onClick?.(stepValue);
    }
  };

  const classes = [
    'step-container',
    'step',
    `step--${status}`,
    isLast && 'step--last',
    isInteractive && 'step--clickable',
    className
  ].filter(Boolean).join(' ');

  const renderIcon = () => {
    // Completed status - white checkmark in green circle
    if (status === 'completed') {
      return (
        <div className="step__icon step__icon--completed">
          <Icon 
            name="tick_1" 
            size={12} 
            color="var(--color-white)" 
            className="step__icon--checkmark"
          />
        </div>
      );
    }

    // Current status - solid dark circle
    if (status === 'current') {
      return (
        <div className="step__icon step__icon--current" />
      );
    }
    
    // Default rest state for upcoming - circle with outline and inner dot
    return (
      <div className="step__icon step__icon--rest">
        <div className="step__icon--outer" />
        <div className="step__icon--dot" />
      </div>
    );
  };

  return (
    <div 
      className={classes}
      onClick={handleClick}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onKeyDown={(e) => {
        if (isInteractive && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          handleClick();
        }
      }}
      {...props}
    >
      <div className="step__icon-container">
        {renderIcon()}
        {!isLast && <div className="step__line" />}
      </div>
      <div className="step__content">
        {status === 'current' && <div className="step__box" />}
        {title && (
          <Text 
            size={16} 
            weight={TextWeight.MEDIUM} 
            className="step__title"
          >
            {title}
          </Text>
        )}
        {description && (
          <Text 
            size={12} 
            weight={TextWeight.NORMAL} 
            className="step__description"
          >
            {description}
          </Text>
        )}
      </div>
    </div>
  );
};

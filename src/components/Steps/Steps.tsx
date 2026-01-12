import React, { useState } from 'react';
import './Steps.css';
import { Step } from './Step';
import type { StepProps } from './Step';

export interface StepData {
  /** Optional title text */
  title?: string;
  /** Optional description text */
  description?: string;
  /** Step number or value */
  stepValue?: number | string;
  /** Status of the step */
  status?: StepProps['status'];
  /** Click handler for the step */
  onClick?: (stepValue?: number | string) => void;
  /** Whether the step is clickable */
  clickable?: boolean;
}

export interface StepsProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Array of step data */
  steps: StepData[];
  /** Default status for all steps (can be overridden per step) */
  defaultStatus?: StepProps['status'];
  /** Controlled current step value */
  currentStep?: number | string;
  /** Callback when a step becomes current (clicked) */
  onStepChange?: (stepValue: number | string) => void;
}

export const Steps = ({
  steps,
  defaultStatus = 'upcoming',
  currentStep,
  onStepChange,
  className = '',
  ...props
}: StepsProps) => {
  const [internalCurrent, setInternalCurrent] = useState<number | string | undefined>(undefined);

  const handleStepClick = (stepValue?: number | string) => {
    if (stepValue !== undefined) {
      if (onStepChange) {
        onStepChange(stepValue);
      } else {
        setInternalCurrent(stepValue);
      }
    }
  };

  const classes = [
    'steps',
    className
  ].filter(Boolean).join(' ');

  const current = currentStep !== undefined ? currentStep : internalCurrent;

  return (
    <div className={classes} {...props}>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        const stepValue = step.stepValue !== undefined 
          ? step.stepValue 
          : index + 1;
        
        // Determine status: 
        // - If this step is the current one, use 'current'
        // - If step has explicit status and it's not current, use that
        // - Otherwise use default status
        let stepStatus: StepProps['status'];
        if (current === stepValue) {
          stepStatus = 'current';
        } else if (step.status && step.status !== 'current') {
          // Use the step's original status if it's not being overridden by current
          stepStatus = step.status;
        } else {
          stepStatus = defaultStatus;
        }

        return (
          <Step
            key={index}
            title={step.title}
            description={step.description}
            stepValue={stepValue}
            status={stepStatus}
            isLast={isLast}
            onClick={step.onClick}
            clickable={step.clickable !== false && (stepStatus === 'upcoming' || stepStatus === 'completed')}
            onSelect={handleStepClick}
          />
        );
      })}
    </div>
  );
};

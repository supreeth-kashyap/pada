import React from 'react';
import './Progress.css';

export interface ProgressProps {
  value: number;
  max?: number;
  label?: string;
}

export const Progress: React.FC<ProgressProps> = ({ value, max = 100, label }) => {
  const percentage = (value / max) * 100;

  return (
    <div className="progress-wrapper">
      {label && <label className="progress-label">{label}</label>}
      <div className="progress-bar">
        <div
          className="progress-indicator"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        ></div>
      </div>
    </div>
  );
};

import React from 'react';
import './Splitter.css';
import { Icon } from '../../Icon';

export interface SplitterProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'primary' | 'secondary';
}

export const Splitter: React.FC<SplitterProps> = ({
  variant,
  className = '',
  type = 'button',
  ...props
}) => {
  return (
    <button
      type={type}
      className={`button-splitter button-splitter--${variant} ${className}`}
      {...props}
    >
      <Icon name="chevron_down" size="xs" />
    </button>
  );
};

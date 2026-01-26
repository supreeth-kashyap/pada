import React from 'react';
import './Button.css';
import { Icon } from '../Icon';
import { Splitter } from './Splitter/Splitter';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  variant?: ButtonVariant;
  leftIcon?: string;
  rightIcon?: string;
  split?: boolean;
  onSplitClick?: () => void;
  disabled?: boolean;
}

export const Button = ({
  children, 
  variant = 'primary', 
  leftIcon,
  rightIcon,
  split = false,
  onSplitClick,
  disabled = false,
  className = '',
  ...props 
}: ButtonProps) => {
  if (leftIcon && rightIcon) {
    console.warn('Button: use either leftIcon or rightIcon, not both.');
  }

  const resolvedLeftIcon = leftIcon;
  const resolvedRightIcon = leftIcon ? undefined : rightIcon;

  const buttonClasses = [
    'button',
    `button--${variant}`,
    split && (variant === 'primary' || variant === 'secondary') && 'button--split-main',
    className
  ].filter(Boolean).join(' ');

  const iconSize = 16;

  const getIconColor = (): string => {
    if (variant === 'primary') return 'var(--color-white)';
    if (variant === 'destructive') return 'var(--color-white)';
    return 'var(--color-neutral-600)';
  };

  const renderLeftVisual = () => {
    if (resolvedLeftIcon) {
      return <Icon name={resolvedLeftIcon} size={iconSize} color={getIconColor()} className="button__icon" />;
    }
    return null;
  };

  const renderRightVisual = () => {
    const canSplit = split && (variant === 'primary' || variant === 'secondary');
    if (resolvedRightIcon && !canSplit) {
      return <Icon name={resolvedRightIcon} size={iconSize} color={getIconColor()} className="button__icon" />;
    }
    return null;
  };

  const canSplit = split && (variant === 'primary' || variant === 'secondary');

  if (canSplit) {
    return (
      <div className={`button-split ${className}`}>
        <button
          className={['button', `button--${variant}`, 'button--split-main'].join(' ')}
          disabled={disabled}
          {...props}
        >
          {renderLeftVisual()}
          {children ? children : null}
        </button>
        <Splitter
          variant={variant}
          onClick={(event) => {
            event.stopPropagation();
            onSplitClick?.();
          }}
          disabled={disabled}
          aria-label="More options"
        />
      </div>
    );
  }

  return (
    <button
      className={buttonClasses}
      disabled={disabled}
      {...props}
    >
      {renderLeftVisual()}
      {children ? children : null}
      {renderRightVisual()}
    </button>
  );
};

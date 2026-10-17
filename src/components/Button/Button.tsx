import React from 'react';
import './Button.css';
import { Icon } from '../Icon';
import { Splitter } from './Splitter/Splitter';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  variant?: ButtonVariant;
  /** Height and padding: sm 28px, md 32px, lg 40px (scaled by density). */
  size?: ButtonSize;
  leftIcon?: string;
  rightIcon?: string;
  split?: boolean;
  onSplitClick?: () => void;
  disabled?: boolean;
  /**
   * Shows a spinner in place of the label and ignores clicks, keeping the button's width and
   * focus. Announced through `aria-busy`.
   */
  loading?: boolean;
  ref?: React.Ref<HTMLButtonElement>;
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  type = 'button',
  onClick,
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

  // Loading keeps the button focusable (unlike `disabled`), so focus is not lost mid-action.
  const stateProps = {
    type,
    'data-size': size,
    'data-variant': variant,
    'data-loading': loading ? '' : undefined,
    'aria-busy': loading || undefined,
    'aria-disabled': loading || undefined,
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
      if (loading) {
        event.preventDefault();
        return;
      }
      onClick?.(event);
    },
  };
  const label = children ? <span className="button-label">{children}</span> : null;
  const spinner = loading ? <span className="button-spinner" aria-hidden="true" /> : null;

  const renderLeftVisual = () => {
    if (resolvedLeftIcon) {
      return <Icon name={resolvedLeftIcon} size={iconSize} className="button__icon" data-position="start" aria-hidden="true" />;
    }
    return null;
  };

  const renderRightVisual = () => {
    const canSplit = split && (variant === 'primary' || variant === 'secondary');
    if (resolvedRightIcon && !canSplit) {
      return <Icon name={resolvedRightIcon} size={iconSize} className="button__icon" data-position="end" aria-hidden="true" />;
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
          {...stateProps}
          {...props}
        >
          {renderLeftVisual()}
          {label}
          {spinner}
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
      {...stateProps}
      {...props}
    >
      {renderLeftVisual()}
      {label}
      {renderRightVisual()}
      {spinner}
    </button>
  );
};

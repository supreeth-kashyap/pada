import React from 'react';
import './Button.css';
import { Icon } from '../Icon';
import { Logo } from '../Logo';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'link' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: string;
  rightIcon?: string;
  leftLogo?: string;
  rightLogo?: string;
  loading?: boolean;
  disabled?: boolean;
}

export const Button = ({
  children, 
  variant = 'primary', 
  size = 'md',
  leftIcon,
  rightIcon,
  leftLogo,
  rightLogo,
  loading = false,
  disabled = false,
  className = '',
  ...props 
}: ButtonProps) => {
  // Check if button is icon-only (no text content, only icons/logos)
  const hasTextContent = typeof children === 'string' ? children.trim().length > 0 : Boolean(children);
  const isIconOnly = !hasTextContent && !loading && (leftIcon || rightIcon || leftLogo || rightLogo);
  
  const buttonClasses = [
    'button',
    `button--${variant}`,
    `button--${size}`,
    loading && 'button--loading',
    disabled && 'button--disabled',
    isIconOnly && 'button--icon-only',
    className
  ].filter(Boolean).join(' ');

  const iconSize = 'xs';
  
  const getIconColor = (): 'Blue' | 'Green' | 'Yellow' | 'Red' | 'Icy' | 'White' => {
    if (variant === 'primary') return 'White';
    if (variant === 'secondary') return 'Icy';
    if (variant === 'ghost') return 'Icy';
    if (variant === 'link') return 'Blue';
    if (variant === 'destructive') return 'White';
    return 'Icy';
  };

  const renderLeftVisual = () => {
    if (loading) return null;
    if (leftIcon) {
      return <Icon name={leftIcon} size={iconSize} color={getIconColor()} className="button__icon" />;
    }
    if (leftLogo) {
      return <Logo name={leftLogo} size={iconSize} className="button__logo" />;
    }
    return null;
  };

  const renderRightVisual = () => {
    if (loading) return null;
    if (rightIcon) {
      return <Icon name={rightIcon} size={iconSize} color={getIconColor()} className="button__icon" />;
    }
    if (rightLogo) {
      return <Logo name={rightLogo} size={iconSize} className="button__logo" />;
    }
    return null;
  };

  const renderContent = () => {
    if (loading) {
      return (
        <span className="button__spinner" aria-label="Loading">
          <svg
            className="button__spinner-svg"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              className="button__spinner-circle"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </span>
      );
    }
    return children;
  };

  return (
    <button
      className={buttonClasses}
      disabled={disabled || loading}
      {...props}
    >
      {renderLeftVisual()}
      {renderContent()}
      {renderRightVisual()}
    </button>
  );
};

import React from 'react';
import './Tags.css';
import { Icon } from '../Icon';

export type TagsVariant = 'gray' | 'orange' | 'green' | 'yellow' | 'red' | 'blue' | 'purple' | 'pink' | 'deep-purple' | 'primary';
export type TagsSize = 'sm' | 'md' | 'lg';

export interface TagsProps {
  children: React.ReactNode;
  variant?: TagsVariant;
  size?: TagsSize;
  onClose?: () => void;
  onClick?: () => void;
  leftIcon?: string;
  disabled?: boolean;
  className?: string;
}

export const Tags: React.FC<TagsProps> = ({
  children,
  variant = 'gray',
  size = 'md',
  onClose,
  onClick,
  leftIcon,
  disabled = false,
  className = ''
}) => {
  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled && onClose) {
      onClose();
    }
  };

  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  const isClickable = !disabled && !!onClick;
  const hasClose = !disabled && !!onClose;

  const tagClasses = [
    'tags',
    `tags--${variant}`,
    `tags--${size}`,
    isClickable && 'tags--clickable',
    disabled && 'tags--disabled',
    className
  ].filter(Boolean).join(' ');

  const iconSize = size === 'sm' ? 12 : size === 'md' ? 12 : 16;
  
  // Get icon color based on variant - match the text color
  const getIconColor = (): string => {
    if (variant === 'primary' || variant === 'blue') return 'var(--color-blue-600)';
    if (variant === 'green') return 'var(--color-green-600)';
    if (variant === 'yellow') return 'var(--color-yellow-600)';
    if (variant === 'red') return 'var(--color-red-600)';
    if (variant === 'purple' || variant === 'deep-purple') return 'var(--color-purple-600)';
    if (variant === 'pink') return 'var(--color-fuchsia-600)';
    if (variant === 'orange') return 'var(--color-orange-600)';
    return 'var(--color-neutral-600)'; // Default for gray
  };
  
  const iconColor = getIconColor();

  return (
    <span
      className={tagClasses}
      onClick={handleClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable && !disabled ? 0 : undefined}
      aria-disabled={disabled}
    >
      {leftIcon && (
        <Icon 
          name={leftIcon} 
          size={iconSize} 
          color={iconColor}
          className="tags__icon tags__icon--left"
        />
      )}
      <span className="tags__content">{children}</span>
      {hasClose && (
        <button
          type="button"
          className="tags__close"
          onClick={handleClose}
          aria-label="Remove tag"
          tabIndex={-1}
        >
          <Icon 
            name="cross_1" 
            size={12} 
            color={iconColor}
            className="tags__icon"
          />
        </button>
      )}
    </span>
  );
};

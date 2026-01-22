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

  const iconSize = size === 'sm' ? 'xs' : size === 'md' ? 'xs' : 'sm';
  
  // Get icon color based on variant - match the text color
  const getIconColor = (): 'Blue' | 'Green' | 'Yellow' | 'Red' | 'Icy' | 'White' | 'Purple' | 'Magenta' | 'Tangerine' => {
    if (variant === 'primary' || variant === 'blue') return 'Blue';
    if (variant === 'green') return 'Green';
    if (variant === 'yellow') return 'Yellow';
    if (variant === 'red') return 'Red';
    if (variant === 'purple' || variant === 'deep-purple') return 'Purple';
    if (variant === 'pink') return 'Magenta';
    if (variant === 'orange') return 'Tangerine';
    return 'Icy'; // Default for gray
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
            size="xs" 
            color={iconColor}
            className="tags__icon"
          />
        </button>
      )}
    </span>
  );
};

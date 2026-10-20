import React from 'react';
import './Button.css';
import { Icon } from '../Icon';
import { SplitButtonRoot } from '../SplitButton/SplitButton';
import { useButtonGroup } from './ButtonGroupContext';
import { Splitter } from './Splitter/Splitter';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  /** Visual emphasis. Inside a `ButtonGroup` or `SplitButton.Root`, defaults to the group's. @default 'primary' */
  variant?: ButtonVariant;
  /** Height and padding: sm 28px, md 32px, lg 40px (scaled by density). Inside a group, defaults to the group's. @default 'md' */
  size?: ButtonSize;
  leftIcon?: string;
  rightIcon?: string;
  /** @deprecated Compose `SplitButton.Root` with a `Button` and a `SplitButton.Splitter` instead. Removed in 3.0. */
  split?: boolean;
  /** @deprecated Use `SplitButton.Splitter`'s `onClick`. Removed in 3.0. */
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
  variant: variantProp,
  size: sizeProp,
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
  const group = useButtonGroup();
  const variant = variantProp ?? group?.variant ?? 'primary';
  const size = sizeProp ?? group?.size ?? 'md';

  if (leftIcon && rightIcon) {
    console.warn('Button: use either leftIcon or rightIcon, not both.');
  }

  const resolvedLeftIcon = leftIcon;
  const resolvedRightIcon = leftIcon ? undefined : rightIcon;

  const canSplit = split && (variant === 'primary' || variant === 'secondary');

  const buttonClasses = [
    'button',
    `button--${variant}`,
    canSplit && 'button--split-main',
    !canSplit && className
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
    if (resolvedRightIcon && !canSplit) {
      return <Icon name={resolvedRightIcon} size={iconSize} className="button__icon" data-position="end" aria-hidden="true" />;
    }
    return null;
  };

  // 1.x API: kept as a thin wrapper over SplitButton.
  if (canSplit) {
    return (
      <SplitButtonRoot variant={variant} size={size} className={['button-split', className].filter(Boolean).join(' ')}>
        <button className={buttonClasses} disabled={disabled} {...stateProps} {...props}>
          {renderLeftVisual()}
          {label}
          {spinner}
        </button>
        <Splitter
          onClick={(event) => {
            event.stopPropagation();
            onSplitClick?.();
          }}
          disabled={disabled}
        />
      </SplitButtonRoot>
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

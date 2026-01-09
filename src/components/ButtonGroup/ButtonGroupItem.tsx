import React from 'react';
import { Icon } from '../Icon';
import { Logo } from '../Logo';
import { useButtonGroupContext } from './ButtonGroup';
import './ButtonGroup.css';

export interface ButtonGroupItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  leftIcon?: string;
  leftLogo?: string;
  children?: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const getIconColor = (variant: 'primary' | 'secondary'): 'Icy' | 'White' => {
  return variant === 'primary' ? 'White' : 'Icy';
};

export const ButtonGroupItem = ({
  leftIcon,
  leftLogo,
  children,
  className = '',
  ...props 
}: ButtonGroupItemProps) => {
  const context = useButtonGroupContext();
  const variant = context?.variant || 'primary';
  const hasLabel = Boolean(children);
  const hasLeftVisual = Boolean(leftIcon || leftLogo);

  const itemClasses = [
    'button-group__item',
    !hasLabel && 'button-group__item--icon-only',
    className
  ].filter(Boolean).join(' ');

  const iconColor = getIconColor(variant);

  const renderLeftVisual = () => {
    if (leftIcon) {
      return <Icon name={leftIcon} size="xs" color={iconColor} className="button-group__icon" />;
    }
    if (leftLogo) {
      return <Logo name={leftLogo} size="xs" className="button-group__logo" />;
    }
    return null;
  };

  return (
    <button
      className={itemClasses}
      {...props}
    >
      {hasLeftVisual && renderLeftVisual()}
      {hasLabel && <span className="button-group__label">{children}</span>}
    </button>
  );
};

import React from 'react';
import './Button.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'link' | 'destructive';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((
  { children, variant = 'primary', size = 'md', ...props },
  ref
) => {
  return (
    <button
      ref={ref}
      className={`button button--${variant} button--${size}`}
      {...props}
    >
      {children}
    </button>
  );
});

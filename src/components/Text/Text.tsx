import React from 'react';
import './Text.css';
import { TextSize, TextWeight, TextFamily, TextLineHeight } from './helpers';

export interface TextProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  size?: TextSize;
  weight?: TextWeight;
  family?: TextFamily;
  lineHeight?: TextLineHeight;
  color?: string;
  as?: 'span' | 'p' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export const Text: React.FC<TextProps> = ({
  children,
  size = TextSize.BASE,
  weight = TextWeight.NORMAL,
  family,
  lineHeight = TextLineHeight.BASE,
  color = 'var(--color-neutral-900)',
  as = 'span',
  className = '',
  style,
  ...props
}) => {
  const Component = as;
  const classes = [
    'text',
    `text--${size}`,
    `text--weight-${weight}`,
    family && `text--family-${family}`,
    `text--line-height-${lineHeight}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <Component
      className={classes}
      style={{ color, ...style }}
      {...props}
    >
      {children}
    </Component>
  );
};

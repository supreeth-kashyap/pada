import React from 'react';
import './Tags.css';
import { Icon } from '../Icon';

/**
 * Figma variant names (preferred). Each maps to a tinted-50 bg, tinted-100
 * border, and tinted-700 text in its hue.
 *
 * Legacy hue names (`gray`, `blue`, `green`, `yellow`, `red`, `purple`,
 * `deep-purple`, `pink`, `orange`) are kept as aliases so existing call
 * sites keep working — they all resolve to the closest Figma variant.
 */
export type TagsVariant =
  | 'neutral'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'royal'
  /** @deprecated use `neutral` */ | 'gray'
  /** @deprecated use `primary` */ | 'blue'
  /** @deprecated use `secondary` */ | 'yellow'
  /** @deprecated use `secondary` */ | 'orange'
  /** @deprecated use `success` */ | 'green'
  /** @deprecated use `danger` */ | 'red'
  /** @deprecated use `royal` */ | 'purple'
  /** @deprecated use `royal` */ | 'deep-purple'
  /** @deprecated use `royal` */ | 'pink';

export interface TagsProps {
  children: React.ReactNode;
  variant?: TagsVariant;
  /**
   * Optional leading visual. Accepts:
   *  - a Material-symbol name string (renders an `<Icon>`), or
   *  - any React node (an `<Icon />`, `<img />`, emoji, etc.) rendered as-is.
   * When omitted, only the label is shown.
   */
  icon?: React.ReactNode | string;
  className?: string;
}

/** Map legacy hue aliases to the Figma variant they live under. */
const VARIANT_ALIAS: Record<TagsVariant, string> = {
  neutral: 'neutral',
  primary: 'primary',
  secondary: 'secondary',
  success: 'success',
  danger: 'danger',
  royal: 'royal',
  gray: 'neutral',
  blue: 'primary',
  yellow: 'secondary',
  orange: 'secondary',
  green: 'success',
  red: 'danger',
  purple: 'royal',
  'deep-purple': 'royal',
  pink: 'royal',
};

export const Tags: React.FC<TagsProps> = ({
  children,
  variant = 'neutral',
  icon,
  className = ''
}) => {
  const resolvedVariant = VARIANT_ALIAS[variant] ?? 'neutral';

  const tagClasses = [
    'tags',
    `tags--${resolvedVariant}`,
    className
  ].filter(Boolean).join(' ');

  // If a node was passed in `icon`, render it as-is so consumers can pass any
  // element (most commonly a pre-built `<Icon />`). If a string was passed,
  // render the `<Icon>` component sized to the Figma 12px slot.
  let leadingVisual: React.ReactNode = null;
  if (icon !== undefined && icon !== null && icon !== false) {
    leadingVisual =
      typeof icon === 'string'
        ? <Icon name={icon} size={12} className="tags__icon" />
        : <span className="tags__icon">{icon}</span>;
  }

  return (
    <span className={tagClasses}>
      {leadingVisual}
      <span className="tags__content">{children}</span>
    </span>
  );
};

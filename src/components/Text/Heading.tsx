import type { ComponentPropsWithRef } from 'react';
import type { TextSize, TextWeight } from './helpers';
import './Heading.css';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

/** The type-scale size each heading level gets unless `size` says otherwise. */
const LEVEL_SIZES: Record<HeadingLevel, TextSize> = {
  1: '3xl',
  2: '2xl',
  3: 'xl',
  4: 'lg',
  5: 'base',
  6: 'sm',
};

export interface HeadingProps extends ComponentPropsWithRef<'h2'> {
  /** The heading level, rendered as a native `h1`–`h6`. @default 2 */
  level?: HeadingLevel;
  /** Font size on the type scale. Defaults by level (h1 `3xl` … h6 `sm`). */
  size?: TextSize;
  /** Font weight, 100–900. @default '600' */
  weight?: TextWeight;
}

/**
 * A section heading on the type scale. Renders a native `h1`–`h6`, so the document outline and
 * the heading role come from the element; the level picks a default size (h1 3xl, h2 2xl, h3 xl,
 * h4 lg, h5 base, h6 sm) that `size` can override when the visual and the outline differ.
 *
 * ```tsx
 * <Heading level={1}>Billing</Heading>
 * <Heading level={3} size="lg">Payment method</Heading>
 * ```
 *
 * Sizes, weights, line height and letter spacing come from tokens (`--pada-heading-*`), never
 * inline styles.
 */
export function Heading({ level = 2, size, weight = '600', className, ...props }: HeadingProps) {
  const Tag = `h${level}` as const;
  return (
    <Tag
      data-level={level}
      data-size={size ?? LEVEL_SIZES[level]}
      data-weight={weight}
      {...props}
      className={['heading', className].filter(Boolean).join(' ')}
    />
  );
}

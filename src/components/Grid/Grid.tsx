import type { ComponentPropsWithRef, CSSProperties, ElementType } from 'react';
import './Grid.css';

type Space = 0 | 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16;

export interface GridProps extends ComponentPropsWithRef<'div'> {
  /** Fixed number of equal columns. Ignored when `minItemWidth` is set. @default 1 */
  columns?: number;
  /**
   * Fit as many columns as there is room for, each at least this wide (`240px`, `16rem`).
   * Responsive without breakpoints.
   */
  minItemWidth?: string;
  /** Gap in spacing steps, like Stack: `gap={4}` is 16px at default density. @default 4 */
  gap?: Space;
  /** Row gap, when it differs from `gap`. */
  rowGap?: Space;
  /** Cross-axis alignment of items. */
  align?: 'start' | 'center' | 'end' | 'stretch';
  /** Element to render, e.g. `ul` or `section`. */
  as?: ElementType;
}

const spaceToken = (gap: Space) => (gap === 0 ? '0px' : `var(--pada-space-${String(gap).replace('.', '-')})`);

/** CSS grid layout with token gaps: fixed columns, or as many as fit (`minItemWidth`). */
export function Grid({ columns = 1, minItemWidth, gap = 4, rowGap, align, as: Component = 'div', className, style, ...props }: GridProps) {
  return (
    <Component
      {...props}
      data-align={align}
      data-fit={minItemWidth ? '' : undefined}
      className={['grid', className].filter(Boolean).join(' ')}
      style={
        {
          '--pada-grid-columns': columns,
          '--pada-grid-gap': spaceToken(gap),
          '--pada-grid-row-gap': spaceToken(rowGap ?? gap),
          ...(minItemWidth && { '--pada-grid-min-item-width': minItemWidth }),
          ...style,
        } as CSSProperties
      }
    />
  );
}

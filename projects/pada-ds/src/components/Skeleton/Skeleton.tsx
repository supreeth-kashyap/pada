import type { ComponentPropsWithRef, CSSProperties } from 'react';
import './Skeleton.css';

export interface SkeletonProps extends ComponentPropsWithRef<'span'> {
  /** `text` (a line of text), `rect` (a block) or `circle` (an avatar). */
  shape?: 'text' | 'rect' | 'circle';
  /** CSS width. Text lines default to 100%; circles to their height. */
  width?: number | string;
  /** CSS height. */
  height?: number | string;
  /** For `text`: number of lines; the last one is shorter. */
  lines?: number;
}

const size = (value: number | string | undefined) => (typeof value === 'number' ? `${value}px` : value);

/**
 * A placeholder that shimmers while content loads. Hidden from assistive technology: mark the
 * loading region with `aria-busy` instead.
 */
export function Skeleton({ shape = 'text', width, height, lines = 1, className, style, ...props }: SkeletonProps) {
  const vars = {
    ...(width !== undefined ? { ['--pada-skeleton-width' as string]: size(width) } : {}),
    ...(height !== undefined ? { ['--pada-skeleton-height' as string]: size(height) } : {}),
    ...style,
  } as CSSProperties;
  const classes = ['skeleton', className].filter(Boolean).join(' ');
  if (shape === 'text' && lines > 1) {
    return (
      <span className="skeleton-lines" aria-hidden="true" style={vars}>
        {Array.from({ length: lines }, (_, index) => (
          <span key={index} data-shape="text" data-last={index === lines - 1 ? '' : undefined} {...props} className={classes} />
        ))}
      </span>
    );
  }
  return <span aria-hidden="true" data-shape={shape} {...props} className={classes} style={vars} />;
}

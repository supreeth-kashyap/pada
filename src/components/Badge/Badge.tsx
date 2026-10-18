import type { ComponentPropsWithRef } from 'react';
import './Badge.css';

export type BadgeTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info';

export interface BadgeProps extends ComponentPropsWithRef<'span'> {
  /** Colour by meaning. */
  tone?: BadgeTone;
  /** `subtle` (tinted), `solid` (filled) or `outline`. */
  variant?: 'subtle' | 'solid' | 'outline';
  /** sm for counts and dense tables, md otherwise. */
  size?: 'sm' | 'md';
  /** A numeric count. Replaces children; bumps briefly when it changes. */
  count?: number;
  /** Counts above this show as "max+". */
  max?: number;
  /** Show a leading status dot. */
  dot?: boolean;
}

/**
 * A short status label or a count: "Beta", "Overdue", "12". For removable or clickable labels
 * use `Tags`.
 */
export function Badge({ tone = 'neutral', variant = 'subtle', size = 'md', count, max = 99, dot, className, children, ...props }: BadgeProps) {
  const content = count === undefined ? children : count > max ? `${max}+` : String(count);
  return (
    <span data-tone={tone} data-variant={variant} data-size={size} {...props} className={['badge', className].filter(Boolean).join(' ')}>
      {dot && <span className="badge-dot" aria-hidden="true" />}
      {/* Keyed by the count so a new value re-runs the bump animation. */}
      <span key={count === undefined ? undefined : String(content)} className="badge-label" data-count={count === undefined ? undefined : ''}>
        {content}
      </span>
    </span>
  );
}

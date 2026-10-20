import type { CSSProperties, ComponentPropsWithRef } from 'react';
import './ProgressCircle.css';

export type ProgressCircleSize = 'sm' | 'md' | 'lg';

export interface ProgressCircleProps extends Omit<ComponentPropsWithRef<'div'>, 'children'> {
  /** Current value, from 0 to `max`. `null` (the default) spins indeterminately. */
  value?: number | null;
  /** The value that means done. @default 100 */
  max?: number;
  /** Accessible name. Required: the ring has no visible text of its own. */
  label: string;
  /** sm 16px, md 24px, lg 48px. @default 'md' */
  size?: ProgressCircleSize;
  /** Shows the percentage inside the ring. Only legible at `lg`. */
  showValue?: boolean;
}

/** `value` as a percentage of `max`, clamped to 0–100; null while indeterminate. */
function progressPercentage(value: number | null | undefined, max: number): number | null {
  if (value === null || value === undefined || Number.isNaN(value)) return null;
  const percentage = max > 0 ? (value / max) * 100 : 0;
  return Math.min(100, Math.max(0, percentage));
}

/**
 * Circular progress: a ring that fills clockwise from the top, or spins while `value` is `null`.
 * For compact places (a table cell, a file row, a button); use `Progress` where there is room for
 * a bar and a label.
 *
 * ```tsx
 * <ProgressCircle label="Uploading report.pdf" value={64} />
 * <ProgressCircle label="Syncing" size="sm" />
 * <ProgressCircle label="Storage used" value={72} size="lg" showValue />
 * ```
 *
 * `role="progressbar"` named by `label`, with `aria-valuenow` (left out while indeterminate) and
 * `data-state` (`indeterminate`, `loading`, `complete`). The stroke dash transitions on value change.
 */
export function ProgressCircle({
  value = null,
  max = 100,
  label,
  size = 'md',
  showValue = false,
  className,
  style,
  ...props
}: ProgressCircleProps) {
  const percentage = progressPercentage(value, max);
  const state = percentage === null ? 'indeterminate' : percentage >= 100 ? 'complete' : 'loading';
  const valueText = percentage === null ? undefined : `${Math.round(percentage)}%`;
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={state === 'indeterminate' ? undefined : (value ?? undefined)}
      aria-valuetext={valueText}
      data-state={state}
      data-size={size}
      {...props}
      className={['progress-circle', className].filter(Boolean).join(' ')}
      style={{ '--pada-progress-circle-percentage': percentage ?? 0, ...style } as CSSProperties}
    >
      <svg className="progress-circle-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <circle className="progress-circle-track" cx="12" cy="12" r="10" />
        <circle
          className="progress-circle-indicator"
          cx="12"
          cy="12"
          r="10"
          pathLength={100}
          data-state={state}
          data-empty={percentage === 0 ? '' : undefined}
        />
      </svg>
      {showValue && valueText && (
        <span className="progress-circle-value" aria-hidden="true">
          {valueText}
        </span>
      )}
    </div>
  );
}

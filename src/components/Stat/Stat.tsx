import { useId, useMemo, useRef, type ReactNode } from 'react';
import { useAnimatedNumber } from '../../headless/utils/useAnimatedNumber';
import { VisuallyHidden } from '../../headless/utils/VisuallyHidden';
import './Stat.css';

const cx = (...names: (string | undefined | false)[]) => names.filter(Boolean).join(' ');

export type StatTrend = 'up' | 'down' | 'neutral';

export interface StatProps {
  label: ReactNode;
  /** A number (formatted and animated) or any content. */
  value: number | ReactNode;
  /** Number format for `value`: currency, percent, compact notation, units. */
  formatOptions?: Intl.NumberFormatOptions;
  locale?: string;
  /** Change since the comparison period, e.g. 0.125 with a percent format, or 12. */
  delta?: number;
  /** Number format for `delta`. Defaults to `formatOptions` with a sign. */
  deltaFormatOptions?: Intl.NumberFormatOptions;
  /** Comparison text after the delta, e.g. "vs last week". */
  deltaLabel?: ReactNode;
  /** Direction of the delta. Defaults to the delta's sign. */
  trend?: StatTrend;
  /** When going down is good (costs, errors, latency): down shows as positive. */
  invertTrend?: boolean;
  /** Help text under the value. */
  description?: ReactNode;
  /** Slot for a sparkline or small chart. */
  chart?: ReactNode;
  /** Count up from the previous value when it changes. @default true */
  animate?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const TREND_WORD: Record<StatTrend, string> = { up: 'up', down: 'down', neutral: 'unchanged' };

/**
 * A key figure (KPI): a label, a big value that counts to its new number when it changes, an
 * optional delta coloured by whether the change is good, a description and a chart slot.
 */
export function Stat({
  label,
  value,
  formatOptions,
  locale,
  delta,
  deltaFormatOptions,
  deltaLabel,
  trend: trendProp,
  invertTrend = false,
  description,
  chart,
  animate = true,
  size = 'md',
  className,
}: StatProps) {
  const labelId = useId();
  const valueRef = useRef<HTMLDivElement>(null);
  const numeric = typeof value === 'number' ? value : null;
  const animated = useAnimatedNumber(numeric ?? 0, valueRef, { duration: animate ? 480 : 0 });
  const optionsKey = JSON.stringify(formatOptions ?? {});
  const deltaOptionsKey = JSON.stringify(deltaFormatOptions ?? {});
  // eslint-disable-next-line react-hooks/exhaustive-deps -- keyed on the options' content
  const format = useMemo(() => new Intl.NumberFormat(locale, formatOptions), [locale, optionsKey]);
  const formatDelta = useMemo(
    () => new Intl.NumberFormat(locale, { ...(deltaFormatOptions ?? formatOptions), signDisplay: 'exceptZero' }),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- keyed on the options' content
    [locale, optionsKey, deltaOptionsKey],
  );

  const trend: StatTrend = trendProp ?? (delta === undefined || delta === 0 ? 'neutral' : delta > 0 ? 'up' : 'down');
  const sentiment = trend === 'neutral' ? 'neutral' : (trend === 'up') !== invertTrend ? 'positive' : 'negative';

  return (
    <div role="group" aria-labelledby={labelId} className={cx('stat', className)} data-size={size}>
      <div id={labelId} className="stat-label">
        {label}
      </div>
      <div ref={valueRef} className="stat-value">
        {numeric === null ? (
          value
        ) : (
          <>
            {/* Screen readers get the final value, not every frame of the count. */}
            <span aria-hidden="true">{format.format(animated)}</span>
            <VisuallyHidden>{format.format(numeric)}</VisuallyHidden>
          </>
        )}
      </div>
      {delta !== undefined && (
        <div className="stat-delta" data-trend={trend} data-sentiment={sentiment}>
          <span className="stat-delta-badge">
            <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true" className="stat-delta-arrow">
              <path d="M8 13V3M4 7l4-4 4 4" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <VisuallyHidden>{TREND_WORD[trend]} </VisuallyHidden>
            {formatDelta.format(delta)}
          </span>
          {deltaLabel && <span className="stat-delta-label">{deltaLabel}</span>}
        </div>
      )}
      {description && <div className="stat-description">{description}</div>}
      {chart && <div className="stat-chart">{chart}</div>}
    </div>
  );
}

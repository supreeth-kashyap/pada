// Time-of-day helpers for the time field: "HH:mm" / "HH:mm:ss" strings, no dependencies.

/** The four kinds of segment a time field shows. */
export type TimeSegmentType = 'hour' | 'minute' | 'second' | 'dayPeriod';
export type DayPeriod = 'AM' | 'PM';

/** A time being entered. Hours are 0–23; any part may still be empty. */
export interface TimeParts {
  hour: number | null;
  minute: number | null;
  second: number | null;
  period: DayPeriod | null;
}

export const EMPTY_TIME: TimeParts = { hour: null, minute: null, second: null, period: null };

/** Two digits: 7 → "07". */
export const pad = (value: number) => String(value).padStart(2, '0');

/** Parses "HH:mm" or "HH:mm:ss" (24-hour). Anything else is empty. */
export function parseTime(value: string | null | undefined): TimeParts {
  const match = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(value?.trim() ?? '');
  if (!match) return EMPTY_TIME;
  const [hour, minute, second = 0] = match.slice(1).map((part) => Number(part ?? 0));
  if (hour > 23 || minute > 59 || second > 59) return EMPTY_TIME;
  return { hour, minute, second, period: hour >= 12 ? 'PM' : 'AM' };
}

/** "HH:mm", or "HH:mm:ss" with seconds. */
export const formatTime = (hour: number, minute: number, second: number | null) =>
  `${pad(hour)}:${pad(minute)}${second === null ? '' : `:${pad(second)}`}`;

/** Seconds since midnight of a time string, or null when it does not parse. */
export function timeToSeconds(value: string | null | undefined): number | null {
  const { hour, minute, second } = parseTime(value);
  return hour === null ? null : hour * 3600 + (minute ?? 0) * 60 + (second ?? 0);
}

/**
 * Steps `value` by `step` in `direction`, snapping to multiples of `step` and wrapping around
 * `low`…`high`. An empty value starts at `low` going up and at the last step going down.
 */
export function stepValue(
  value: number | null,
  direction: 1 | -1,
  step: number,
  low: number,
  high: number,
): number {
  const lastStep = high - ((high - low) % step);
  if (value === null) return direction > 0 ? low : lastStep;
  const offset = value - low;
  const next =
    low +
    (direction > 0 ? Math.floor(offset / step) * step + step : Math.ceil(offset / step) * step - step);
  if (next > high) return low;
  if (next < low) return lastStep;
  return next;
}

/** Whether `value` falls outside `min`…`max` (all `"HH:mm"` / `"HH:mm:ss"`). */
export function isTimeOutOfRange(value: string | null | undefined, min?: string, max?: string) {
  const seconds = timeToSeconds(value);
  if (seconds === null) return false;
  const low = timeToSeconds(min);
  const high = timeToSeconds(max);
  return (low !== null && seconds < low) || (high !== null && seconds > high);
}

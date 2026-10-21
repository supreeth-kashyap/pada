import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type ComponentPropsWithRef,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from 'react';
import { createPartContext } from '../utils/context';
import { composeEventHandlers, dataFlag } from '../utils/events';
import { useComposedRefs } from '../utils/refs';
import { useControllableState } from '../utils/useControllableState';
import {
  formatTime,
  isTimeOutOfRange,
  pad,
  parseTime,
  stepValue,
  type DayPeriod,
  type TimeParts,
  type TimeSegmentType,
} from './time';

export type { DayPeriod, TimeParts, TimeSegmentType } from './time';

/** The smallest unit entered: minutes (`HH:mm`) or seconds (`HH:mm:ss`). */
export type TimeGranularity = 'minute' | 'second';
/** 12-hour clock with AM/PM, or 24-hour. */
export type HourCycle = 12 | 24;
/** One piece of the field's layout, in the locale's order: a segment, or literal text (":"). */
export type TimeFieldPart = { type: TimeSegmentType } | { type: 'literal'; text: string };

/** What a segment shows and announces. */
export interface TimeSegmentState {
  type: TimeSegmentType;
  /** The value in the segment's own range (hours 1–12 on a 12-hour clock; 0 = AM, 1 = PM). */
  value: number | null;
  min: number;
  max: number;
  /** Shown text, or the placeholder while empty. */
  text: string;
  /** For `aria-valuetext`. */
  valueText: string;
}

const SEGMENT_LABELS: Record<TimeSegmentType, string> = {
  hour: 'Hours',
  minute: 'Minutes',
  second: 'Seconds',
  dayPeriod: 'AM/PM',
};

const REFERENCE = new Date(2000, 0, 1, 13, 5, 6);

interface TimeFieldContextValue {
  layout: TimeFieldPart[];
  disabled: boolean;
  readOnly: boolean;
  outOfRange: boolean;
  periodLabels: Record<DayPeriod, string>;
  segmentState: (type: TimeSegmentType) => TimeSegmentState;
  setSegment: (type: TimeSegmentType, value: number | null) => void;
  stepSegment: (type: TimeSegmentType, direction: 1 | -1, page?: boolean) => void;
  setSegmentToEnd: (type: TimeSegmentType, end: 'min' | 'max') => void;
  focusSegment: (from: HTMLElement | null, offset: number) => void;
  register: (element: HTMLElement | null, previous: HTMLElement | null) => void;
}

const [TimeFieldProvider, useTimeFieldContext] = createPartContext<TimeFieldContextValue>('TimeField.Root');

export interface TimeFieldRootProps
  extends Omit<ComponentPropsWithRef<'div'>, 'defaultValue' | 'onChange' | 'children'> {
  /** The time, `"HH:mm"` or `"HH:mm:ss"` (24-hour), null while incomplete (controlled). */
  value?: string | null;
  /** The initial time (uncontrolled). @default null */
  defaultValue?: string | null;
  /** Called with the new time, or null when a segment is emptied. */
  onValueChange?: (value: string | null) => void;
  /** Smallest unit entered. @default 'minute' */
  granularity?: TimeGranularity;
  /** 12- or 24-hour clock. Follows the locale when unset. */
  hourCycle?: HourCycle;
  /** Locale for the segment order, separators, clock and AM/PM names. Defaults to the browser's. */
  locale?: string;
  /** Minutes the arrow keys step by. @default 1 */
  minuteStep?: number;
  /** Earliest valid time (`"HH:mm"`); a value before it marks the field invalid. */
  min?: string;
  /** Latest valid time (`"HH:mm"`); a value after it marks the field invalid. */
  max?: string;
  /** Shown in empty segments. @default '––' */
  placeholder?: string;
  disabled?: boolean;
  /** Segments can be focused but not changed. */
  readOnly?: boolean;
  /** Submits the value with a native form under this name. */
  name?: string;
  /**
   * The segments. A function receives the locale's layout (segments and separators in order);
   * when omitted, every segment and separator is rendered as a plain span.
   */
  children?: ReactNode | ((layout: TimeFieldPart[]) => ReactNode);
}

/**
 * A time of day entered in segments (hours, minutes, optionally seconds, and AM/PM on a 12-hour
 * clock), each a `spinbutton` inside a `role="group"`. The order, separators and clock follow the
 * locale through `Intl`. The value is a 24-hour `"HH:mm"` (or `"HH:mm:ss"`) string, null until
 * every segment is filled. Name it with `aria-label` or `aria-labelledby`.
 */
export function TimeFieldRoot({
  value: valueProp,
  defaultValue = null,
  onValueChange,
  granularity = 'minute',
  hourCycle,
  locale,
  minuteStep = 1,
  min,
  max,
  placeholder = '––',
  disabled = false,
  readOnly = false,
  name,
  children,
  ...props
}: TimeFieldRootProps) {
  const [value, setValue] = useControllableState<string | null>({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: onValueChange,
  });

  // The segments' contents, which may be incomplete. A value this field emitted itself keeps a
  // half-entered time as it is; any other new value replaces the segments.
  const emitted = useRef<string | null | undefined>(undefined);
  const [parts, setParts] = useState<TimeParts>(() => parseTime(value));
  const [seenValue, setSeenValue] = useState(value);
  if (value !== seenValue) {
    setSeenValue(value);
    if (value !== emitted.current) {
      emitted.current = undefined;
      setParts(parseTime(value));
    }
  }
  const partsRef = useRef(parts);
  partsRef.current = parts;
  const valueRef = useRef(value);
  valueRef.current = value;

  const twelveHour = useMemo(() => {
    if (hourCycle) return hourCycle === 12;
    const resolved = new Intl.DateTimeFormat(locale, { hour: 'numeric' }).resolvedOptions();
    return resolved.hourCycle === 'h12' || resolved.hourCycle === 'h11';
  }, [hourCycle, locale]);

  const layout = useMemo<TimeFieldPart[]>(() => {
    const formatted = new Intl.DateTimeFormat(locale, {
      hour: 'numeric',
      minute: '2-digit',
      second: granularity === 'second' ? '2-digit' : undefined,
      hourCycle: twelveHour ? 'h12' : 'h23',
    }).formatToParts(REFERENCE);
    const result: TimeFieldPart[] = [];
    for (const part of formatted) {
      if (part.type === 'literal') {
        // Separators only between segments; spacing around AM/PM is left to styles.
        const text = part.value.trim();
        if (text && result.length) result.push({ type: 'literal', text });
      } else if (part.type === 'hour' || part.type === 'minute' || part.type === 'second' || part.type === 'dayPeriod') {
        result.push({ type: part.type });
      }
    }
    if (result[result.length - 1]?.type === 'literal') result.pop();
    return result;
  }, [locale, granularity, twelveHour]);

  const periodLabels = useMemo<Record<DayPeriod, string>>(() => {
    const format = new Intl.DateTimeFormat(locale, { hour: 'numeric', hourCycle: 'h12' });
    const label = (hour: number, fallback: string) =>
      format.formatToParts(new Date(2000, 0, 1, hour)).find((part) => part.type === 'dayPeriod')?.value ?? fallback;
    return { AM: label(9, 'AM'), PM: label(21, 'PM') };
  }, [locale]);

  const outOfRange = isTimeOutOfRange(value, min, max);

  const segmentState = useCallback(
    (type: TimeSegmentType): TimeSegmentState => {
      const current = partsRef.current;
      if (type === 'dayPeriod') {
        const period = current.period;
        return {
          type,
          value: period === null ? null : period === 'AM' ? 0 : 1,
          min: 0,
          max: 1,
          text: period ? periodLabels[period] : placeholder,
          valueText: period ? periodLabels[period] : 'Empty',
        };
      }
      const range = type === 'hour' ? (twelveHour ? { min: 1, max: 12 } : { min: 0, max: 23 }) : { min: 0, max: 59 };
      let segment: number | null = type === 'hour' ? current.hour : current[type];
      if (type === 'hour' && segment !== null && twelveHour) segment = segment % 12 || 12;
      const text = segment === null ? placeholder : type === 'hour' && twelveHour ? String(segment) : pad(segment);
      return { type, value: segment, ...range, text, valueText: segment === null ? 'Empty' : String(segment) };
    },
    // `parts` is read through the ref; listing it re-creates the state for every segment on change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [parts, periodLabels, placeholder, twelveHour],
  );

  const sync = useCallback(
    (next: TimeParts) => {
      const withSeconds = granularity === 'second';
      const complete =
        next.hour !== null &&
        next.minute !== null &&
        (!withSeconds || next.second !== null) &&
        (!twelveHour || next.period !== null);
      const time = complete ? formatTime(next.hour!, next.minute!, withSeconds ? next.second : null) : null;
      if (time === valueRef.current) return;
      emitted.current = time;
      valueRef.current = time;
      setValue(time);
    },
    [granularity, twelveHour, setValue],
  );

  const setSegment = useCallback(
    (type: TimeSegmentType, segment: number | null) => {
      if (disabled || readOnly) return;
      const next = { ...partsRef.current };
      if (type === 'dayPeriod') {
        next.period = segment === null ? null : segment === 0 ? 'AM' : 'PM';
        if (next.hour !== null && next.period) next.hour = (next.hour % 12) + (next.period === 'PM' ? 12 : 0);
      } else if (type === 'hour') {
        next.hour = segment === null ? null : twelveHour ? (segment % 12) + (next.period === 'PM' ? 12 : 0) : segment;
        if (next.hour !== null && !twelveHour) next.period = next.hour >= 12 ? 'PM' : 'AM';
      } else {
        next[type] = segment;
      }
      partsRef.current = next;
      setParts(next);
      sync(next);
    },
    [disabled, readOnly, twelveHour, sync],
  );

  const stepSegment = useCallback(
    (type: TimeSegmentType, direction: 1 | -1, page = false) => {
      const { value: segment, min: low, max: high } = segmentState(type);
      if (type === 'dayPeriod') return setSegment(type, segment === null ? 0 : 1 - segment);
      const step =
        type === 'minute'
          ? Math.max(1, page ? Math.max(15, minuteStep) : minuteStep)
          : page
            ? type === 'hour'
              ? 2
              : 15
            : 1;
      setSegment(type, stepValue(segment, direction, step, low, high));
    },
    [segmentState, setSegment, minuteStep],
  );

  const setSegmentToEnd = useCallback(
    (type: TimeSegmentType, end: 'min' | 'max') => {
      const { min: low, max: high } = segmentState(type);
      if (end === 'min') return setSegment(type, low);
      const step = type === 'minute' ? Math.max(1, minuteStep) : 1;
      setSegment(type, high - ((high - low) % step));
    },
    [segmentState, setSegment, minuteStep],
  );

  const segments = useRef(new Set<HTMLElement>());
  const register = useCallback((element: HTMLElement | null, previous: HTMLElement | null) => {
    if (previous) segments.current.delete(previous);
    if (element) segments.current.add(element);
  }, []);

  const focusSegment = useCallback((from: HTMLElement | null, offset: number) => {
    const elements = [...segments.current].sort((a, b) =>
      a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
    );
    const index = from ? elements.indexOf(from) : 0;
    elements[Math.min(elements.length - 1, Math.max(0, index + offset))]?.focus();
  }, []);

  const context = useMemo(
    () => ({
      layout,
      disabled,
      readOnly,
      outOfRange,
      periodLabels,
      segmentState,
      setSegment,
      stepSegment,
      setSegmentToEnd,
      focusSegment,
      register,
    }),
    [layout, disabled, readOnly, outOfRange, periodLabels, segmentState, setSegment, stepSegment, setSegmentToEnd, focusSegment, register],
  );

  const content =
    typeof children === 'function'
      ? children(layout)
      : (children ??
        layout.map((part, index) =>
          part.type === 'literal' ? (
            <span key={index} aria-hidden="true">
              {part.text}
            </span>
          ) : (
            <TimeFieldSegment key={index} type={part.type} />
          ),
        ));

  return (
    <TimeFieldProvider value={context}>
      <div
        role="group"
        data-disabled={dataFlag(disabled)}
        data-readonly={dataFlag(readOnly)}
        data-invalid={dataFlag(outOfRange)}
        data-complete={dataFlag(value !== null)}
        {...props}
      >
        {content}
        {name && <input type="hidden" name={name} value={value ?? ''} disabled={disabled} />}
      </div>
    </TimeFieldProvider>
  );
}

export interface TimeFieldSegmentProps extends Omit<ComponentPropsWithRef<'span'>, 'children'> {
  /** Which part of the time this segment holds. */
  type: TimeSegmentType;
  /** Accessible name. @default 'Hours', 'Minutes', 'Seconds' or 'AM/PM' */
  label?: string;
}

/**
 * One segment (`role="spinbutton"`): ArrowUp/ArrowDown step it (wrapping), PageUp/PageDown by a
 * larger step, Home/End to its lowest and highest values, digits type into it (moving on once it
 * is full), A/P (the first letter of the locale's names) set AM/PM, Backspace and Delete empty
 * it, ArrowLeft/ArrowRight move between segments. The segment renders its own text.
 */
export function TimeFieldSegment({
  type,
  label,
  ref,
  onKeyDown,
  onFocus,
  'aria-invalid': ariaInvalid,
  ...props
}: TimeFieldSegmentProps) {
  const field = useTimeFieldContext('TimeField.Segment');
  const element = useRef<HTMLSpanElement | null>(null);
  const buffer = useRef('');
  const state = field.segmentState(type);
  const registerRef = useCallback(
    (node: HTMLSpanElement | null) => {
      field.register(node, element.current);
      element.current = node;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps -- register is stable
    [field.register],
  );
  const composedRef = useComposedRefs(ref, registerRef);
  const editable = !field.disabled && !field.readOnly;

  const typeDigit = (digit: string) => {
    const { min, max } = state;
    let next = buffer.current + digit;
    if (Number(next) > max) next = digit;
    const value = Number(next);
    if (value < min) {
      // "0" on a 12-hour clock: wait for the next digit.
      buffer.current = next.length >= 2 ? '' : next;
      return;
    }
    field.setSegment(type, value);
    if (next.length >= 2 || value * 10 > max) {
      buffer.current = '';
      field.focusSegment(element.current, 1);
    } else {
      buffer.current = next;
    }
  };

  const typePeriod = (event: ReactKeyboardEvent<HTMLSpanElement>) => {
    const key = event.key.toLocaleLowerCase();
    const match = (text: string, fallback: string) => key === text.charAt(0).toLocaleLowerCase() || key === fallback;
    const period = match(field.periodLabels.AM, 'a') ? 0 : match(field.periodLabels.PM, 'p') ? 1 : null;
    if (period === null) return;
    event.preventDefault();
    field.setSegment('dayPeriod', period);
    field.focusSegment(element.current, 1);
  };

  const erase = (backspace: boolean) => {
    if (state.value === null) {
      if (backspace) field.focusSegment(element.current, -1);
      return;
    }
    field.setSegment(type, null);
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLSpanElement>) => {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    const rtl = element.current ? getComputedStyle(element.current).direction === 'rtl' : false;
    const actions: Record<string, () => void> = {
      ArrowUp: () => editable && field.stepSegment(type, 1),
      ArrowDown: () => editable && field.stepSegment(type, -1),
      PageUp: () => editable && field.stepSegment(type, 1, true),
      PageDown: () => editable && field.stepSegment(type, -1, true),
      Home: () => editable && field.setSegmentToEnd(type, 'min'),
      End: () => editable && field.setSegmentToEnd(type, 'max'),
      ArrowLeft: () => field.focusSegment(element.current, rtl ? 1 : -1),
      ArrowRight: () => field.focusSegment(element.current, rtl ? -1 : 1),
      Backspace: () => editable && erase(true),
      Delete: () => editable && erase(false),
    };
    const action = actions[event.key];
    if (action) {
      event.preventDefault();
      buffer.current = '';
      action();
      return;
    }
    if (!editable || event.key.length !== 1) return;
    if (type === 'dayPeriod') typePeriod(event);
    else if (/\d/.test(event.key)) {
      event.preventDefault();
      typeDigit(event.key);
    }
  };

  return (
    <span
      role="spinbutton"
      tabIndex={field.disabled ? undefined : 0}
      aria-label={label ?? SEGMENT_LABELS[type]}
      aria-valuenow={state.value ?? undefined}
      aria-valuemin={state.min}
      aria-valuemax={state.max}
      aria-valuetext={state.valueText}
      aria-disabled={field.disabled || undefined}
      aria-readonly={field.readOnly || undefined}
      aria-invalid={ariaInvalid ?? (field.outOfRange || undefined)}
      data-type={type}
      data-placeholder={dataFlag(state.value === null)}
      {...props}
      ref={composedRef}
      onKeyDown={composeEventHandlers(onKeyDown, handleKeyDown)}
      onFocus={composeEventHandlers(onFocus, () => {
        buffer.current = '';
      })}
    >
      {state.text}
    </span>
  );
}

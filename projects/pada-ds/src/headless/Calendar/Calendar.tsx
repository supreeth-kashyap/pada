import {
  cloneElement,
  isValidElement,
  useCallback,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ComponentPropsWithRef,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from 'react';
import { createPartContext } from '../utils/context';
import { composeEventHandlers, dataFlag } from '../utils/events';
import { Slot } from '../utils/Slot';
import { useControllableState } from '../utils/useControllableState';
import {
  addDays,
  addMonths,
  clampDay,
  compareDays,
  getMonthGrid,
  isBetween,
  isSameDay,
  isSameMonth,
  startOfDay,
  startOfMonth,
  startOfWeek,
  type DateRangeValue,
} from './dates';

interface CalendarContextValue {
  mode: 'single' | 'range';
  /** Selected day (single), or the range's ends. */
  selected: Date | null;
  range: DateRangeValue | null;
  select: (date: Date) => void;
  month: Date;
  setMonth: (month: Date) => void;
  focused: Date;
  setFocused: (date: Date, options?: { moveFocus?: boolean }) => void;
  /** Day under the pointer (or keyboard focus) while a range is half chosen, for the preview. */
  preview: Date | null;
  setPreview: (date: Date | null) => void;
  isUnavailable: (date: Date) => boolean;
  min?: Date;
  max?: Date;
  weekStartsOn: number;
  locale?: string;
  disabled: boolean;
  readOnly: boolean;
  headingId: string;
  /** Months shown side by side (`numberOfMonths`). */
  monthCount: number;
  /** The day marked as today. */
  today: Date;
  /** Set by keyboard navigation so the newly focused day takes DOM focus after rendering. */
  shouldMoveFocus: React.RefObject<boolean>;
}

const [CalendarProvider, useCalendarContext] = createPartContext<CalendarContextValue>('Calendar.Root');

interface CalendarRootBaseProps extends Omit<ComponentPropsWithRef<'div'>, 'defaultValue' | 'onChange'> {
  /** Visible month (any day in it). Controlled. */
  month?: Date;
  /** Initially visible month when uncontrolled. Defaults to the selection, else today. */
  defaultMonth?: Date;
  /** Called when the visible month changes, with its first day. */
  onMonthChange?: (month: Date) => void;
  /** Earliest selectable day. */
  min?: Date;
  /** Latest selectable day. */
  max?: Date;
  /** Marks other days unavailable (weekends, holidays, booked dates). */
  isDateUnavailable?: (date: Date) => boolean;
  /** First day of the week: 0 = Sunday … 6 = Saturday. @default 0 */
  weekStartsOn?: number;
  /** Locale for month and day names. Defaults to the browser's. */
  locale?: string;
  /**
   * Months shown side by side. Render a `Calendar.Heading` and a `Calendar.Grid` per month with
   * `monthOffset` 0 … n-1; keyboard focus moves across them. @default 1
   */
  numberOfMonths?: number;
  /** The day marked as today. Defaults to the current date. */
  today?: Date;
  disabled?: boolean;
  readOnly?: boolean;
}

export interface CalendarSingleProps extends CalendarRootBaseProps {
  /** Pick one day. */
  mode?: 'single';
  value?: Date | null;
  defaultValue?: Date | null;
  onValueChange?: (value: Date | null) => void;
}

export interface CalendarRangeProps extends CalendarRootBaseProps {
  /** Pick a start and an end day. The first click sets the start, the second the end. */
  mode: 'range';
  /** `[start]` while the end is being picked, `[start, end]` once both are set. */
  value?: DateRangeValue | null;
  defaultValue?: DateRangeValue | null;
  onValueChange?: (value: DateRangeValue | null) => void;
}

export type CalendarRootProps = CalendarSingleProps | CalendarRangeProps;

/** A month calendar. WAI-ARIA APG: Date Picker Dialog (the grid part). */
export function CalendarRoot(props: CalendarRootProps) {
  return props.mode === 'range' ? <CalendarRange {...props} /> : <CalendarSingle {...props} />;
}

function CalendarSingle({ mode = 'single', value: valueProp, defaultValue = null, onValueChange, ...rest }: CalendarSingleProps) {
  const [value, setValue] = useControllableState<Date | null>({ prop: valueProp, defaultProp: defaultValue, onChange: onValueChange });
  return <CalendarImpl mode={mode} selected={value} range={null} onSelect={(date) => setValue(date)} anchor={value} rest={rest} />;
}

function CalendarRange({ mode, value: valueProp, defaultValue = null, onValueChange, ...rest }: CalendarRangeProps) {
  const [value, setValue] = useControllableState<DateRangeValue | null>({ prop: valueProp, defaultProp: defaultValue, onChange: onValueChange });
  const onSelect = (date: Date) => {
    const [start, end] = value ?? [];
    // A complete (or empty) range starts over; a half range gets its other end, in order.
    if (!start || end) setValue([date]);
    else setValue(compareDays(date, start) < 0 ? [date, start] : [start, date]);
  };
  return <CalendarImpl mode={mode} selected={null} range={value} onSelect={onSelect} anchor={value?.[0] ?? null} rest={rest} />;
}

function CalendarImpl({
  mode,
  selected,
  range,
  onSelect,
  anchor,
  rest: {
    month: monthProp,
    defaultMonth,
    onMonthChange,
    min,
    max,
    isDateUnavailable,
    weekStartsOn = 0,
    locale,
    numberOfMonths = 1,
    today: todayProp,
    disabled = false,
    readOnly = false,
    ...props
  },
}: {
  mode: 'single' | 'range';
  selected: Date | null;
  range: DateRangeValue | null;
  onSelect: (date: Date) => void;
  anchor: Date | null;
  rest: CalendarRootBaseProps;
}) {
  // The tab stop starts on the selection, else today (moved into the shown months below).
  const initial = clampDay(anchor ?? todayProp ?? new Date(), min, max);
  const [month, setMonthState] = useControllableState<Date>({
    prop: monthProp && startOfMonth(monthProp),
    defaultProp: startOfMonth(defaultMonth ?? initial),
    onChange: onMonthChange,
  });
  const [focused, setFocusedState] = useState<Date>(initial);
  const [preview, setPreview] = useState<Date | null>(null);
  const headingId = useId();
  const shouldMoveFocus = useRef(false);
  const monthCount = Math.max(1, Math.floor(numberOfMonths));
  const lastMonth = addMonths(month, monthCount - 1);
  const todayTime = startOfDay(todayProp ?? new Date()).getTime();
  const today = useMemo(() => new Date(todayTime), [todayTime]);

  const isUnavailable = useCallback(
    (date: Date) =>
      (!!min && compareDays(date, min) < 0) || (!!max && compareDays(date, max) > 0) || !!isDateUnavailable?.(date),
    [min, max, isDateUnavailable],
  );

  const setMonth = useCallback(
    (next: Date) => {
      const first = startOfMonth(next);
      if (!isSameMonth(first, month)) setMonthState(first);
    },
    [month, setMonthState],
  );

  const setFocused = useCallback(
    (date: Date, { moveFocus = false } = {}) => {
      const next = clampDay(date, min, max);
      shouldMoveFocus.current = moveFocus;
      setFocusedState(next);
      // With several months shown, the view only scrolls when the day is outside all of them.
      const first = startOfMonth(next);
      if (first < month) setMonth(first);
      else if (first > addMonths(month, monthCount - 1)) setMonth(addMonths(first, 1 - monthCount));
    },
    [min, max, month, monthCount, setMonth],
  );

  // Keep the focusable day inside the visible months (after Prev/Next, or a controlled month):
  // outside them it moves to the same day of the nearest shown month.
  const focusedMonth = startOfMonth(focused);
  const target = focusedMonth < month ? month : focusedMonth > lastMonth ? lastMonth : null;
  const monthsBetween = (from: Date, to: Date) => (to.getFullYear() - from.getFullYear()) * 12 + to.getMonth() - from.getMonth();
  const focusedInMonth = target ? clampDay(addMonths(focused, monthsBetween(focusedMonth, target)), min, max) : focused;

  const select = useCallback(
    (date: Date) => {
      if (disabled || readOnly || isUnavailable(date)) return;
      setFocused(date);
      setPreview(null);
      onSelect(startOfDay(date));
    },
    [disabled, readOnly, isUnavailable, setFocused, onSelect],
  );

  const context = useMemo(
    () => ({
      mode,
      selected,
      range,
      select,
      month,
      setMonth,
      focused: focusedInMonth,
      setFocused,
      preview,
      setPreview,
      isUnavailable,
      min,
      max,
      weekStartsOn,
      locale,
      disabled,
      readOnly,
      headingId,
      monthCount,
      today,
      shouldMoveFocus,
    }),
    [mode, selected, range, select, month, setMonth, focusedInMonth, setFocused, preview, isUnavailable, min, max, weekStartsOn, locale, disabled, readOnly, headingId, monthCount, today],
  );

  return (
    <CalendarProvider value={context}>
      <div data-disabled={dataFlag(disabled)} data-readonly={dataFlag(readOnly)} data-mode={mode} {...props} />
    </CalendarProvider>
  );
}

export interface CalendarHeadingProps extends ComponentPropsWithRef<'h2'> {
  /** Which shown month this heads, with `numberOfMonths` > 1: 0 is the first. @default 0 */
  monthOffset?: number;
  /**
   * Merge onto your own element (a button that opens a month picker) instead of an `<h2>`. The
   * element gets the month label as its content unless it has content of its own.
   */
  asChild?: boolean;
}

/** The visible month and year ("March 2026"). Labels the grid and is announced when it changes. */
export function CalendarHeading({ monthOffset = 0, asChild, children, ...props }: CalendarHeadingProps) {
  const context = useCalendarContext('Calendar.Heading');
  const label = new Intl.DateTimeFormat(context.locale, { month: 'long', year: 'numeric' }).format(addMonths(context.month, monthOffset));
  const id = headingIdAt(context.headingId, monthOffset);
  if (asChild && isValidElement<{ children?: ReactNode }>(children)) {
    return (
      <Slot id={id} aria-live="polite" {...props}>
        {cloneElement(children, undefined, children.props.children ?? label)}
      </Slot>
    );
  }
  return (
    <h2 id={id} aria-live="polite" {...props}>
      {children ?? label}
    </h2>
  );
}

/** Id of the heading of the month at `offset`, which labels that month's grid. */
const headingIdAt = (headingId: string, offset: number) => (offset ? `${headingId}-${offset}` : headingId);

export interface CalendarNavButtonProps extends ComponentPropsWithRef<'button'> {
  asChild?: boolean;
}

function CalendarNavButton({ direction, asChild, onClick, ...props }: CalendarNavButtonProps & { direction: 1 | -1 }) {
  const context = useCalendarContext(direction === 1 ? 'Calendar.NextButton' : 'Calendar.PrevButton');
  const target = addMonths(context.month, direction);
  // No month beyond the limits to show (with several months, the one coming into view at the end).
  const entering = direction === 1 ? addMonths(target, context.monthCount - 1) : target;
  const blocked =
    context.disabled ||
    (direction === -1 && !!context.min && compareDays(new Date(entering.getFullYear(), entering.getMonth() + 1, 0), context.min) < 0) ||
    (direction === 1 && !!context.max && compareDays(entering, context.max) > 0);
  const Component = asChild ? Slot : 'button';
  return (
    <Component
      type={asChild ? undefined : 'button'}
      aria-label={direction === 1 ? 'Next month' : 'Previous month'}
      disabled={blocked}
      data-disabled={dataFlag(blocked)}
      {...props}
      onClick={composeEventHandlers(onClick, () => {
        if (!blocked) context.setMonth(target);
      })}
    />
  );
}

/** Shows the previous month. */
export function CalendarPrevButton(props: CalendarNavButtonProps) {
  return <CalendarNavButton direction={-1} {...props} />;
}

/** Shows the next month. */
export function CalendarNextButton(props: CalendarNavButtonProps) {
  return <CalendarNavButton direction={1} {...props} />;
}

/** State of one day, for `renderDay` and the day's data attributes. */
export interface CalendarDayState {
  date: Date;
  selected: boolean;
  today: boolean;
  outsideMonth: boolean;
  unavailable: boolean;
  focused: boolean;
  rangeStart: boolean;
  rangeEnd: boolean;
  inRange: boolean;
}

export interface CalendarGridProps extends Omit<ComponentPropsWithRef<'table'>, 'children'> {
  /** Content of each day button. Defaults to the day of the month. */
  renderDay?: (state: CalendarDayState) => ReactNode;
  /** Hide days of the previous and next months instead of showing them muted. */
  hideOutsideDays?: boolean;
  /** Class name for each day button. */
  dayClassName?: string;
  /** Which shown month this grid renders, with `numberOfMonths` > 1: 0 is the first. @default 0 */
  monthOffset?: number;
}

/**
 * The month grid (`role="grid"`): arrow keys move by day and week, Home/End to the week's ends,
 * PageUp/PageDown by month (with Shift, by year), Enter or Space selects.
 */
export function CalendarGrid({ renderDay, hideOutsideDays, dayClassName, monthOffset = 0, onKeyDown, ...props }: CalendarGridProps) {
  const context = useCalendarContext('Calendar.Grid');
  const { focused, weekStartsOn, locale, mode, range, preview, today, monthCount } = context;
  const monthTime = addMonths(context.month, monthOffset).getTime();
  const month = useMemo(() => new Date(monthTime), [monthTime]);
  const weeks = useMemo(() => getMonthGrid(month, weekStartsOn), [month, weekStartsOn]);
  const gridRef = useRef<HTMLTableElement>(null);

  const weekdays = useMemo(() => {
    const short = new Intl.DateTimeFormat(locale, { weekday: 'short' });
    const long = new Intl.DateTimeFormat(locale, { weekday: 'long' });
    return weeks[0].map((date) => ({ short: short.format(date), long: long.format(date) }));
  }, [weeks, locale]);
  const dayLabel = useMemo(() => new Intl.DateTimeFormat(locale, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }), [locale]);

  // Keyboard navigation moves DOM focus to the newly focused day once it is rendered. With
  // several months shown, the grid that holds it takes focus.
  useLayoutEffect(() => {
    if (!context.shouldMoveFocus.current) return;
    const day = gridRef.current?.querySelector<HTMLElement>('[data-focused]');
    if (!day) return;
    context.shouldMoveFocus.current = false;
    day.focus({ preventScroll: true });
  });

  const [rangeStart, rangeEnd] = range ?? [];
  // While the end of a range is being chosen, preview it up to the hovered or focused day.
  const previewEnd = mode === 'range' && rangeStart && !rangeEnd ? preview : null;

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLTableElement>) => {
    const rtl = getComputedStyle(event.currentTarget).direction === 'rtl';
    const moves: Record<string, () => Date> = {
      ArrowLeft: () => addDays(focused, rtl ? 1 : -1),
      ArrowRight: () => addDays(focused, rtl ? -1 : 1),
      ArrowUp: () => addDays(focused, -7),
      ArrowDown: () => addDays(focused, 7),
      Home: () => startOfWeek(focused, weekStartsOn),
      End: () => addDays(startOfWeek(focused, weekStartsOn), 6),
      PageUp: () => addMonths(focused, event.shiftKey ? -12 : -1),
      PageDown: () => addMonths(focused, event.shiftKey ? 12 : 1),
    };
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      context.select(focused);
      return;
    }
    const move = moves[event.key];
    if (!move) return;
    event.preventDefault();
    const next = move();
    context.setFocused(next, { moveFocus: true });
    if (mode === 'range' && rangeStart && !rangeEnd) context.setPreview(next);
  };

  return (
    <table
      role="grid"
      aria-labelledby={headingIdAt(context.headingId, monthOffset)}
      aria-readonly={context.readOnly || undefined}
      aria-disabled={context.disabled || undefined}
      aria-multiselectable={mode === 'range' || undefined}
      {...props}
      ref={gridRef}
      onKeyDown={composeEventHandlers(onKeyDown, handleKeyDown)}
      onPointerLeave={() => context.setPreview(null)}
    >
      <thead>
        <tr>
          {weekdays.map((weekday) => (
            <th key={weekday.long} scope="col" abbr={weekday.long}>
              {weekday.short}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {weeks.map((week) => (
          <tr key={week[0].toISOString()}>
            {week.map((date) => {
              const outsideMonth = !isSameMonth(date, month);
              const unavailable = context.isUnavailable(date);
              const state: CalendarDayState = {
                date,
                selected:
                  mode === 'single'
                    ? isSameDay(date, context.selected)
                    : isSameDay(date, rangeStart) || isSameDay(date, rangeEnd),
                today: isSameDay(date, today),
                outsideMonth,
                unavailable,
                // With several months, a day shown muted in a neighbour's grid never takes the tab stop.
                focused: isSameDay(date, focused) && !(outsideMonth && monthCount > 1),
                rangeStart: false,
                rangeEnd: false,
                inRange: false,
              };
              if (mode === 'range' && rangeStart) {
                const otherEnd = rangeEnd ?? previewEnd ?? rangeStart;
                const [start, end] = compareDays(rangeStart, otherEnd) <= 0 ? [rangeStart, otherEnd] : [otherEnd, rangeStart];
                state.inRange = isBetween(date, start, end);
                state.rangeStart = isSameDay(date, start);
                state.rangeEnd = isSameDay(date, end);
              }
              if (outsideMonth && hideOutsideDays) return <td key={date.toISOString()} role="gridcell" />;
              return (
                <td key={date.toISOString()} role="gridcell" aria-selected={state.selected || (mode === 'range' && state.inRange && !!rangeEnd)}>
                  <button
                    type="button"
                    tabIndex={state.focused ? 0 : -1}
                    aria-label={dayLabel.format(date)}
                    aria-current={state.today ? 'date' : undefined}
                    aria-disabled={unavailable || context.disabled || undefined}
                    className={dayClassName}
                    data-selected={dataFlag(state.selected)}
                    data-today={dataFlag(state.today)}
                    data-outside-month={dataFlag(outsideMonth)}
                    data-unavailable={dataFlag(unavailable)}
                    data-focused={dataFlag(state.focused)}
                    // An overlay that opens with this calendar moves focus to this day.
                    data-autofocus={dataFlag(state.focused)}
                    data-in-range={dataFlag(state.inRange)}
                    data-range-start={dataFlag(state.rangeStart)}
                    data-range-end={dataFlag(state.rangeEnd)}
                    onClick={() => context.select(date)}
                    onFocus={() => !state.focused && context.setFocused(date)}
                    onPointerEnter={() => context.setPreview(date)}
                  >
                    {renderDay ? renderDay(state) : date.getDate()}
                  </button>
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

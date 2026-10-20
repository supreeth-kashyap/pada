import { useId, useMemo, useState } from 'react';
import type { DateRangeValue } from '../../headless/Calendar/dates';
import { PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from '../../headless/Popover/Popover';
import { VisuallyHidden } from '../../headless/utils/VisuallyHidden';
import { useControllableState } from '../../headless/utils/useControllableState';
import { Calendar } from '../Calendar';
import { Icon } from '../Icon';
import './DateRangePicker.css';

/** A complete range: both ends set. */
export type DateRange = [Date, Date];

/** A shortcut in the picker's side list ("Last 7 days"). */
export interface DateRangePreset {
  /** The button's text. */
  label: string;
  /** The range it picks. */
  range: DateRange;
}

export interface DateRangePickerProps {
  /** Visible label; the dialog is named "Choose {label}". */
  label?: string;
  /** Help text under the field, hidden while the error shows. */
  description?: string;
  /** Validation message. Setting it marks the field invalid. */
  error?: string;
  required?: boolean;
  /** Show "(optional)" after the label. */
  optional?: boolean;
  disabled?: boolean;
  /** Text shown while there is no value. @default 'Select dates' */
  placeholder?: string;
  /** The range, `[start, end]`, or null (controlled). */
  value?: DateRange | null;
  /** The initial range (uncontrolled). @default null */
  defaultValue?: DateRange | null;
  /** Called once both ends are picked (or a preset is), with the new range. */
  onValueChange?: (value: DateRange) => void;
  /** Earliest selectable day. */
  minDate?: Date;
  /** Latest selectable day. */
  maxDate?: Date;
  /** Marks other days unavailable (weekends, holidays, booked dates). */
  isDateUnavailable?: (date: Date) => boolean;
  /** First day of the week: 0 = Sunday … 6 = Saturday. @default 0 */
  weekStartsOn?: number;
  /** Locale for the shown range and the calendar. Defaults to the browser's. */
  locale?: string;
  /** The day marked as today. Defaults to the current date. */
  today?: Date;
  /** Months shown side by side. @default 2 */
  numberOfMonths?: number;
  /** Shortcuts listed beside the calendar. */
  presets?: readonly DateRangePreset[];
  /** Id of the field's button. Generated when omitted. */
  id?: string;
  className?: string;
}

const sameDay = (a: Date | undefined, b: Date | undefined) =>
  !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

/**
 * A date range field: a button showing the chosen range that opens a two-month range calendar
 * (and optional presets) in a popover dialog. The first click picks the start, the second the end;
 * the hovered or focused day previews the range in between. Picking the end (or a preset) closes
 * the dialog and returns focus to the field; Escape closes it and keeps the previous range.
 *
 * ```tsx
 * <DateRangePicker label="Stay" value={stay} onValueChange={setStay} minDate={today} />
 * <DateRangePicker label="Report period" presets={presets} weekStartsOn={1} />
 * ```
 *
 * The calendar keyboard is `Calendar`'s: arrow keys by day and week (crossing from one month's
 * grid into the other), Home/End to the week's ends, PageUp/PageDown by month (Shift: by year),
 * Enter or Space picks. Unlike `InputDate` with `selection="range"`, the value only changes once
 * both ends are picked: a half-picked range is a draft inside the dialog, dropped if it closes.
 */
export function DateRangePicker({
  label,
  description,
  error,
  required = false,
  optional = false,
  disabled = false,
  placeholder = 'Select dates',
  value: valueProp,
  defaultValue = null,
  onValueChange,
  minDate,
  maxDate,
  isDateUnavailable,
  weekStartsOn = 0,
  locale,
  today,
  numberOfMonths = 2,
  presets = [],
  id: idProp,
  className,
}: DateRangePickerProps) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const [value, setValue] = useControllableState<DateRange | null>({
    prop: valueProp === undefined ? undefined : valueProp?.[0] && valueProp[1] ? valueProp : null,
    defaultProp: defaultValue,
    onChange: (next) => next && onValueChange?.(next),
  });
  const [open, setOpenState] = useState(false);
  /** The range in the calendar while the dialog is open, `[start]` while the end is picked. */
  const [draft, setDraft] = useState<DateRangeValue | null>(null);

  const invalid = Boolean(error);
  const labelId = `${id}-label`;
  const valueId = `${id}-value`;
  const descriptionId = `${id}-description`;
  const errorId = `${id}-error`;
  const describedBy = invalid ? errorId : description ? descriptionId : undefined;
  const months = Array.from({ length: Math.max(1, Math.floor(numberOfMonths)) }, (_, index) => index);

  const display = useMemo(() => {
    if (!value?.[0] || !value[1]) return '';
    return new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric', year: 'numeric' }).formatRange(value[0], value[1]);
  }, [value, locale]);

  const setOpen = (next: boolean) => {
    const opening = next && !disabled;
    if (opening && !open) setDraft(value);
    setOpenState(opening);
  };

  const commit = (range: DateRange) => {
    setValue(range);
    setOpenState(false);
  };

  const pickRange = (range: DateRangeValue | null) => {
    setDraft(range);
    if (range?.[0] && range[1]) commit([range[0], range[1]]);
  };

  return (
    <div
      className={['date-range-picker', className].filter(Boolean).join(' ')}
      data-invalid={invalid ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
    >
      {label && (
        <label className="date-range-picker-label" id={labelId} htmlFor={id} data-disabled={disabled ? '' : undefined}>
          {label}
          {required && (
            <>
              <span className="date-range-picker-required" aria-hidden="true">
                *
              </span>
              <VisuallyHidden>(required)</VisuallyHidden>
            </>
          )}
          {optional && <span className="date-range-picker-optional">(optional)</span>}
        </label>
      )}
      <PopoverRoot open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          className="date-range-picker-field"
          id={id}
          disabled={disabled}
          aria-labelledby={label ? `${labelId} ${valueId}` : undefined}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          data-filled={display ? '' : undefined}
        >
          <span className="date-range-picker-value" id={valueId} data-placeholder={display ? undefined : ''}>
            {display || placeholder}
          </span>
          <Icon className="date-range-picker-icon" name="calendar_3" size={12} aria-hidden="true" />
        </PopoverTrigger>
        <PopoverPortal>
          <PopoverContent
            className="date-range-picker-popover"
            aria-label={label ? `Choose ${label}` : 'Choose dates'}
            side="bottom"
            align="start"
            sideOffset={4}
          >
            <div className="date-range-picker-panel">
              {presets.length > 0 && (
                <ul className="date-range-picker-presets" aria-label="Presets">
                  {presets.map((preset) => {
                    const selected = sameDay(value?.[0], preset.range[0]) && sameDay(value?.[1], preset.range[1]);
                    return (
                      <li key={preset.label}>
                        <button
                          type="button"
                          className="date-range-picker-preset"
                          aria-pressed={selected}
                          data-selected={selected ? '' : undefined}
                          onClick={() => commit(preset.range)}
                        >
                          {preset.label}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
              <Calendar.Root
                className="date-range-picker-calendar"
                mode="range"
                value={draft}
                onValueChange={pickRange}
                numberOfMonths={months.length}
                min={minDate}
                max={maxDate}
                isDateUnavailable={isDateUnavailable}
                weekStartsOn={weekStartsOn}
                locale={locale}
                today={today}
              >
                <div className="date-range-picker-months">
                  {months.map((offset) => (
                    <div className="date-range-picker-month" key={offset}>
                      <div className="date-range-picker-header">
                        {offset === 0 ? <Calendar.PrevButton /> : <span className="date-range-picker-nav-space" />}
                        <Calendar.Heading monthOffset={offset} />
                        {offset === months.length - 1 ? <Calendar.NextButton /> : <span className="date-range-picker-nav-space" />}
                      </div>
                      <Calendar.Grid monthOffset={offset} hideOutsideDays />
                    </div>
                  ))}
                </div>
              </Calendar.Root>
            </div>
          </PopoverContent>
        </PopoverPortal>
      </PopoverRoot>
      {invalid ? (
        <p className="date-range-picker-error" role="alert" id={errorId}>
          {error}
        </p>
      ) : (
        description && (
          <p className="date-range-picker-description" id={descriptionId}>
            {description}
          </p>
        )
      )}
    </div>
  );
}

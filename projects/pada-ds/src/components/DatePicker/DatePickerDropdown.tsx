import { useState, useEffect } from 'react';
import './DatePicker.css';
import { Icon } from '../Icon';
import { Calendar } from '../Calendar';
import type { CalendarRootProps } from '../../headless/Calendar/Calendar';
import { PickerBox } from './_PickerBox/PickerBox';
import type { DatePickerMode, DatePickerSelection } from './types';
import {
  MONTHS,
  getYears,
  navigateYear,
  navigateDecade,
  isMonthInRange,
  isMonthSelected,
  isYearInRange,
  isYearSelected,
} from './helper';

export interface DatePickerDropdownProps {
  mode?: DatePickerMode;
  selection?: DatePickerSelection;
  isRange?: boolean;
  value?: Date | [Date, Date?] | null;
  onChange?: (value: Date | [Date, Date?] | null) => void;
  minDate?: Date;
  maxDate?: Date;
  /** Marks other days unavailable (weekends, holidays, booked dates). */
  isDateUnavailable?: (date: Date) => boolean;
  /** First day of the week: 0 = Sunday … 6 = Saturday. @default 0 */
  weekStartsOn?: number;
  /** Locale for month and day names. */
  locale?: string;
}

/**
 * The date picker panel. Days are a keyboard-navigable `Calendar` grid (arrow keys, Home/End,
 * PageUp/PageDown); the month heading opens a month view, and the year a year view.
 */
export const DatePickerDropdown = ({
  mode = 'date',
  selection = 'single',
  isRange = false,
  value,
  onChange,
  minDate,
  maxDate,
  isDateUnavailable,
  weekStartsOn,
  locale,
}: DatePickerDropdownProps) => {
  const resolvedSelection: DatePickerSelection = isRange ? 'range' : selection;
  const resolvedValue: Date | [Date, Date?] | null = value ?? null;
  const [viewDate, setViewDate] = useState(value instanceof Date ? value : new Date());
  const [rangeStart, setRangeStart] = useState<Date | null>(
    Array.isArray(value) && value[0] ? value[0] : null
  );
  const [rangeEnd, setRangeEnd] = useState<Date | null>(
    Array.isArray(value) && value[1] ? value[1] : null
  );
  const [currentView, setCurrentView] = useState<'calendar' | 'month' | 'year'>(
    mode === 'date' ? 'calendar' : mode === 'month' ? 'month' : 'year'
  );
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);

  useEffect(() => {
    if (value instanceof Date) {
      setViewDate(value);
    } else if (Array.isArray(value) && value[0]) {
      setViewDate(value[0]);
      setRangeStart(value[0]);
      setRangeEnd(value[1] || null);
    } else if (value === null) {
      setRangeStart(null);
      setRangeEnd(null);
    }
  }, [value]);

  const handleMonthSelect = (month: number) => {
    const newDate = new Date(viewDate.getFullYear(), month, 1);
    if (mode === 'month') {
      if (resolvedSelection === 'range') {
        if (!rangeStart || (rangeStart && rangeEnd)) {
          setRangeStart(newDate);
          setRangeEnd(null);
          onChange?.([newDate]);
        } else {
          const start = rangeStart < newDate ? rangeStart : newDate;
          const end = rangeStart < newDate ? newDate : rangeStart;
          setRangeStart(start);
          setRangeEnd(end);
          onChange?.([start, end]);
        }
      } else {
        onChange?.(newDate);
      }
    } else {
      setViewDate(newDate);
      setCurrentView('calendar');
    }
  };

  const handleYearSelect = (year: number) => {
    const newDate = new Date(year, viewDate.getMonth(), 1);
    if (mode === 'year') {
      if (resolvedSelection === 'range') {
        if (!rangeStart || (rangeStart && rangeEnd)) {
          setRangeStart(newDate);
          setRangeEnd(null);
          onChange?.([newDate]);
        } else {
          const start = rangeStart < newDate ? rangeStart : newDate;
          const end = rangeStart < newDate ? newDate : rangeStart;
          setRangeStart(start);
          setRangeEnd(end);
          onChange?.([start, end]);
        }
      } else {
        onChange?.(newDate);
      }
    } else {
      setViewDate(newDate);
      setCurrentView(mode === 'month' ? 'month' : 'calendar');
    }
  };

  const handleNavigateYear = (direction: 'prev' | 'next') => {
    setViewDate(navigateYear(viewDate, direction));
  };

  const handleNavigateDecade = (direction: 'prev' | 'next') => {
    setViewDate(navigateDecade(viewDate, direction));
  };

  // Days: the Calendar grid owns keyboard navigation and the range preview. Its value is
  // controlled only when this picker's is.
  const calendarProps: CalendarRootProps =
    resolvedSelection === 'range'
      ? {
          mode: 'range',
          ...(value !== undefined && { value: Array.isArray(value) ? value : null }),
          onValueChange: (next) => {
            setRangeStart(next?.[0] ?? null);
            setRangeEnd(next?.[1] ?? null);
            onChange?.(next);
          },
        }
      : {
          mode: 'single',
          ...(value !== undefined && { value: value instanceof Date ? value : null }),
          onValueChange: (next) => onChange?.(next),
        };

  const renderCalendar = () => (
    <Calendar.Root
      {...calendarProps}
      month={viewDate}
      onMonthChange={setViewDate}
      min={minDate}
      max={maxDate}
      isDateUnavailable={isDateUnavailable}
      weekStartsOn={weekStartsOn}
      locale={locale}
      className="date_picker"
    >
      <div data-section="header">
        <Calendar.PrevButton className="date_picker_chevron" />
        <Calendar.Heading asChild>
          <button type="button" className="date_picker_view_select" onClick={() => setCurrentView('month')} />
        </Calendar.Heading>
        <Calendar.NextButton className="date_picker_chevron" />
      </div>
      <Calendar.Grid />
    </Calendar.Root>
  );

  const renderMonthPicker = () => {
    const today = new Date();
    return (
      <div className="date_picker">
        <div data-section="header">
          <button
            type="button"
            className="date_picker_chevron"
            onClick={() => handleNavigateYear('prev')}
            aria-label="Previous year"
          >
            <Icon name="chevron_left" size={12} color="var(--pada-color-neutral-600)" />
          </button>
          <button
            type="button"
            className="date_picker_view_select"
            onClick={() => setCurrentView('year')}
          >
            {viewDate.getFullYear()}
          </button>
          <button
            type="button"
            className="date_picker_chevron"
            onClick={() => handleNavigateYear('next')}
            aria-label="Next year"
          >
            <Icon name="chevron_right" size={12} color="var(--pada-color-neutral-600)" />
          </button>
        </div>
        <div data-grid="months">
          {MONTHS.map((month, index) => {
            const selected = isMonthSelected(
              index,
              viewDate.getFullYear(),
              resolvedSelection,
              resolvedValue,
              rangeStart,
              rangeEnd
            );
            let inRange = isMonthInRange(index, viewDate.getFullYear(), resolvedSelection, rangeStart, rangeEnd);
            const isToday =
              index === today.getMonth() &&
              viewDate.getFullYear() === today.getFullYear();
            
            // Show hover preview for range selection
            if (resolvedSelection === 'range' && rangeStart && !rangeEnd && hoveredMonth !== null) {
              const hoverStartMonth = new Date(viewDate.getFullYear(), rangeStart.getMonth(), 1);
              const hoverEndMonth = new Date(viewDate.getFullYear(), hoveredMonth, 1);
              const currentMonth = new Date(viewDate.getFullYear(), index, 1);
              const startMonth = hoverStartMonth < hoverEndMonth ? hoverStartMonth : hoverEndMonth;
              const endMonth = hoverStartMonth < hoverEndMonth ? hoverEndMonth : hoverStartMonth;
              
              if (currentMonth >= startMonth && currentMonth <= endMonth) {
                inRange = true;
              }
            }
            const visualState = selected ? 'active' : inRange ? 'hover' : 'rest';

            return (
              <PickerBox
                key={index}
                label={month.slice(0, 3)}
                isActive={selected}
                isToday={isToday}
                state={visualState}
                onClick={() => handleMonthSelect(index)}
                onMouseEnter={() =>
                  resolvedSelection === 'range' && rangeStart && !rangeEnd && setHoveredMonth(index)
                }
                onMouseLeave={() => setHoveredMonth(null)}
              />
            );
          })}
        </div>
      </div>
    );
  };

  const renderYearPicker = () => {
    const years = getYears(viewDate);
    const currentYear = new Date().getFullYear();
    
    return (
      <div className="date_picker">
        <div data-section="header">
          <button
            type="button"
            className="date_picker_chevron"
            onClick={() => handleNavigateDecade('prev')}
            aria-label="Previous decade"
          >
            <Icon name="chevron_left" size={12} color="var(--pada-color-neutral-600)" />
          </button>
          <div className="date_picker_view_select">
            {years[0]} - {years[years.length - 1]}
          </div>
          <button
            type="button"
            className="date_picker_chevron"
            onClick={() => handleNavigateDecade('next')}
            aria-label="Next decade"
          >
            <Icon name="chevron_right" size={12} color="var(--pada-color-neutral-600)" />
          </button>
        </div>
        <div data-grid="years">
          {years.map(year => {
            const selected = isYearSelected(year, resolvedSelection, resolvedValue, rangeStart, rangeEnd);
            let inRange = isYearInRange(year, resolvedSelection, rangeStart, rangeEnd);
            const isCurrent = year === currentYear;
            
            // Show hover preview for range selection
            if (resolvedSelection === 'range' && rangeStart && !rangeEnd && hoveredYear !== null) {
              const startYear = rangeStart.getFullYear();
              const hoverStart = startYear < hoveredYear ? startYear : hoveredYear;
              const hoverEnd = startYear < hoveredYear ? hoveredYear : startYear;
              
              if (year >= hoverStart && year <= hoverEnd) {
                inRange = true;
              }
            }
            const visualState = selected ? 'active' : inRange ? 'hover' : 'rest';

            return (
              <PickerBox
                key={year}
                label={year}
                isActive={selected}
                isToday={isCurrent}
                state={visualState}
                onClick={() => handleYearSelect(year)}
                onMouseEnter={() =>
                  resolvedSelection === 'range' && rangeStart && !rangeEnd && setHoveredYear(year)
                }
                onMouseLeave={() => setHoveredYear(null)}
              />
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div>
      {currentView === 'calendar' && renderCalendar()}
      {currentView === 'month' && renderMonthPicker()}
      {currentView === 'year' && renderYearPicker()}
    </div>
  );
};

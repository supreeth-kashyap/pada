import React, { useState, useEffect } from 'react';
import './DatePicker.css';
import { Icon } from '../Icon';
import { PickerBox } from './_PickerBox/PickerBox';
import type { DatePickerMode, DatePickerSelection } from './types';
import {
  MONTHS,
  DAYS_OF_WEEK,
  getDaysInMonth,
  getYears,
  navigateMonth,
  navigateYear,
  navigateDecade,
  isDateInRange,
  isDateSelected,
  isDateDisabled,
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
}

export const DatePickerDropdown = ({
  mode = 'date',
  selection = 'single',
  isRange = false,
  value,
  onChange,
  minDate,
  maxDate,
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
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
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

  const handleDateSelect = (date: Date) => {
    if (resolvedSelection === 'range') {
      if (!rangeStart || (rangeStart && rangeEnd)) {
        setRangeStart(date);
        setRangeEnd(null);
        onChange?.([date]);
      } else {
        const start = rangeStart < date ? rangeStart : date;
        const end = rangeStart < date ? date : rangeStart;
        setRangeStart(start);
        setRangeEnd(end);
        onChange?.([start, end]);
      }
    } else {
      onChange?.(date);
    }
  };

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

  const handleNavigateMonth = (direction: 'prev' | 'next') => {
    setViewDate(navigateMonth(viewDate, direction));
  };

  const handleNavigateYear = (direction: 'prev' | 'next') => {
    setViewDate(navigateYear(viewDate, direction));
  };

  const handleNavigateDecade = (direction: 'prev' | 'next') => {
    setViewDate(navigateDecade(viewDate, direction));
  };

  const renderCalendar = () => {
    const days = getDaysInMonth(viewDate);
    const currentMonth = viewDate.getMonth();
    const today = new Date();
    
    return (
      <div className="date_picker">
        <div data-section="header">
          <button
            type="button"
            className="date_picker_chevron"
            onClick={() => handleNavigateMonth('prev')}
            aria-label="Previous month"
          >
            <Icon name="chevron_left" size={12} color="var(--color-neutral-600)" />
          </button>
          <button
            type="button"
            className="date_picker_view_select"
            onClick={() => setCurrentView('month')}
          >
            {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
          </button>
          <button
            type="button"
            className="date_picker_chevron"
            onClick={() => handleNavigateMonth('next')}
            aria-label="Next month"
          >
            <Icon name="chevron_right" size={12} color="var(--color-neutral-600)" />
          </button>
        </div>
        <div className="date_picker_weekday_header">
          {DAYS_OF_WEEK.map(day => (
            <span key={day}>{day}</span>
          ))}
        </div>
        <div data-grid="days">
          {days.map((day, index) => {
            const isCurrentMonth = day.getMonth() === currentMonth;
            const selected = isDateSelected(day, resolvedSelection, resolvedValue, rangeStart, rangeEnd);
            let inRange = isDateInRange(day, resolvedSelection, rangeStart, rangeEnd);
            const disabled = isDateDisabled(day, minDate, maxDate);
            const isToday =
              day.getDate() === today.getDate() &&
              day.getMonth() === today.getMonth() &&
              day.getFullYear() === today.getFullYear();
            const visualState = selected ? 'active' : inRange ? 'hover' : 'rest';
            
            // Show hover preview for range selection
            if (resolvedSelection === 'range' && rangeStart && !rangeEnd && hoveredDate) {
              const hoverStart = rangeStart < hoveredDate ? rangeStart : hoveredDate;
              const hoverEnd = rangeStart < hoveredDate ? hoveredDate : rangeStart;
              const dayTime = day.getTime();
              if (dayTime >= hoverStart.getTime() && dayTime <= hoverEnd.getTime()) {
                inRange = true;
              }
            }
            
            return (
              <PickerBox
                key={index}
                label={day.getDate()}
                isActive={selected}
                isToday={isToday}
                isMuted={!isCurrentMonth}
                disabled={disabled}
                state={visualState}
                onClick={() => !disabled && handleDateSelect(day)}
                onMouseEnter={() =>
                  !disabled && resolvedSelection === 'range' && rangeStart && !rangeEnd && setHoveredDate(day)
                }
                onMouseLeave={() => setHoveredDate(null)}
              />
            );
          })}
        </div>
      </div>
    );
  };

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
            <Icon name="chevron_left" size={12} color="var(--color-neutral-600)" />
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
            <Icon name="chevron_right" size={12} color="var(--color-neutral-600)" />
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
            const visualState = selected ? 'active' : inRange ? 'hover' : 'rest';
            
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
            <Icon name="chevron_left" size={12} color="var(--color-neutral-600)" />
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
            <Icon name="chevron_right" size={12} color="var(--color-neutral-600)" />
          </button>
        </div>
        <div data-grid="years">
          {years.map(year => {
            const selected = isYearSelected(year, resolvedSelection, resolvedValue, rangeStart, rangeEnd);
            let inRange = isYearInRange(year, resolvedSelection, rangeStart, rangeEnd);
            const isCurrent = year === currentYear;
            const visualState = selected ? 'active' : inRange ? 'hover' : 'rest';
            
            // Show hover preview for range selection
            if (resolvedSelection === 'range' && rangeStart && !rangeEnd && hoveredYear !== null) {
              const startYear = rangeStart.getFullYear();
              const hoverStart = startYear < hoveredYear ? startYear : hoveredYear;
              const hoverEnd = startYear < hoveredYear ? hoveredYear : startYear;
              
              if (year >= hoverStart && year <= hoverEnd) {
                inRange = true;
              }
            }
            
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

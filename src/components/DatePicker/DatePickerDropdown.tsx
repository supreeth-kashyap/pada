import React, { useState, useEffect } from 'react';
import './DatePicker.css';
import { Icon } from '../Icon';
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
  value?: Date | [Date, Date?] | null;
  onChange?: (value: Date | [Date, Date?] | null) => void;
  minDate?: Date;
  maxDate?: Date;
}

export const DatePickerDropdown = ({
  mode = 'date',
  selection = 'single',
  value,
  onChange,
  minDate,
  maxDate,
}: DatePickerDropdownProps) => {
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
    if (selection === 'range') {
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
      if (selection === 'range') {
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
      if (selection === 'range') {
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
    
    return (
      <div className="date-picker__calendar">
        <div className="date-picker__header">
          <button
            type="button"
            className="date-picker__nav-button"
            onClick={() => handleNavigateMonth('prev')}
            aria-label="Previous month"
          >
            <Icon name="chevron_left" size="xs" color="Icy" />
          </button>
          <button
            type="button"
            className="date-picker__month-year"
            onClick={() => setCurrentView('month')}
          >
            {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
          </button>
          <button
            type="button"
            className="date-picker__nav-button"
            onClick={() => handleNavigateMonth('next')}
            aria-label="Next month"
          >
            <Icon name="chevron_right" size="xs" color="Icy" />
          </button>
        </div>
        <div className="date-picker__weekdays">
          {DAYS_OF_WEEK.map(day => (
            <div key={day} className="date-picker__weekday">{day}</div>
          ))}
        </div>
        <div className="date-picker__days">
          {days.map((day, index) => {
            const isCurrentMonth = day.getMonth() === currentMonth;
            const selected = isDateSelected(day, selection, value, rangeStart, rangeEnd);
            let inRange = isDateInRange(day, selection, rangeStart, rangeEnd);
            const disabled = isDateDisabled(day, minDate, maxDate);
            let isRangeStart = rangeStart && day.getTime() === rangeStart.getTime();
            let isRangeEnd = rangeEnd && day.getTime() === rangeEnd.getTime();
            
            // Show hover preview for range selection
            if (selection === 'range' && rangeStart && !rangeEnd && hoveredDate) {
              const hoverStart = rangeStart < hoveredDate ? rangeStart : hoveredDate;
              const hoverEnd = rangeStart < hoveredDate ? hoveredDate : rangeStart;
              const dayTime = day.getTime();
              if (dayTime >= hoverStart.getTime() && dayTime <= hoverEnd.getTime()) {
                inRange = true;
                if (dayTime === hoverStart.getTime()) isRangeStart = true;
                if (dayTime === hoverEnd.getTime()) isRangeEnd = true;
              }
            }
            
            return (
              <button
                key={index}
                type="button"
                className={`
                  date-picker__day
                  ${!isCurrentMonth ? 'date-picker__day--other-month' : ''}
                  ${selected ? 'date-picker__day--selected' : ''}
                  ${inRange ? 'date-picker__day--in-range' : ''}
                  ${isRangeStart ? 'date-picker__day--range-start' : ''}
                  ${isRangeEnd ? 'date-picker__day--range-end' : ''}
                  ${disabled ? 'date-picker__day--disabled' : ''}
                `.trim()}
                onClick={() => !disabled && handleDateSelect(day)}
                onMouseEnter={() => !disabled && selection === 'range' && rangeStart && !rangeEnd && setHoveredDate(day)}
                onMouseLeave={() => setHoveredDate(null)}
                disabled={disabled}
              >
                {day.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderMonthPicker = () => {
    return (
      <div className="date-picker__month-picker">
        <div className="date-picker__header">
          <button
            type="button"
            className="date-picker__nav-button"
            onClick={() => handleNavigateYear('prev')}
            aria-label="Previous year"
          >
            <Icon name="chevron_left" size="xs" color="Icy" />
          </button>
          <button
            type="button"
            className="date-picker__month-year"
            onClick={() => setCurrentView('year')}
          >
            {viewDate.getFullYear()}
          </button>
          <button
            type="button"
            className="date-picker__nav-button"
            onClick={() => handleNavigateYear('next')}
            aria-label="Next year"
          >
            <Icon name="chevron_right" size="xs" color="Icy" />
          </button>
        </div>
        <div className="date-picker__months">
          {MONTHS.map((month, index) => {
            const selected = isMonthSelected(index, viewDate.getFullYear(), selection, value, rangeStart, rangeEnd);
            let inRange = isMonthInRange(index, viewDate.getFullYear(), selection, rangeStart, rangeEnd);
            let isRangeStart = rangeStart && rangeStart.getMonth() === index && rangeStart.getFullYear() === viewDate.getFullYear();
            let isRangeEnd = rangeEnd && rangeEnd.getMonth() === index && rangeEnd.getFullYear() === viewDate.getFullYear();
            
            // Show hover preview for range selection
            if (selection === 'range' && rangeStart && !rangeEnd && hoveredMonth !== null) {
              const hoverStartMonth = new Date(viewDate.getFullYear(), rangeStart.getMonth(), 1);
              const hoverEndMonth = new Date(viewDate.getFullYear(), hoveredMonth, 1);
              const currentMonth = new Date(viewDate.getFullYear(), index, 1);
              const startMonth = hoverStartMonth < hoverEndMonth ? hoverStartMonth : hoverEndMonth;
              const endMonth = hoverStartMonth < hoverEndMonth ? hoverEndMonth : hoverStartMonth;
              
              if (currentMonth >= startMonth && currentMonth <= endMonth) {
                inRange = true;
                if (currentMonth.getTime() === startMonth.getTime()) isRangeStart = true;
                if (currentMonth.getTime() === endMonth.getTime()) isRangeEnd = true;
              }
            }
            
            return (
              <button
                key={index}
                type="button"
                className={`
                  date-picker__month
                  ${selected ? 'date-picker__month--selected' : ''}
                  ${inRange ? 'date-picker__month--in-range' : ''}
                  ${isRangeStart ? 'date-picker__month--range-start' : ''}
                  ${isRangeEnd ? 'date-picker__month--range-end' : ''}
                `.trim()}
                onClick={() => handleMonthSelect(index)}
                onMouseEnter={() => selection === 'range' && rangeStart && !rangeEnd && setHoveredMonth(index)}
                onMouseLeave={() => setHoveredMonth(null)}
              >
                {month.slice(0, 3)}
              </button>
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
      <div className="date-picker__year-picker">
        <div className="date-picker__header">
          <button
            type="button"
            className="date-picker__nav-button"
            onClick={() => handleNavigateDecade('prev')}
            aria-label="Previous decade"
          >
            <Icon name="chevron_left" size="xs" color="Icy" />
          </button>
          <div className="date-picker__month-year">
            {years[0]} - {years[years.length - 1]}
          </div>
          <button
            type="button"
            className="date-picker__nav-button"
            onClick={() => handleNavigateDecade('next')}
            aria-label="Next decade"
          >
            <Icon name="chevron_right" size="xs" color="Icy" />
          </button>
        </div>
        <div className="date-picker__years">
          {years.map(year => {
            const selected = isYearSelected(year, selection, value, rangeStart, rangeEnd);
            let inRange = isYearInRange(year, selection, rangeStart, rangeEnd);
            const isCurrent = year === currentYear;
            let isRangeStart = rangeStart && rangeStart.getFullYear() === year;
            let isRangeEnd = rangeEnd && rangeEnd.getFullYear() === year;
            
            // Show hover preview for range selection
            if (selection === 'range' && rangeStart && !rangeEnd && hoveredYear !== null) {
              const startYear = rangeStart.getFullYear();
              const hoverStart = startYear < hoveredYear ? startYear : hoveredYear;
              const hoverEnd = startYear < hoveredYear ? hoveredYear : startYear;
              
              if (year >= hoverStart && year <= hoverEnd) {
                inRange = true;
                if (year === hoverStart) isRangeStart = true;
                if (year === hoverEnd) isRangeEnd = true;
              }
            }
            
            return (
              <button
                key={year}
                type="button"
                className={`
                  date-picker__year
                  ${selected ? 'date-picker__year--selected' : ''}
                  ${inRange ? 'date-picker__year--in-range' : ''}
                  ${isRangeStart ? 'date-picker__year--range-start' : ''}
                  ${isRangeEnd ? 'date-picker__year--range-end' : ''}
                  ${isCurrent ? 'date-picker__year--current' : ''}
                `.trim()}
                onClick={() => handleYearSelect(year)}
                onMouseEnter={() => selection === 'range' && rangeStart && !rangeEnd && setHoveredYear(year)}
                onMouseLeave={() => setHoveredYear(null)}
              >
                {year}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="date-picker__dropdown-content">
      {currentView === 'calendar' && renderCalendar()}
      {currentView === 'month' && renderMonthPicker()}
      {currentView === 'year' && renderYearPicker()}
    </div>
  );
};

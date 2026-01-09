import type { DatePickerSelection } from './types';

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const getDaysInMonth = (date: Date): Date[] => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days: Date[] = [];
  
  const startPadding = firstDay.getDay();
  for (let i = 0; i < startPadding; i++) {
    days.push(new Date(year, month, -startPadding + i + 1));
  }
  
  for (let day = 1; day <= lastDay.getDate(); day++) {
    days.push(new Date(year, month, day));
  }
  
  const endPadding = 42 - days.length;
  for (let day = 1; day <= endPadding; day++) {
    days.push(new Date(year, month + 1, day));
  }
  
  return days;
};

export const getYears = (viewDate: Date): number[] => {
  const currentYear = viewDate.getFullYear();
  const startYear = Math.floor(currentYear / 12) * 12;
  return Array.from({ length: 12 }, (_, i) => startYear + i);
};

export const navigateMonth = (viewDate: Date, direction: 'prev' | 'next'): Date => {
  return new Date(viewDate.getFullYear(), viewDate.getMonth() + (direction === 'next' ? 1 : -1), 1);
};

export const navigateYear = (viewDate: Date, direction: 'prev' | 'next'): Date => {
  return new Date(viewDate.getFullYear() + (direction === 'next' ? 1 : -1), viewDate.getMonth(), 1);
};

export const navigateDecade = (viewDate: Date, direction: 'prev' | 'next'): Date => {
  return new Date(viewDate.getFullYear() + (direction === 'next' ? 12 : -12), viewDate.getMonth(), 1);
};

export const isDateInRange = (
  date: Date,
  selection: DatePickerSelection,
  rangeStart: Date | null,
  rangeEnd: Date | null
): boolean => {
  if (selection !== 'range' || !rangeStart) return false;
  if (!rangeEnd) return date.getTime() === rangeStart.getTime();
  const time = date.getTime();
  return time >= rangeStart.getTime() && time <= rangeEnd.getTime();
};

export const isDateSelected = (
  date: Date,
  selection: DatePickerSelection,
  value: Date | [Date, Date?] | null,
  rangeStart: Date | null,
  rangeEnd: Date | null
): boolean => {
  if (selection === 'range') {
    if (rangeStart && date.getTime() === rangeStart.getTime()) return true;
    if (rangeEnd && date.getTime() === rangeEnd.getTime()) return true;
    return false;
  }
  if (value instanceof Date) {
    return date.toDateString() === value.toDateString();
  }
  return false;
};

export const isDateDisabled = (date: Date, minDate?: Date, maxDate?: Date): boolean => {
  if (minDate && date < minDate) return true;
  if (maxDate && date > maxDate) return true;
  return false;
};

export const isMonthInRange = (
  month: number,
  year: number,
  selection: DatePickerSelection,
  rangeStart: Date | null,
  rangeEnd: Date | null
): boolean => {
  if (selection !== 'range' || !rangeStart) return false;
  if (!rangeEnd) {
    return rangeStart.getMonth() === month && rangeStart.getFullYear() === year;
  }
  const monthDate = new Date(year, month, 1);
  const startDate = new Date(rangeStart.getFullYear(), rangeStart.getMonth(), 1);
  const endDate = new Date(rangeEnd.getFullYear(), rangeEnd.getMonth(), 1);
  return monthDate >= startDate && monthDate <= endDate;
};

export const isMonthSelected = (
  month: number,
  year: number,
  selection: DatePickerSelection,
  value: Date | [Date, Date?] | null,
  rangeStart: Date | null,
  rangeEnd: Date | null
): boolean => {
  if (selection === 'range') {
    if (rangeStart && rangeStart.getMonth() === month && rangeStart.getFullYear() === year) return true;
    if (rangeEnd && rangeEnd.getMonth() === month && rangeEnd.getFullYear() === year) return true;
    return false;
  }
  if (value instanceof Date) {
    return value.getMonth() === month && value.getFullYear() === year;
  }
  return false;
};

export const isYearInRange = (
  year: number,
  selection: DatePickerSelection,
  rangeStart: Date | null,
  rangeEnd: Date | null
): boolean => {
  if (selection !== 'range' || !rangeStart) return false;
  if (!rangeEnd) {
    return rangeStart.getFullYear() === year;
  }
  return year >= rangeStart.getFullYear() && year <= rangeEnd.getFullYear();
};

export const isYearSelected = (
  year: number,
  selection: DatePickerSelection,
  value: Date | [Date, Date?] | null,
  rangeStart: Date | null,
  rangeEnd: Date | null
): boolean => {
  if (selection === 'range') {
    if (rangeStart && rangeStart.getFullYear() === year) return true;
    if (rangeEnd && rangeEnd.getFullYear() === year) return true;
    return false;
  }
  if (value instanceof Date) {
    return value.getFullYear() === year;
  }
  return false;
};

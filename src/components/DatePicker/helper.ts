import type { DatePickerSelection } from './types';

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const getYears = (viewDate: Date): number[] => {
  const currentYear = viewDate.getFullYear();
  const startYear = Math.floor(currentYear / 12) * 12;
  return Array.from({ length: 12 }, (_, i) => startYear + i);
};

export const navigateYear = (viewDate: Date, direction: 'prev' | 'next'): Date => {
  return new Date(viewDate.getFullYear() + (direction === 'next' ? 1 : -1), viewDate.getMonth(), 1);
};

export const navigateDecade = (viewDate: Date, direction: 'prev' | 'next'): Date => {
  return new Date(viewDate.getFullYear() + (direction === 'next' ? 12 : -12), viewDate.getMonth(), 1);
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

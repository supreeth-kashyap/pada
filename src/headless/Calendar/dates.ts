// Calendar date math on local dates (midnight), no dependencies.

export type DateRangeValue = [Date, Date?];

export const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const startOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);

export const isSameDay = (a: Date | null | undefined, b: Date | null | undefined) =>
  !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

export const isSameMonth = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();

export const addDays = (date: Date, days: number) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);

/** Adds months, keeping the day where possible (Jan 31 + 1 month = Feb 28/29). */
export const addMonths = (date: Date, months: number) => {
  const target = new Date(date.getFullYear(), date.getMonth() + months, 1);
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  return new Date(target.getFullYear(), target.getMonth(), Math.min(date.getDate(), lastDay));
};

export const compareDays = (a: Date, b: Date) => startOfDay(a).getTime() - startOfDay(b).getTime();

export const clampDay = (date: Date, min?: Date, max?: Date) => {
  if (min && compareDays(date, min) < 0) return startOfDay(min);
  if (max && compareDays(date, max) > 0) return startOfDay(max);
  return startOfDay(date);
};

export const startOfWeek = (date: Date, weekStartsOn: number) => addDays(date, -((date.getDay() - weekStartsOn + 7) % 7));

/** Six weeks of days covering `month`, starting on `weekStartsOn` (0 = Sunday). */
export function getMonthGrid(month: Date, weekStartsOn = 0): Date[][] {
  const first = startOfWeek(startOfMonth(month), weekStartsOn);
  return Array.from({ length: 6 }, (_, week) => Array.from({ length: 7 }, (_, day) => addDays(first, week * 7 + day)));
}

/** True when `date` lies between the two ends of a range, in either order, inclusive. */
export const isBetween = (date: Date, a: Date, b: Date) => {
  const [start, end] = compareDays(a, b) <= 0 ? [a, b] : [b, a];
  return compareDays(date, start) >= 0 && compareDays(date, end) <= 0;
};

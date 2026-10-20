import { CalendarGrid, CalendarHeading, CalendarNextButton, CalendarPrevButton, CalendarRoot } from './Calendar';

export * from './Calendar';
export type { DateRangeValue } from './dates';

/**
 * Headless month calendar (the grid of the WAI-ARIA APG date picker), single day or range.
 *
 * ```tsx
 * <Calendar.Root mode="range" min={new Date()}>
 *   <Calendar.PrevButton>‹</Calendar.PrevButton>
 *   <Calendar.Heading />
 *   <Calendar.NextButton>›</Calendar.NextButton>
 *   <Calendar.Grid />
 * </Calendar.Root>
 * ```
 */
export const Calendar = {
  Root: CalendarRoot,
  Heading: CalendarHeading,
  PrevButton: CalendarPrevButton,
  NextButton: CalendarNextButton,
  Grid: CalendarGrid,
};

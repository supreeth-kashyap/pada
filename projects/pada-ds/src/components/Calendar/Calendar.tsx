import {
  CalendarGrid as HeadlessGrid,
  CalendarHeading as HeadlessHeading,
  CalendarNextButton as HeadlessNext,
  CalendarPrevButton as HeadlessPrev,
  CalendarRoot as HeadlessRoot,
  type CalendarGridProps,
  type CalendarHeadingProps,
  type CalendarNavButtonProps,
  type CalendarRootProps,
} from '../../headless/Calendar/Calendar';
import { Icon } from '../Icon';
import './Calendar.css';

const cx = (...names: (string | undefined | false)[]) => names.filter(Boolean).join(' ');

/** Holds the selection, the visible month and the limits. */
function CalendarRoot({ className, ...props }: CalendarRootProps) {
  return <HeadlessRoot {...props} className={cx('calendar', className)} />;
}

/** The month and year. */
function CalendarHeading({ className, ...props }: CalendarHeadingProps) {
  return <HeadlessHeading {...props} className={cx('calendar-heading', className)} />;
}

/** Previous-month button with a chevron. */
function CalendarPrevButton({ className, children, ...props }: CalendarNavButtonProps) {
  return (
    <HeadlessPrev {...props} className={cx('calendar-nav', className)}>
      {children ?? <Icon name="chevron_left" size={12} />}
    </HeadlessPrev>
  );
}

/** Next-month button with a chevron. */
function CalendarNextButton({ className, children, ...props }: CalendarNavButtonProps) {
  return (
    <HeadlessNext {...props} className={cx('calendar-nav', className)}>
      {children ?? <Icon name="chevron_right" size={12} />}
    </HeadlessNext>
  );
}

/** The day grid. */
function CalendarGrid({ className, dayClassName, ...props }: CalendarGridProps) {
  return <HeadlessGrid {...props} className={cx('calendar-grid', className)} dayClassName={cx('calendar-day', dayClassName)} />;
}

export type CalendarProps = CalendarRootProps;

/**
 * A month calendar for picking a day or a range (WAI-ARIA APG date grid). Arrow keys move by
 * day and week, Home/End to the week's ends, PageUp/PageDown by month (Shift: by year).
 *
 * Compose your own header with `Calendar.Root`, `Calendar.PrevButton`, `Calendar.Heading`,
 * `Calendar.NextButton` and `Calendar.Grid`.
 */
export function Calendar({ children, ...props }: CalendarProps) {
  return (
    <CalendarRoot {...props}>
      {children ?? (
        <>
          <div className="calendar-header">
            <CalendarPrevButton />
            <CalendarHeading />
            <CalendarNextButton />
          </div>
          <CalendarGrid />
        </>
      )}
    </CalendarRoot>
  );
}

Calendar.Root = CalendarRoot;
Calendar.Heading = CalendarHeading;
Calendar.PrevButton = CalendarPrevButton;
Calendar.NextButton = CalendarNextButton;
Calendar.Grid = CalendarGrid;

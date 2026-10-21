import type { ComponentPropsWithRef, CSSProperties, ReactNode } from 'react';
import { Children, isValidElement } from 'react';
import { Icon } from '../Icon';
import './Timeline.css';

const cx = (...names: (string | undefined | false)[]) => names.filter(Boolean).join(' ');

export type TimelineTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger';

export interface TimelineItemProps extends Omit<ComponentPropsWithRef<'li'>, 'title'> {
  title: ReactNode;
  /** When it happened: a Date (rendered in a `<time>`) or any text. */
  time?: Date | ReactNode;
  /** Built-in icon name inside the marker; a dot when omitted. */
  icon?: string;
  /** Marker colour. @default 'neutral' */
  tone?: TimelineTone;
  /** `pending` events (still to come) get a hollow marker and a dashed connector. */
  pending?: boolean;
  /** Details under the title. */
  children?: ReactNode;
}

const formatTime = (time: Date) =>
  new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(time);

/** One event: a marker on the line, then its title, time and details. */
export function TimelineItem({ title, time, icon, tone = 'neutral', pending, className, children, ...props }: TimelineItemProps) {
  return (
    <li className={cx('timeline-item', className)} data-tone={tone} data-pending={pending ? '' : undefined} {...props}>
      <span className="timeline-marker" aria-hidden="true">
        {icon ? <Icon name={icon} size={12} /> : <span className="timeline-dot" />}
      </span>
      <div className="timeline-content">
        <div className="timeline-header">
          <span className="timeline-title">{title}</span>
          {time !== undefined &&
            (time instanceof Date ? (
              <time className="timeline-time" dateTime={time.toISOString()}>
                {formatTime(time)}
              </time>
            ) : (
              <span className="timeline-time">{time}</span>
            ))}
        </div>
        {children && <div className="timeline-description">{children}</div>}
      </div>
    </li>
  );
}

export interface TimelineEvent extends Omit<TimelineItemProps, 'children'> {
  id?: string;
  description?: ReactNode;
}

export interface TimelineProps extends Omit<ComponentPropsWithRef<'ol'>, 'children'> {
  /** The events, oldest first (or newest first: the order is yours). */
  items?: TimelineEvent[];
  /** `Timeline.Item`s, instead of `items`. */
  children?: ReactNode;
  /** Gap between events. */
  density?: 'compact' | 'comfortable';
}

/**
 * An ordered list of events (activity feeds, audit logs, order tracking) joined by a line.
 * Events appear one after another on mount; pending events are drawn hollow and dashed.
 */
export function Timeline({ items, children, density = 'comfortable', className, ...props }: TimelineProps) {
  const entries = items
    ? items.map(({ id, description, ...item }, index) => (
        <TimelineItem key={id ?? index} {...item} style={{ '--pada-timeline-index': index } as CSSProperties}>
          {description}
        </TimelineItem>
      ))
    : Children.map(children, (child, index) =>
        isValidElement<TimelineItemProps>(child) && child.type === TimelineItem ? (
          <TimelineItem {...child.props} style={{ '--pada-timeline-index': index, ...child.props.style } as CSSProperties} />
        ) : (
          child
        ),
      );
  return (
    <ol className={cx('timeline', className)} data-density={density} {...props}>
      {entries}
    </ol>
  );
}

Timeline.Item = TimelineItem;

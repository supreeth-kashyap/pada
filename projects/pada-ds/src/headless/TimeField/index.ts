import { TimeFieldRoot, TimeFieldSegment } from './TimeField';

export * from './TimeField';
export { formatTime, isTimeOutOfRange, parseTime, stepValue, timeToSeconds } from './time';

/**
 * Headless time-of-day field in spinbutton segments, ordered and labelled by the locale.
 *
 * ```tsx
 * <TimeField.Root aria-label="Start time" value={start} onValueChange={setStart}>
 *   {(layout) =>
 *     layout.map((part, index) =>
 *       part.type === 'literal'
 *         ? <span key={index} aria-hidden="true">{part.text}</span>
 *         : <TimeField.Segment key={index} type={part.type} />,
 *     )
 *   }
 * </TimeField.Root>
 * ```
 */
export const TimeField = {
  Root: TimeFieldRoot,
  Segment: TimeFieldSegment,
};

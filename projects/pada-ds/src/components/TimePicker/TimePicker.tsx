import { useId, type ComponentPropsWithRef } from 'react';
import { TimeFieldRoot, TimeFieldSegment, type HourCycle, type TimeGranularity } from '../../headless/TimeField/TimeField';
import { isTimeOutOfRange } from '../../headless/TimeField/time';
import { VisuallyHidden } from '../../headless/utils/VisuallyHidden';
import { Icon } from '../Icon';
import './TimePicker.css';

export interface TimePickerProps extends Omit<ComponentPropsWithRef<'div'>, 'defaultValue' | 'onChange' | 'children'> {
  /** Visible label naming the group of segments. */
  label?: string;
  /** Help text under the field, hidden while the error shows. */
  description?: string;
  /** Validation message. Setting it marks the field invalid. */
  error?: string;
  /** The time, `"HH:mm"` or `"HH:mm:ss"` (24-hour), or null (controlled). */
  value?: string | null;
  /** The initial time (uncontrolled). @default null */
  defaultValue?: string | null;
  /** Called with the new time, or null while a segment is empty. */
  onValueChange?: (value: string | null) => void;
  /** Smallest unit entered. @default 'minute' */
  granularity?: TimeGranularity;
  /** 12- or 24-hour clock. Follows the locale when unset. */
  hourCycle?: HourCycle;
  /** Locale for the segment order, clock and AM/PM names. Defaults to the browser's. */
  locale?: string;
  /** Minutes the arrow keys step by. @default 1 */
  minuteStep?: number;
  /** Earliest valid time (`"HH:mm"`). */
  min?: string;
  /** Latest valid time (`"HH:mm"`). */
  max?: string;
  required?: boolean;
  /** Show "(optional)" after the label. */
  optional?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  /** Submits the value with a native form under this name. */
  name?: string;
}

/**
 * A labelled time-of-day field in segments: hours, minutes (and seconds), and AM/PM on a 12-hour
 * clock, in the locale's order. Each segment is a spinbutton: ArrowUp/ArrowDown step it,
 * PageUp/PageDown by a larger step, Home/End to its ends, digits type into it, A/P set AM/PM,
 * Backspace empties it, ArrowLeft/ArrowRight (or Tab) move between segments. The value is a
 * 24-hour `"HH:mm"` (or `"HH:mm:ss"`) string, null until every segment is filled.
 *
 * ```tsx
 * <TimePicker label="Start time" value={start} onValueChange={setStart} minuteStep={15} />
 * <TimePicker label="Alarm" granularity="second" hourCycle={24} name="alarm" />
 * ```
 *
 * Setting `error` marks the field invalid; so does a value outside `min`/`max`. There is no
 * dropdown of times: the segments are the whole control. Built on the headless `TimeField`.
 */
export function TimePicker({
  label,
  description,
  error,
  value,
  defaultValue,
  onValueChange,
  granularity,
  hourCycle,
  locale,
  minuteStep,
  min,
  max,
  required = false,
  optional = false,
  disabled = false,
  readOnly = false,
  name,
  id: idProp,
  className,
  ...props
}: TimePickerProps) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const labelId = `${id}-label`;
  const descriptionId = `${id}-description`;
  const errorId = `${id}-error`;
  const showError = Boolean(error);
  // The headless field tracks the value; only the controlled value is known here, so an
  // uncontrolled out-of-range time is marked by the field's own `data-invalid`.
  const invalid = showError || isTimeOutOfRange(value, min, max);
  const describedBy = showError ? errorId : description ? descriptionId : undefined;

  return (
    <div
      {...props}
      className={['time-picker', className].filter(Boolean).join(' ')}
      data-invalid={invalid ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
    >
      {label && (
        <span className="time-picker-label" id={labelId} data-disabled={disabled ? '' : undefined}>
          {label}
          {required && (
            <>
              <span className="time-picker-required" aria-hidden="true">
                *
              </span>
              {' '}
              <VisuallyHidden>(required)</VisuallyHidden>
            </>
          )}
          {optional && <span className="time-picker-optional">(optional)</span>}
        </span>
      )}
      <TimeFieldRoot
        className="time-picker-box"
        id={id}
        aria-labelledby={label ? labelId : undefined}
        aria-describedby={describedBy}
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        granularity={granularity}
        hourCycle={hourCycle}
        locale={locale}
        minuteStep={minuteStep}
        min={min}
        max={max}
        disabled={disabled}
        readOnly={readOnly}
        name={name}
      >
        {(layout) => (
          <>
            <span className="time-picker-segments">
              {layout.map((part, index) =>
                part.type === 'literal' ? (
                  <span key={index} className="time-picker-literal" aria-hidden="true">
                    {part.text}
                  </span>
                ) : (
                  <TimeFieldSegment
                    key={index}
                    type={part.type}
                    className="time-picker-segment"
                    aria-required={required || undefined}
                    aria-invalid={showError || undefined}
                  />
                ),
              )}
            </span>
            <Icon className="time-picker-icon" name="time_1" size={14} aria-hidden="true" />
          </>
        )}
      </TimeFieldRoot>
      {showError ? (
        <p className="time-picker-error" role="alert" id={errorId}>
          {error}
        </p>
      ) : (
        description && (
          <p className="time-picker-description" id={descriptionId}>
            {description}
          </p>
        )
      )}
    </div>
  );
}

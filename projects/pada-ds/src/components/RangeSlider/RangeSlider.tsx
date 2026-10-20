import { useId, useMemo } from 'react';
import { SliderRange, SliderRoot, SliderThumb, SliderTrack } from '../../headless/Slider/Slider';
import { useControllableState } from '../../headless/utils/useControllableState';
import './RangeSlider.css';

const cx = (...names: (string | undefined | false)[]) => names.filter(Boolean).join(' ');

export interface RangeSliderProps {
  label: string;
  /** Controlled `[low, high]`. */
  value?: [number, number];
  /** Initial `[low, high]` when uncontrolled. @default [min, max] */
  defaultValue?: [number, number];
  /** Called on every change while dragging or pressing keys. */
  onValueChange?: (value: [number, number]) => void;
  /** Called when a drag ends or a key press changes the value. */
  onValueCommit?: (value: [number, number]) => void;
  /** @default 0 */
  min?: number;
  /** @default 100 */
  max?: number;
  /** @default 1 */
  step?: number;
  /** Steps kept between the two thumbs. @default 0 */
  minStepsBetweenThumbs?: number;
  /** Number format for the values shown and announced. */
  formatOptions?: Intl.NumberFormatOptions;
  locale?: string;
  /** Show the selected range next to the label. @default true */
  showValue?: boolean;
  /** Accessible names of the thumbs. @default ['Minimum <label>', 'Maximum <label>'] */
  thumbLabels?: [string, string];
  description?: string;
  error?: string;
  disabled?: boolean;
  /** Submits both values with forms under this name. */
  name?: string;
  className?: string;
}

/**
 * A slider with two thumbs for picking a range (price, dates, size). Each thumb is a slider in
 * its own right: arrow keys step, PageUp/PageDown take ten steps, Home/End jump as far as the
 * other thumb allows. Pressing the track moves the nearest thumb.
 */
export function RangeSlider({
  label,
  value: valueProp,
  defaultValue,
  onValueChange,
  onValueCommit,
  min = 0,
  max = 100,
  step = 1,
  minStepsBetweenThumbs = 0,
  formatOptions,
  locale,
  showValue = true,
  thumbLabels,
  description,
  error,
  disabled = false,
  name,
  className,
}: RangeSliderProps) {
  const id = useId();
  const [value, setValue] = useControllableState<[number, number]>({ prop: valueProp, defaultProp: defaultValue ?? [min, max], onChange: onValueChange });
  const optionsKey = JSON.stringify(formatOptions ?? {});
  // eslint-disable-next-line react-hooks/exhaustive-deps -- keyed on the options' content
  const format = useMemo(() => new Intl.NumberFormat(locale, formatOptions), [locale, optionsKey]);
  const [lowLabel, highLabel] = thumbLabels ?? [`Minimum ${label.toLowerCase()}`, `Maximum ${label.toLowerCase()}`];
  const describedBy = [description && !error && `${id}-description`, error && `${id}-error`].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cx('range-slider', className)} data-invalid={error ? '' : undefined} data-disabled={disabled ? '' : undefined}>
      <div className="range-slider-header">
        <span id={`${id}-label`} className="range-slider-label">
          {label}
        </span>
        {showValue && (
          <span className="range-slider-value" aria-hidden="true">
            {`${format.format(value[0])} – ${format.format(value[1])}`}
          </span>
        )}
      </div>
      <SliderRoot
        className="range-slider-root"
        value={value}
        onValueChange={(next) => setValue([next[0], next[1]])}
        onValueCommit={(next) => onValueCommit?.([next[0], next[1]])}
        min={min}
        max={max}
        step={step}
        minStepsBetweenThumbs={minStepsBetweenThumbs}
        disabled={disabled}
        name={name}
        role="group"
        aria-labelledby={`${id}-label`}
      >
        <SliderTrack className="range-slider-track">
          <SliderRange className="range-slider-range" />
        </SliderTrack>
        {[lowLabel, highLabel].map((thumbLabel, index) => (
          <SliderThumb
            key={index}
            index={index}
            className="range-slider-thumb"
            aria-label={thumbLabel}
            aria-valuetext={format.format(value[index])}
            aria-describedby={describedBy}
            aria-invalid={error ? true : undefined}
          />
        ))}
      </SliderRoot>
      {description && !error && (
        <p id={`${id}-description`} className="range-slider-description">
          {description}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="range-slider-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

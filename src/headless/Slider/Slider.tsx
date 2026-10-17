import {
  useCallback,
  useMemo,
  useRef,
  type ComponentPropsWithRef,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { createPartContext } from '../utils/context';
import { composeEventHandlers, dataFlag } from '../utils/events';
import { useComposedRefs } from '../utils/refs';
import { useControllableState } from '../utils/useControllableState';

type Orientation = 'horizontal' | 'vertical';

interface SliderContextValue {
  values: number[];
  min: number;
  max: number;
  step: number;
  largeStep: number;
  minStepsBetweenThumbs: number;
  orientation: Orientation;
  dir: 'ltr' | 'rtl';
  disabled: boolean;
  /** Moves one thumb, keeping thumbs in order and apart; returns the value actually set. */
  setThumb: (index: number, value: number, commit?: boolean) => void;
  commit: () => void;
  activeThumb: React.RefObject<number>;
  trackRef: React.RefObject<HTMLElement | null>;
  percent: (value: number) => number;
}

const [SliderProvider, useSliderContext] = createPartContext<SliderContextValue>('Slider.Root');

const decimals = (step: number) => (String(step).split('.')[1] ?? '').length;
const snap = (value: number, min: number, step: number) => Number((Math.round((value - min) / step) * step + min).toFixed(decimals(step)));
const clamp = (value: number, low: number, high: number) => Math.min(high, Math.max(low, value));

export interface SliderRootProps extends Omit<ComponentPropsWithRef<'span'>, 'defaultValue' | 'dir' | 'onChange'> {
  /** Controlled thumb values: one number per thumb (`[25]`, or `[20, 80]` for a range). */
  value?: number[];
  /** Initial thumb values when uncontrolled. @default [min] */
  defaultValue?: number[];
  /** Called on every change while dragging or pressing keys. */
  onValueChange?: (value: number[]) => void;
  /** Called once a drag ends or a key press changes the value. */
  onValueCommit?: (value: number[]) => void;
  /** @default 0 */
  min?: number;
  /** @default 100 */
  max?: number;
  /** @default 1 */
  step?: number;
  /** PageUp/PageDown step. @default step × 10 */
  largeStep?: number;
  /** Steps kept between neighbouring thumbs. @default 0 */
  minStepsBetweenThumbs?: number;
  orientation?: Orientation;
  dir?: 'ltr' | 'rtl';
  disabled?: boolean;
  /** Submits each thumb's value with forms (as `name`, repeated). */
  name?: string;
}

/** A slider with one or more thumbs. WAI-ARIA APG: Slider (Multi-Thumb). */
export function SliderRoot({
  value: valueProp,
  defaultValue,
  onValueChange,
  onValueCommit,
  min = 0,
  max = 100,
  step = 1,
  largeStep,
  minStepsBetweenThumbs = 0,
  orientation = 'horizontal',
  dir = 'ltr',
  disabled = false,
  name,
  children,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  ...props
}: SliderRootProps) {
  const [values, setValues] = useControllableState({ prop: valueProp, defaultProp: defaultValue ?? [min], onChange: onValueChange });
  const latest = useRef(values);
  latest.current = values;
  const activeThumb = useRef(0);
  const trackRef = useRef<HTMLElement | null>(null);
  const dragging = useRef(false);

  const setThumb = useCallback(
    (index: number, raw: number, commitNow = false) => {
      const current = latest.current;
      const gap = minStepsBetweenThumbs * step;
      const low = index > 0 ? current[index - 1] + gap : min;
      const high = index < current.length - 1 ? current[index + 1] - gap : max;
      const next = clamp(snap(raw, min, step), low, high);
      if (next !== current[index]) {
        const updated = current.map((value, position) => (position === index ? next : value));
        latest.current = updated;
        setValues(updated);
      }
      if (commitNow) onValueCommit?.(latest.current);
    },
    [min, max, step, minStepsBetweenThumbs, setValues, onValueCommit],
  );
  const commit = useCallback(() => onValueCommit?.(latest.current), [onValueCommit]);
  const percent = useCallback((value: number) => ((value - min) / (max - min || 1)) * 100, [min, max]);

  const context = useMemo(
    () => ({
      values,
      min,
      max,
      step,
      largeStep: largeStep ?? step * 10,
      minStepsBetweenThumbs,
      orientation,
      dir,
      disabled,
      setThumb,
      commit,
      activeThumb,
      trackRef,
      percent,
    }),
    [values, min, max, step, largeStep, minStepsBetweenThumbs, orientation, dir, disabled, setThumb, commit, percent],
  );

  // The value under the pointer, measured along the track.
  const valueAt = (event: ReactPointerEvent<HTMLElement>) => {
    const box = (trackRef.current ?? event.currentTarget).getBoundingClientRect();
    let ratio =
      orientation === 'horizontal' ? (event.clientX - box.left) / (box.width || 1) : 1 - (event.clientY - box.top) / (box.height || 1);
    if (orientation === 'horizontal' && dir === 'rtl') ratio = 1 - ratio;
    return min + clamp(ratio, 0, 1) * (max - min);
  };

  return (
    <SliderProvider value={context}>
      <span
        data-orientation={orientation}
        data-disabled={dataFlag(disabled)}
        dir={dir}
        {...props}
        onPointerDown={composeEventHandlers(onPointerDown, (event: ReactPointerEvent<HTMLSpanElement>) => {
          if (disabled || event.button !== 0) return;
          const value = valueAt(event);
          // The nearest thumb moves there; when thumbs overlap, the one on the side being dragged to.
          let index = 0;
          latest.current.forEach((thumb, position) => {
            const distance = Math.abs(thumb - value);
            const best = Math.abs(latest.current[index] - value);
            if (distance < best || (distance === best && value > thumb)) index = position;
          });
          activeThumb.current = index;
          dragging.current = true;
          event.currentTarget.setPointerCapture?.(event.pointerId);
          setThumb(index, value);
          event.currentTarget.querySelectorAll<HTMLElement>('[role="slider"]')[index]?.focus({ preventScroll: true });
          event.preventDefault();
        })}
        onPointerMove={composeEventHandlers(onPointerMove, (event: ReactPointerEvent<HTMLSpanElement>) => {
          if (dragging.current) setThumb(activeThumb.current, valueAt(event));
        })}
        onPointerUp={composeEventHandlers(onPointerUp, (event: ReactPointerEvent<HTMLSpanElement>) => {
          if (!dragging.current) return;
          dragging.current = false;
          event.currentTarget.releasePointerCapture?.(event.pointerId);
          commit();
        })}
      >
        {children}
        {name && values.map((value, index) => <input key={index} type="hidden" name={name} value={value} disabled={disabled} />)}
      </span>
    </SliderProvider>
  );
}

/** The track: the line the thumbs move along. Pressing anywhere on the slider moves the nearest thumb. */
export function SliderTrack({ ref, ...props }: ComponentPropsWithRef<'span'>) {
  const context = useSliderContext('Slider.Track');
  const composedRef = useComposedRefs(ref, context.trackRef);
  return <span data-orientation={context.orientation} data-disabled={dataFlag(context.disabled)} {...props} ref={composedRef} />;
}

/**
 * The filled part of the track: from the start to the thumb (one thumb) or between the first
 * and last thumbs. Sets `--pada-slider-range-start` and `--pada-slider-range-end` (percent).
 */
export function SliderRange({ style, ...props }: ComponentPropsWithRef<'span'>) {
  const context = useSliderContext('Slider.Range');
  const start = context.values.length > 1 ? context.percent(Math.min(...context.values)) : 0;
  const end = context.percent(Math.max(...context.values));
  return (
    <span
      data-orientation={context.orientation}
      {...props}
      style={{ ['--pada-slider-range-start' as string]: `${start}%`, ['--pada-slider-range-end' as string]: `${end}%`, ...style }}
    />
  );
}

export interface SliderThumbProps extends ComponentPropsWithRef<'span'> {
  /** Which value this thumb controls. @default 0 */
  index?: number;
}

/**
 * One thumb: `role="slider"`. Arrow keys step, PageUp/PageDown take a large step, Home/End
 * jump as far as the neighbouring thumbs allow. Sets `--pada-slider-thumb-position` (percent).
 * Name each thumb with `aria-label` ("Minimum price", "Maximum price").
 */
export function SliderThumb({ index = 0, style, onKeyDown, onFocus, ...props }: SliderThumbProps) {
  const context = useSliderContext('Slider.Thumb');
  const value = context.values[index] ?? context.min;
  const gap = context.minStepsBetweenThumbs * context.step;
  const low = index > 0 ? context.values[index - 1] + gap : context.min;
  const high = index < context.values.length - 1 ? context.values[index + 1] - gap : context.max;

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLSpanElement>) => {
    if (context.disabled) return;
    const forward = context.orientation === 'horizontal' && context.dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
    const backward = forward === 'ArrowRight' ? 'ArrowLeft' : 'ArrowRight';
    const moves: Record<string, number> = {
      [forward]: value + context.step,
      [backward]: value - context.step,
      ArrowUp: value + context.step,
      ArrowDown: value - context.step,
      PageUp: value + context.largeStep,
      PageDown: value - context.largeStep,
      Home: low,
      End: high,
    };
    if (!(event.key in moves)) return;
    event.preventDefault();
    context.setThumb(index, moves[event.key], true);
  };

  return (
    <span
      role="slider"
      tabIndex={context.disabled ? undefined : 0}
      aria-valuenow={value}
      aria-valuemin={low}
      aria-valuemax={high}
      aria-orientation={context.orientation}
      aria-disabled={context.disabled || undefined}
      data-orientation={context.orientation}
      data-disabled={dataFlag(context.disabled)}
      data-index={index}
      {...props}
      style={{ ['--pada-slider-thumb-position' as string]: `${context.percent(value)}%`, ...style }}
      onKeyDown={composeEventHandlers(onKeyDown, handleKeyDown)}
      onFocus={composeEventHandlers(onFocus, () => {
        context.activeThumb.current = index;
      })}
    />
  );
}

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ComponentPropsWithRef,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { createPartContext } from '../utils/context';
import { composeEventHandlers, dataFlag } from '../utils/events';
import { useComposedRefs } from '../utils/refs';
import { useControllableState } from '../utils/useControllableState';
import { clamp, createNumberFormatter, roundToPrecision } from './numberFormat';

interface NumberInputContextValue {
  value: number | null;
  /** Clamps, removes floating-point noise and stores. */
  commit: (value: number | null) => void;
  /** Steps from the current value (or the typed text) by `multiplier` steps. */
  stepBy: (multiplier: number) => void;
  min: number;
  max: number;
  step: number;
  largeStep: number;
  disabled: boolean;
  readOnly: boolean;
  inputId: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  format: (value: number) => string;
  parse: (text: string) => number | null;
  /** Text being typed, before it is committed (null when not editing). */
  draft: string | null;
  setDraft: (draft: string | null) => void;
}

const [NumberInputProvider, useNumberInputContext] = createPartContext<NumberInputContextValue>('NumberInput.Root');

export interface NumberInputRootProps extends Omit<ComponentPropsWithRef<'div'>, 'defaultValue' | 'onChange'> {
  /** Controlled value; `null` when empty. */
  value?: number | null;
  /** Initial value when uncontrolled. */
  defaultValue?: number | null;
  /** Called with the committed value (on step, Enter or blur), `null` when cleared. */
  onValueChange?: (value: number | null) => void;
  /** @default -Infinity */
  min?: number;
  /** @default Infinity */
  max?: number;
  /** Arrow keys and the steppers change the value by this much. @default 1 */
  step?: number;
  /** PageUp and PageDown change the value by this much. @default step × 10 */
  largeStep?: number;
  /** Display format: currency, percent, units, fraction digits. */
  formatOptions?: Intl.NumberFormatOptions;
  /** Locale for formatting and parsing. Defaults to the browser's. */
  locale?: string;
  disabled?: boolean;
  readOnly?: boolean;
  /** Id for the input, e.g. to match a `Field.Root controlId`. Generated when omitted. */
  inputId?: string;
  /** Submits the raw number (not the formatted text) with forms under this name. */
  name?: string;
}

/** Holds a number and its limits. WAI-ARIA APG: Spinbutton. */
export function NumberInputRoot({
  value: valueProp,
  defaultValue = null,
  onValueChange,
  min = -Infinity,
  max = Infinity,
  step = 1,
  largeStep,
  formatOptions,
  locale,
  disabled = false,
  readOnly = false,
  inputId: inputIdProp,
  name,
  children,
  ...props
}: NumberInputRootProps) {
  const [value, setValue] = useControllableState<number | null>({ prop: valueProp, defaultProp: defaultValue, onChange: onValueChange });
  const [draft, setDraft] = useState<string | null>(null);
  // The latest committed value, so repeated steps between renders (press and hold) add up.
  const latestValue = useRef(value);
  latestValue.current = value;
  const generatedId = useId();
  const inputId = inputIdProp ?? `${generatedId}input`;
  const inputRef = useRef<HTMLInputElement>(null);
  const optionsKey = JSON.stringify(formatOptions ?? {});
  // eslint-disable-next-line react-hooks/exhaustive-deps -- keyed on the options' content, not identity
  const formatter = useMemo(() => createNumberFormatter(locale, formatOptions), [locale, optionsKey]);

  const commit = useCallback(
    (next: number | null) => {
      setDraft(null);
      const committed = next === null ? null : roundToPrecision(clamp(next, min, max), step);
      latestValue.current = committed;
      setValue(committed);
    },
    [setValue, min, max, step],
  );

  const stepBy = useCallback(
    (multiplier: number) => {
      const typed = draft === null ? latestValue.current : formatter.parse(draft);
      const start = typed ?? (Number.isFinite(min) ? min : 0);
      // From empty, the first step lands on the start value itself.
      commit(typed === null ? start : start + step * multiplier);
    },
    [draft, formatter, min, step, commit],
  );

  const context = useMemo(
    () => ({
      value,
      commit,
      stepBy,
      min,
      max,
      step,
      largeStep: largeStep ?? step * 10,
      disabled,
      readOnly,
      inputId,
      inputRef,
      format: formatter.format,
      parse: formatter.parse,
      draft,
      setDraft,
    }),
    [value, commit, stepBy, min, max, step, largeStep, disabled, readOnly, inputId, formatter, draft],
  );

  return (
    <NumberInputProvider value={context}>
      <div data-disabled={dataFlag(disabled)} data-readonly={dataFlag(readOnly)} {...props}>
        {children}
        {name && <input type="hidden" name={name} value={value ?? ''} disabled={disabled} />}
      </div>
    </NumberInputProvider>
  );
}

export type NumberInputInputProps = Omit<ComponentPropsWithRef<'input'>, 'value' | 'defaultValue' | 'type' | 'min' | 'max' | 'step'>;

/**
 * The text input, `role="spinbutton"`: Up/Down step, PageUp/PageDown take a large step,
 * Home/End jump to min/max. Typed text is parsed in the locale and committed on Enter or blur.
 */
export function NumberInputInput({ ref, onChange, onKeyDown, onBlur, ...props }: NumberInputInputProps) {
  const context = useNumberInputContext('NumberInput.Input');
  const composedRef = useComposedRefs(ref, context.inputRef);
  const { value, draft } = context;
  const text = draft ?? (value === null ? '' : context.format(value));

  return (
    <input
      type="text"
      inputMode={context.step % 1 === 0 && context.min >= 0 ? 'numeric' : 'decimal'}
      autoComplete="off"
      autoCorrect="off"
      spellCheck={false}
      role="spinbutton"
      id={context.inputId}
      aria-valuenow={value ?? undefined}
      aria-valuetext={value === null ? undefined : context.format(value)}
      aria-valuemin={Number.isFinite(context.min) ? context.min : undefined}
      aria-valuemax={Number.isFinite(context.max) ? context.max : undefined}
      disabled={context.disabled}
      readOnly={context.readOnly}
      {...props}
      ref={composedRef}
      value={text}
      onChange={composeEventHandlers(onChange, (event) => context.setDraft(event.target.value))}
      onBlur={composeEventHandlers(onBlur, () => {
        if (draft !== null) context.commit(context.parse(draft));
      })}
      onKeyDown={composeEventHandlers(onKeyDown, (event: ReactKeyboardEvent<HTMLInputElement>) => {
        if (context.readOnly) return;
        const actions: Record<string, () => void> = {
          ArrowUp: () => context.stepBy(1),
          ArrowDown: () => context.stepBy(-1),
          PageUp: () => context.stepBy(context.largeStep / context.step),
          PageDown: () => context.stepBy(-context.largeStep / context.step),
          Home: () => Number.isFinite(context.min) && context.commit(context.min),
          End: () => Number.isFinite(context.max) && context.commit(context.max),
          Enter: () => draft !== null && context.commit(context.parse(draft)),
        };
        // Home/End only act as spinbutton keys when there is a bound to jump to.
        if ((event.key === 'Home' && !Number.isFinite(context.min)) || (event.key === 'End' && !Number.isFinite(context.max))) return;
        const action = actions[event.key];
        if (!action) return;
        if (event.key !== 'Enter') event.preventDefault();
        action();
      })}
    />
  );
}

const REPEAT_DELAY = 400;
const REPEAT_INTERVAL = 60;

/** Steps while the pointer is held down: once at once, then repeatedly after a pause. */
function usePressAndHold(onStep: () => void) {
  const latest = useRef(onStep);
  latest.current = onStep;
  const timer = useRef<number | undefined>(undefined);
  const stop = useCallback(() => window.clearTimeout(timer.current), []);
  useEffect(() => stop, [stop]);
  const start = useCallback(() => {
    stop();
    latest.current();
    const repeat = (delay: number) => {
      timer.current = window.setTimeout(() => {
        latest.current();
        repeat(REPEAT_INTERVAL);
      }, delay);
    };
    repeat(REPEAT_DELAY);
  }, [stop]);
  return { start, stop };
}

export interface NumberInputStepperProps extends ComponentPropsWithRef<'button'> {
  /** Accessible name. @default "Increase" / "Decrease" */
  'aria-label'?: string;
}

function NumberInputStepper({
  direction,
  onPointerDown,
  onPointerUp,
  onPointerLeave,
  onPointerCancel,
  onClick,
  ...props
}: NumberInputStepperProps & { direction: 1 | -1 }) {
  const context = useNumberInputContext(direction === 1 ? 'NumberInput.Increment' : 'NumberInput.Decrement');
  const atLimit = context.value !== null && (direction === 1 ? context.value >= context.max : context.value <= context.min);
  const disabled = context.disabled || context.readOnly || atLimit;
  const { start, stop } = usePressAndHold(() => context.stepBy(direction));

  // Stop repeating when the limit is reached.
  useEffect(() => {
    if (disabled) stop();
  }, [disabled, stop]);

  return (
    <button
      type="button"
      // Steppers are for pointers; keyboard users have the arrow keys on the input.
      tabIndex={-1}
      aria-label={direction === 1 ? 'Increase' : 'Decrease'}
      aria-controls={context.inputId}
      disabled={disabled}
      data-disabled={dataFlag(disabled)}
      {...props}
      onPointerDown={composeEventHandlers(onPointerDown, (event: ReactPointerEvent<HTMLButtonElement>) => {
        if (disabled || event.button !== 0) return;
        // Keep focus (and the caret) in the input.
        event.preventDefault();
        context.inputRef.current?.focus();
        start();
      })}
      onPointerUp={composeEventHandlers(onPointerUp, stop)}
      onPointerLeave={composeEventHandlers(onPointerLeave, stop)}
      onPointerCancel={composeEventHandlers(onPointerCancel, stop)}
      onClick={composeEventHandlers(onClick, (event) => {
        // A click without a pointer-down (assistive technology, el.click()) still steps.
        if (event.detail === 0 && !disabled) context.stepBy(direction);
      })}
    />
  );
}

/** Steps the value up. Hold to repeat. Out of the tab order: the input's arrow keys do the same. */
export function NumberInputIncrement(props: NumberInputStepperProps) {
  return <NumberInputStepper direction={1} {...props} />;
}

/** Steps the value down. Hold to repeat. */
export function NumberInputDecrement(props: NumberInputStepperProps) {
  return <NumberInputStepper direction={-1} {...props} />;
}

import {
  useCallback,
  useMemo,
  useRef,
  type ComponentPropsWithRef,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import { createPartContext } from '../utils/context';
import { composeEventHandlers, dataFlag } from '../utils/events';
import { useComposedRefs } from '../utils/refs';
import { useControllableState } from '../utils/useControllableState';

interface PinInputContextValue {
  chars: string[];
  length: number;
  type: 'numeric' | 'alphanumeric';
  mask: boolean;
  otp: boolean;
  disabled: boolean;
  placeholder: string;
  /** Writes `text` from `index` on (typing, paste, autofill) and returns the next index to focus. */
  write: (index: number, text: string) => number;
  clear: (index: number) => void;
  focusInput: (index: number) => void;
  register: (index: number, element: HTMLInputElement | null) => void;
}

const [PinInputProvider, usePinInputContext] = createPartContext<PinInputContextValue>('PinInput.Root');

export interface PinInputRootProps extends Omit<ComponentPropsWithRef<'div'>, 'defaultValue' | 'onChange'> {
  /** Number of characters. */
  length: number;
  /** Controlled value (may be shorter than `length` while typing). */
  value?: string;
  defaultValue?: string;
  /** Called with the characters so far; a blank box between filled ones is a space. */
  onValueChange?: (value: string) => void;
  /** Called once every box is filled. */
  onComplete?: (value: string) => void;
  /** Accepted characters. @default 'numeric' */
  type?: 'numeric' | 'alphanumeric';
  /** Hide the characters, like a password. */
  mask?: boolean;
  /** One-time code: lets browsers and phones autofill it from a text message. @default true */
  otp?: boolean;
  disabled?: boolean;
  /** Placeholder in each empty box. */
  placeholder?: string;
  /** Submits the joined value with forms under this name. */
  name?: string;
}

/** A row of single-character boxes for codes and PINs. Name it with `aria-label` or `aria-labelledby`. */
export function PinInputRoot({
  length,
  value: valueProp,
  defaultValue = '',
  onValueChange,
  onComplete,
  type = 'numeric',
  mask = false,
  otp = true,
  disabled = false,
  placeholder = '',
  name,
  children,
  ...props
}: PinInputRootProps) {
  const [value, setValue] = useControllableState({ prop: valueProp, defaultProp: defaultValue, onChange: onValueChange });
  const inputs = useRef(new Map<number, HTMLInputElement>());
  const latest = useRef(value);
  latest.current = value;
  const chars = useMemo(() => Array.from({ length }, (_, index) => value[index] ?? ''), [value, length]);

  const pattern = type === 'numeric' ? /\d/ : /[\p{L}\p{N}]/u;

  const update = useCallback(
    (next: string[]) => {
      // Keep characters in place but drop trailing blanks, so "12" + blank + "4" stays positional.
      const joined = next.map((char) => char || ' ').join('').trimEnd();
      latest.current = joined;
      setValue(joined);
      if (next.every(Boolean) && next.length === length) onComplete?.(next.join(''));
    },
    [setValue, onComplete, length],
  );

  const write = useCallback(
    (index: number, text: string) => {
      const accepted = [...text].filter((char) => pattern.test(char));
      if (accepted.length === 0) return index;
      const next = Array.from({ length }, (_, position) => (latest.current[position] ?? '').trim());
      // A full code pasted (or autofilled) into any box fills the boxes from the start.
      const start = accepted.length >= length ? 0 : index;
      accepted.slice(0, length - start).forEach((char, offset) => {
        next[start + offset] = char;
      });
      update(next);
      return Math.min(length - 1, start + accepted.length);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `pattern` follows `type`
    [length, update, type],
  );

  const clear = useCallback(
    (index: number) => {
      const next = Array.from({ length }, (_, position) => (latest.current[position] ?? '').trim());
      next[index] = '';
      update(next);
    },
    [length, update],
  );

  const focusInput = useCallback((index: number) => {
    const input = inputs.current.get(Math.max(0, Math.min(index, length - 1)));
    input?.focus();
    input?.select();
  }, [length]);

  const register = useCallback((index: number, element: HTMLInputElement | null) => {
    if (element) inputs.current.set(index, element);
    else inputs.current.delete(index);
  }, []);

  const context = useMemo(
    () => ({ chars: chars.map((char) => char.trim()), length, type, mask, otp, disabled, placeholder, write, clear, focusInput, register }),
    [chars, length, type, mask, otp, disabled, placeholder, write, clear, focusInput, register],
  );

  return (
    <PinInputProvider value={context}>
      <div role="group" data-disabled={dataFlag(disabled)} data-complete={dataFlag(chars.every((char) => char.trim()))} {...props}>
        {children}
        {name && <input type="hidden" name={name} value={chars.join('').replace(/\s/g, '')} disabled={disabled} />}
      </div>
    </PinInputProvider>
  );
}

export interface PinInputInputProps extends Omit<ComponentPropsWithRef<'input'>, 'value' | 'defaultValue' | 'type'> {
  /** Position of this box, from 0. */
  index: number;
}

/**
 * One box. Typing fills it and moves on; Backspace clears it (or the previous box); the arrow
 * keys, Home and End move between boxes; pasting a code fills them all.
 */
export function PinInputInput({ index, ref, onChange, onKeyDown, onFocus, onPaste, ...props }: PinInputInputProps) {
  const context = usePinInputContext('PinInput.Input');
  const composedRef = useComposedRefs(ref, (element: HTMLInputElement | null) => context.register(index, element));
  const char = context.chars[index] ?? '';

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    const moves: Record<string, number> = {
      ArrowLeft: index - 1,
      ArrowRight: index + 1,
      Home: 0,
      End: context.length - 1,
    };
    if (event.key in moves) {
      event.preventDefault();
      context.focusInput(moves[event.key]);
    } else if (event.key === 'Backspace') {
      event.preventDefault();
      if (char) context.clear(index);
      else if (index > 0) {
        context.clear(index - 1);
        context.focusInput(index - 1);
      }
    } else if (event.key === 'Delete') {
      event.preventDefault();
      context.clear(index);
    }
  };

  return (
    <input
      type={context.mask ? 'password' : 'text'}
      inputMode={context.type === 'numeric' ? 'numeric' : 'text'}
      pattern={context.type === 'numeric' ? '[0-9]*' : undefined}
      autoComplete={context.otp && index === 0 ? 'one-time-code' : 'off'}
      autoCapitalize="none"
      spellCheck={false}
      aria-label={`Character ${index + 1} of ${context.length}`}
      placeholder={context.placeholder}
      disabled={context.disabled}
      data-filled={dataFlag(!!char)}
      {...props}
      ref={composedRef}
      value={char}
      onChange={composeEventHandlers(onChange, (event) => {
        // Autofill and some keyboards put several characters into one box at once.
        const typed = event.target.value.replace(char, '') || event.target.value;
        context.focusInput(context.write(index, typed));
      })}
      onPaste={composeEventHandlers(onPaste, (event) => {
        event.preventDefault();
        context.focusInput(context.write(index, event.clipboardData.getData('text')));
      })}
      onKeyDown={composeEventHandlers(onKeyDown, handleKeyDown)}
      onFocus={composeEventHandlers(onFocus, (event) => event.currentTarget.select())}
    />
  );
}

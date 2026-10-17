import { useCallback, useRef, useState } from 'react';

export interface ControllableStateOptions<T> {
  /** Controlled value. When defined, the component never changes it on its own. */
  prop?: T;
  /** Initial value when uncontrolled. */
  defaultProp: T;
  /** Called with every new value, controlled or not. */
  onChange?: (value: T) => void;
}

/**
 * State that is controlled when `prop` is defined and internal otherwise, behind one setter.
 * The single place Pada implements the `value` / `defaultValue` / `onValueChange` pattern.
 */
export function useControllableState<T>({ prop, defaultProp, onChange }: ControllableStateOptions<T>) {
  const [internal, setInternal] = useState(defaultProp);
  const isControlled = prop !== undefined;
  const value = isControlled ? (prop as T) : internal;

  const latest = useRef({ value, onChange, isControlled });
  latest.current = { value, onChange, isControlled };

  const setValue = useCallback((next: T | ((previous: T) => T)) => {
    const { value: current, onChange: notify, isControlled: controlled } = latest.current;
    const resolved = typeof next === 'function' ? (next as (previous: T) => T)(current) : next;
    if (Object.is(resolved, current)) return;
    if (!controlled) setInternal(resolved);
    latest.current.value = resolved;
    notify?.(resolved);
  }, []);

  return [value, setValue] as const;
}

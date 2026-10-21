import { useMemo, type ComponentPropsWithRef, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { createPartContext } from '../utils/context';
import { composeEventHandlers, dataFlag } from '../utils/events';
import { focusElement } from '../utils/focus';
import { findNextIndex, keyToNavigation } from '../utils/navigation';
import { Slot } from '../utils/Slot';
import { useControllableState } from '../utils/useControllableState';

export interface ToggleProps extends ComponentPropsWithRef<'button'> {
  /** Controlled pressed state. */
  pressed?: boolean;
  /** Initial pressed state when uncontrolled. */
  defaultPressed?: boolean;
  /** Called with the new pressed state. */
  onPressedChange?: (pressed: boolean) => void;
  /** Merge the behaviour onto your own button. */
  asChild?: boolean;
}

/** A two-state button: `aria-pressed`, `data-state="on|off"`. */
export function Toggle({ pressed: pressedProp, defaultPressed = false, onPressedChange, asChild, disabled, onClick, ...props }: ToggleProps) {
  const [pressed, setPressed] = useControllableState({ prop: pressedProp, defaultProp: defaultPressed, onChange: onPressedChange });
  const Component = asChild ? Slot : 'button';
  return (
    <Component
      type={asChild ? undefined : 'button'}
      aria-pressed={pressed}
      data-state={pressed ? 'on' : 'off'}
      data-disabled={dataFlag(disabled)}
      disabled={disabled}
      {...props}
      onClick={composeEventHandlers(onClick, () => {
        if (!disabled) setPressed(!pressed);
      })}
    />
  );
}

interface ToggleGroupContextValue {
  type: 'single' | 'multiple';
  values: string[];
  toggle: (value: string) => void;
  disabled: boolean;
}

const [ToggleGroupProvider, useToggleGroupContext] = createPartContext<ToggleGroupContextValue>('ToggleGroup.Root');

interface ToggleGroupBaseProps extends Omit<ComponentPropsWithRef<'div'>, 'defaultValue' | 'dir'> {
  /** Arrow keys follow the orientation. */
  orientation?: 'horizontal' | 'vertical';
  /** Wrap focus from the last item to the first and back. @default true */
  loop?: boolean;
  /** Disables every item. */
  disabled?: boolean;
  dir?: 'ltr' | 'rtl';
}

export interface ToggleGroupSingleProps extends ToggleGroupBaseProps {
  /** One item pressed at a time (like radio buttons, but it can be cleared). */
  type: 'single';
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

export interface ToggleGroupMultipleProps extends ToggleGroupBaseProps {
  /** Any number of items pressed. */
  type: 'multiple';
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
}

export type ToggleGroupRootProps = ToggleGroupSingleProps | ToggleGroupMultipleProps;

// Both union branches, flattened, for reading props inside the component.
type ToggleGroupLooseProps = ToggleGroupBaseProps & {
  type: 'single' | 'multiple';
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
};

/** A set of toggle buttons with one tab stop and arrow-key movement (roving focus). */
export function ToggleGroupRoot(props: ToggleGroupRootProps) {
  const {
    type,
    value,
    defaultValue,
    onValueChange,
    orientation = 'horizontal',
    loop = true,
    disabled = false,
    dir = 'ltr',
    onKeyDown,
    ...domProps
  } = props as unknown as ToggleGroupLooseProps;
  const toArray = (input: string | string[] | undefined) => (input === undefined ? undefined : Array.isArray(input) ? input : input ? [input] : []);
  const [values, setValues] = useControllableState<string[]>({
    prop: toArray(value),
    defaultProp: toArray(defaultValue) ?? [],
    onChange: (next) => onValueChange?.(type === 'single' ? (next[0] ?? '') : next),
  });
  const context = useMemo(
    () => ({
      type,
      values,
      disabled,
      toggle: (item: string) => {
        if (type === 'single') setValues(values.includes(item) ? [] : [item]);
        else setValues(values.includes(item) ? values.filter((entry) => entry !== item) : [...values, item]);
      },
    }),
    [type, values, disabled, setValues],
  );
  return (
    <ToggleGroupProvider value={context}>
      <div
        role="group"
        data-orientation={orientation}
        data-disabled={dataFlag(disabled)}
        dir={dir}
        {...domProps}
        onKeyDown={composeEventHandlers(onKeyDown, (event: ReactKeyboardEvent<HTMLDivElement>) => {
          const step = keyToNavigation(event.key, orientation, dir);
          if (!step) return;
          const items = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('[data-toggle-group-item]'));
          const descriptors = items.map((item) => ({ label: item.textContent ?? '', disabled: item.hasAttribute('data-disabled') }));
          const next = findNextIndex(descriptors, items.indexOf(event.target as HTMLElement), step, { loop });
          if (next === -1) return;
          event.preventDefault();
          items.forEach((item, index) => item.setAttribute('tabindex', index === next ? '0' : '-1'));
          focusElement(items[next]);
        })}
      />
    </ToggleGroupProvider>
  );
}

export interface ToggleGroupItemProps extends ComponentPropsWithRef<'button'> {
  /** This item's value. */
  value: string;
  /** Merge the behaviour onto your own button. */
  asChild?: boolean;
}

/** One item of a ToggleGroup: `aria-pressed`, `data-state="on|off"`. */
export function ToggleGroupItem({ value, asChild, disabled: disabledProp, onClick, onFocus, ...props }: ToggleGroupItemProps) {
  const context = useToggleGroupContext('ToggleGroup.Item');
  const pressed = context.values.includes(value);
  const disabled = context.disabled || !!disabledProp;
  const Component = asChild ? Slot : 'button';
  return (
    <Component
      type={asChild ? undefined : 'button'}
      aria-pressed={pressed}
      data-state={pressed ? 'on' : 'off'}
      data-disabled={dataFlag(disabled)}
      data-toggle-group-item=""
      data-value={value}
      // Initial tab stop: the first pressed item, or the first item (fixed up on focus below).
      tabIndex={pressed || context.values.length === 0 ? 0 : -1}
      disabled={disabled}
      {...props}
      onFocus={composeEventHandlers(onFocus, (event) => {
        const group = event.currentTarget.closest('[role="group"]');
        group?.querySelectorAll<HTMLElement>('[data-toggle-group-item]').forEach((item) =>
          item.setAttribute('tabindex', item === event.currentTarget ? '0' : '-1'),
        );
      })}
      onClick={composeEventHandlers(onClick, () => {
        if (!disabled) context.toggle(value);
      })}
    />
  );
}

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ComponentPropsWithRef,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  type RefObject,
} from 'react';
import { createPartContext } from '../utils/context';
import { composeEventHandlers, dataFlag, openState } from '../utils/events';
import { useFloatingPosition, type FloatingOptions } from '../utils/floating';
import { findNextIndex, type NavigationKey } from '../utils/navigation';
import { Portal, type PortalProps } from '../utils/Portal';
import { useComposedRefs } from '../utils/refs';
import { useControllableState } from '../utils/useControllableState';
import { useDismissable } from '../utils/useDismissable';
import { usePresence } from '../utils/usePresence';

import { defaultComboboxFilter, type ComboboxFilter } from './filter';

interface ComboboxContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  inputValue: string;
  setInputValue: (value: string) => void;
  values: string[];
  multiple: boolean;
  select: (value: string, label: string) => void;
  highlighted: string | null;
  setHighlighted: (value: string | null) => void;
  filter: ComboboxFilter | false;
  /** True while the input text came from typing (filtering applies), false right after selecting. */
  filtering: boolean;
  disabled: boolean;
  listboxId: string;
  optionId: (value: string) => string;
  inputRef: RefObject<HTMLInputElement | null>;
  anchor: HTMLElement | null;
  setAnchor: (element: HTMLElement | null) => void;
  listbox: HTMLElement | null;
  setListbox: (element: HTMLElement | null) => void;
  hasOptions: boolean;
  setHasOptions: (value: boolean) => void;
  /** Set when the list is opened from the keyboard: which option to highlight once it renders. */
  pendingHighlight: RefObject<'first' | 'last' | null>;
}

const [ComboboxProvider, useComboboxContext] = createPartContext<ComboboxContextValue>('Combobox.Root');

const idPart = (value: string) => value.replace(/[^\w-]/g, (character) => `_${character.charCodeAt(0)}`);
const getOptions = (listbox: HTMLElement | null) =>
  listbox ? Array.from(listbox.querySelectorAll<HTMLElement>('[role="option"]')) : [];

interface ComboboxRootBaseProps {
  children?: ReactNode;
  /** Typed text. Controlled when set. */
  inputValue?: string;
  /** Initial typed text when uncontrolled. */
  defaultInputValue?: string;
  /** Called on every keystroke (and when a selection fills the input). */
  onInputValueChange?: (value: string) => void;
  /** Controlled open state of the list. */
  open?: boolean;
  /** Called when the list opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** How items are matched against the text. `false` turns filtering off (for server-side search). */
  filter?: ComboboxFilter | false;
  /** Disables the input. */
  disabled?: boolean;
}

export interface ComboboxSingleProps extends ComboboxRootBaseProps {
  multiple?: false;
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
}

export interface ComboboxMultipleProps extends ComboboxRootBaseProps {
  /** Select several items; the input clears after each pick and the list stays open. */
  multiple: true;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
}

export type ComboboxRootProps = ComboboxSingleProps | ComboboxMultipleProps;

type ComboboxLooseProps = ComboboxRootBaseProps & {
  multiple?: boolean;
  value?: string | string[] | null;
  defaultValue?: string | string[] | null;
  onValueChange?: (value: string | string[] | null) => void;
};

const toArray = (value: string | string[] | null | undefined) =>
  value === undefined ? undefined : value === null ? [] : Array.isArray(value) ? value : [value];

/** A text input with a list of suggestions (WAI-ARIA APG Combobox, list autocomplete). */
export function ComboboxRoot(props: ComboboxRootProps) {
  const {
    children,
    multiple = false,
    value,
    defaultValue,
    onValueChange,
    inputValue: inputValueProp,
    defaultInputValue = '',
    onInputValueChange,
    open: openProp,
    onOpenChange,
    filter = defaultComboboxFilter,
    disabled = false,
  } = props as ComboboxLooseProps;
  const [values, setValues] = useControllableState<string[]>({
    prop: toArray(value),
    defaultProp: toArray(defaultValue) ?? [],
    onChange: (next) => onValueChange?.(multiple ? next : (next[0] ?? null)),
  });
  const [inputValue, setInputValueState] = useControllableState({
    prop: inputValueProp,
    defaultProp: defaultInputValue,
    onChange: onInputValueChange,
  });
  const [open, setOpen] = useControllableState({ prop: openProp, defaultProp: false, onChange: onOpenChange });
  const [highlighted, setHighlighted] = useState<string | null>(null);
  const [filtering, setFiltering] = useState(false);
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [listbox, setListbox] = useState<HTMLElement | null>(null);
  const [hasOptions, setHasOptions] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const pendingHighlight = useRef<'first' | 'last' | null>(null);
  const baseId = useId();

  const setInputValue = useCallback(
    (next: string) => {
      setFiltering(true);
      setInputValueState(next);
    },
    [setInputValueState],
  );

  const select = useCallback(
    (item: string, label: string) => {
      if (multiple) {
        setValues(values.includes(item) ? values.filter((entry) => entry !== item) : [...values, item]);
        setFiltering(false);
        setInputValueState('');
      } else {
        setValues([item]);
        setFiltering(false);
        setInputValueState(label);
        setOpen(false);
      }
    },
    [multiple, values, setValues, setInputValueState, setOpen],
  );

  const context = useMemo<ComboboxContextValue>(
    () => ({
      open: open && !disabled,
      setOpen,
      inputValue,
      setInputValue,
      values,
      multiple,
      select,
      highlighted,
      setHighlighted,
      filter,
      filtering,
      disabled,
      listboxId: `${baseId}listbox`,
      optionId: (item: string) => `${baseId}option-${idPart(item)}`,
      inputRef,
      anchor,
      setAnchor,
      listbox,
      setListbox,
      hasOptions,
      setHasOptions,
      pendingHighlight,
    }),
    [open, disabled, setOpen, inputValue, setInputValue, values, multiple, select, highlighted, filter, filtering, baseId, anchor, listbox, hasOptions],
  );
  return <ComboboxProvider value={context}>{children}</ComboboxProvider>;
}

export type ComboboxAnchorProps = ComponentPropsWithRef<'div'>;

/** The box the list is positioned against (the input's frame). Defaults to the input itself. */
export function ComboboxAnchor({ ref, ...props }: ComboboxAnchorProps) {
  const context = useComboboxContext('Combobox.Anchor');
  const composedRef = useComposedRefs(ref, context.setAnchor);
  return <div {...props} ref={composedRef} />;
}

export type ComboboxInputProps = ComponentPropsWithRef<'input'>;

/** The text input: `role="combobox"`, owns keyboard navigation through `aria-activedescendant`. */
export function ComboboxInput({ ref, onChange, onKeyDown, onBlur, onClick, ...props }: ComboboxInputProps) {
  const context = useComboboxContext('Combobox.Input');
  const composedRef = useComposedRefs(ref, context.inputRef);
  const { open, setOpen, highlighted, setHighlighted, listbox } = context;

  const move = (step: NavigationKey) => {
    const options = getOptions(listbox);
    const items = options.map((option) => ({ label: option.textContent ?? '', disabled: option.hasAttribute('data-disabled') }));
    const current = options.findIndex((option) => option.dataset.value === highlighted);
    const next = findNextIndex(items, current, step, { loop: true });
    setHighlighted(next === -1 ? null : (options[next].dataset.value ?? null));
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp': {
        event.preventDefault();
        if (!open) {
          // The list renders on open and applies the highlight itself (Alt+Down only opens).
          if (!event.altKey) context.pendingHighlight.current = event.key === 'ArrowDown' ? 'first' : 'last';
          setOpen(true);
          return;
        }
        if (!event.altKey) move(event.key === 'ArrowDown' ? 'next' : 'previous');
        return;
      }
      case 'Enter': {
        if (!open || highlighted === null) return;
        const option = listbox?.querySelector<HTMLElement>(`[data-value="${CSS.escape(highlighted)}"]`);
        if (option && !option.hasAttribute('data-disabled')) {
          event.preventDefault();
          context.select(highlighted, option.dataset.label ?? option.textContent ?? '');
        }
        return;
      }
      case 'Escape': {
        if (open) {
          event.preventDefault();
          event.stopPropagation();
          setOpen(false);
        } else if (context.inputValue) {
          event.preventDefault();
          context.setInputValue('');
        }
        return;
      }
      case 'Tab':
        setOpen(false);
        return;
    }
  };

  return (
    <input
      type="text"
      role="combobox"
      autoComplete="off"
      aria-autocomplete="list"
      aria-expanded={open}
      aria-controls={open ? context.listboxId : undefined}
      aria-activedescendant={open && highlighted !== null ? context.optionId(highlighted) : undefined}
      disabled={context.disabled}
      data-state={openState(open)}
      {...props}
      ref={composedRef}
      value={context.inputValue}
      onChange={composeEventHandlers(onChange, (event) => {
        context.setInputValue(event.target.value);
        setOpen(true);
      })}
      onClick={composeEventHandlers(onClick, () => setOpen(true))}
      onKeyDown={composeEventHandlers(onKeyDown, handleKeyDown)}
      onBlur={composeEventHandlers(onBlur, () => setOpen(false))}
    />
  );
}

export type ComboboxTriggerProps = ComponentPropsWithRef<'button'>;

/** Optional button that toggles the list (not in the tab order; the input is the focus target). */
export function ComboboxTrigger({ onClick, onMouseDown, ...props }: ComboboxTriggerProps) {
  const context = useComboboxContext('Combobox.Trigger');
  return (
    <button
      type="button"
      tabIndex={-1}
      aria-label={context.open ? 'Hide suggestions' : 'Show suggestions'}
      aria-expanded={context.open}
      aria-controls={context.open ? context.listboxId : undefined}
      disabled={context.disabled}
      data-state={openState(context.open)}
      {...props}
      // Keep focus in the input.
      onMouseDown={composeEventHandlers(onMouseDown, (event) => event.preventDefault())}
      onClick={composeEventHandlers(onClick, () => {
        context.setOpen(!context.open);
        context.inputRef.current?.focus();
      })}
    />
  );
}

export type ComboboxPortalProps = PortalProps;

/** Renders the list into `document.body`. */
export function ComboboxPortal(props: ComboboxPortalProps) {
  return <Portal {...props} />;
}

export interface ComboboxContentProps extends ComponentPropsWithRef<'div'>, FloatingOptions {
  /** Keep mounted while closed. */
  forceMount?: boolean;
}

/** The suggestion list: `role="listbox"`, positioned under the anchor. */
export function ComboboxContent({ forceMount, ref, ...props }: ComboboxContentProps) {
  const context = useComboboxContext('Combobox.Content');
  const presence = usePresence(context.open);
  const composedRef = useComposedRefs(ref, presence.ref);
  if (!(forceMount || presence.isPresent)) return null;
  return <ComboboxContentImpl {...props} ref={composedRef} context={context} />;
}

function ComboboxContentImpl({
  context,
  ref,
  side = 'bottom',
  align = 'start',
  sideOffset = 4,
  alignOffset,
  avoidCollisions,
  collisionPadding,
  hideWhenDetached,
  style,
  onMouseDown,
  children,
  ...props
}: Omit<ComboboxContentProps, 'forceMount'> & { context: ComboboxContextValue }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const floating = useFloatingPosition(context.open, { side, align, sideOffset, alignOffset, avoidCollisions, collisionPadding, hideWhenDetached });
  const composedRef = useComposedRefs(ref, contentRef, floating.refs.setFloating, context.setListbox);
  const { setReference } = floating.refs;
  const { anchor, inputRef, setOpen, highlighted, setHighlighted, setHasOptions, inputValue, filtering, pendingHighlight } = context;

  useLayoutEffect(() => {
    setReference(anchor ?? inputRef.current);
  }, [anchor, inputRef, setReference]);

  useDismissable(contentRef, {
    enabled: context.open,
    onDismiss: useCallback(() => setOpen(false), [setOpen]),
    onInteractOutside: (event) => {
      const target = event.target as Node | null;
      if (target && (inputRef.current?.contains(target) || anchor?.contains(target))) event.preventDefault();
    },
  });

  // After every render: track whether anything matches, keep the highlight on a visible option,
  // and highlight the first match while the user is typing.
  useLayoutEffect(() => {
    const options = getOptions(contentRef.current);
    const enabled = options.filter((option) => !option.hasAttribute('data-disabled'));
    setHasOptions(options.length > 0);
    if (pendingHighlight.current) {
      const target = pendingHighlight.current === 'first' ? enabled[0] : enabled[enabled.length - 1];
      pendingHighlight.current = null;
      setHighlighted(target?.dataset.value ?? null);
      return;
    }
    const stillVisible = options.some((option) => option.dataset.value === highlighted);
    if (!stillVisible) {
      setHighlighted(filtering && inputValue && enabled[0] ? (enabled[0].dataset.value ?? null) : null);
    }
  });

  useEffect(() => {
    if (highlighted === null) return;
    contentRef.current?.querySelector(`[data-value="${CSS.escape(highlighted)}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [highlighted]);

  return (
    <div
      id={context.listboxId}
      role="listbox"
      aria-multiselectable={context.multiple || undefined}
      data-state={openState(context.open)}
      data-side={floating.side}
      data-pada-layer=""
      {...props}
      ref={composedRef}
      style={{ ...floating.floatingStyles, ...style }}
      // Clicking inside the list must not blur the input.
      onMouseDown={composeEventHandlers(onMouseDown, (event) => event.preventDefault())}
    >
      {children}
    </div>
  );
}

export interface ComboboxItemProps extends ComponentPropsWithRef<'div'> {
  /** The value selected by this item. */
  value: string;
  /** Text used for filtering and for filling the input. Defaults to the item's text content. */
  textValue?: string;
  disabled?: boolean;
}

/** One suggestion: `role="option"`. Hidden when it does not match the typed text. */
export function ComboboxItem({ value, textValue, disabled, children, onClick, onPointerMove, ...props }: ComboboxItemProps) {
  const context = useComboboxContext('Combobox.Item');
  const label = textValue ?? (typeof children === 'string' ? children : value);
  const visible = !context.filter || !context.filtering || context.filter(label, context.inputValue);
  if (!visible) return null;
  const selected = context.values.includes(value);
  const highlighted = context.highlighted === value;
  return (
    <div
      id={context.optionId(value)}
      role="option"
      aria-selected={selected}
      aria-disabled={disabled || undefined}
      data-value={value}
      data-label={label}
      data-state={selected ? 'checked' : 'unchecked'}
      data-highlighted={dataFlag(highlighted)}
      data-disabled={dataFlag(disabled)}
      {...props}
      onPointerMove={composeEventHandlers(onPointerMove, () => {
        if (!disabled && !highlighted) context.setHighlighted(value);
      })}
      onClick={composeEventHandlers(onClick, () => {
        if (!disabled) context.select(value, label);
      })}
    >
      {children}
    </div>
  );
}

/** Groups items under a heading. Point `aria-labelledby` at the heading. */
export function ComboboxGroup(props: ComponentPropsWithRef<'div'>) {
  return <div role="group" {...props} />;
}

/** Shown when no item matches. */
export function ComboboxEmpty(props: ComponentPropsWithRef<'div'>) {
  const context = useComboboxContext('Combobox.Empty');
  if (context.hasOptions) return null;
  return <div role="presentation" {...props} />;
}

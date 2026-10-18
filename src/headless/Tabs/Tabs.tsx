import {
  useCallback,
  useId,
  useLayoutEffect,
  useMemo,
  useState,
  type ComponentPropsWithRef,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import { createPartContext } from '../utils/context';
import { composeEventHandlers, dataFlag } from '../utils/events';
import { focusElement } from '../utils/focus';
import { findNextIndex, keyToNavigation } from '../utils/navigation';
import { useComposedRefs } from '../utils/refs';
import { Slot } from '../utils/Slot';
import { useControllableState } from '../utils/useControllableState';

type Orientation = 'horizontal' | 'vertical';

interface TabsContextValue {
  value: string;
  setValue: (value: string) => void;
  orientation: Orientation;
  activationMode: 'automatic' | 'manual';
  dir: 'ltr' | 'rtl';
  baseId: string;
  list: HTMLElement | null;
  setList: (list: HTMLElement | null) => void;
}

const [TabsProvider, useTabsContext] = createPartContext<TabsContextValue>('Tabs.Root');

// Values become part of element ids, so anything outside [A-Za-z0-9_-] is replaced.
const idPart = (value: string) => value.replace(/[^\w-]/g, (character) => `_${character.charCodeAt(0)}`);
const triggerId = (baseId: string, value: string) => `${baseId}tab-${idPart(value)}`;
const contentId = (baseId: string, value: string) => `${baseId}panel-${idPart(value)}`;

export interface TabsRootProps extends Omit<ComponentPropsWithRef<'div'>, 'defaultValue' | 'dir'> {
  /** Controlled selected tab value. */
  value?: string;
  /** Initially selected tab value when uncontrolled. */
  defaultValue?: string;
  /** Called with the newly selected value. */
  onValueChange?: (value: string) => void;
  /** Arrow keys follow the orientation: Left/Right when horizontal, Up/Down when vertical. */
  orientation?: Orientation;
  /** `automatic` selects a tab when it receives focus; `manual` waits for Enter or Space. */
  activationMode?: 'automatic' | 'manual';
  /** Reading direction, for horizontal arrow keys. */
  dir?: 'ltr' | 'rtl';
}

/** Holds the selected tab. WAI-ARIA APG: Tabs. */
export function TabsRoot({
  value: valueProp,
  defaultValue = '',
  onValueChange,
  orientation = 'horizontal',
  activationMode = 'automatic',
  dir = 'ltr',
  ...props
}: TabsRootProps) {
  const [value, setValue] = useControllableState({ prop: valueProp, defaultProp: defaultValue, onChange: onValueChange });
  const [list, setList] = useState<HTMLElement | null>(null);
  const baseId = useId();
  const context = useMemo(
    () => ({ value, setValue, orientation, activationMode, dir, baseId, list, setList }),
    [value, setValue, orientation, activationMode, dir, baseId, list],
  );
  return (
    <TabsProvider value={context}>
      <div data-orientation={orientation} dir={dir} {...props} />
    </TabsProvider>
  );
}

/** Tabs of this list (not of a nested Tabs), in DOM order. */
const getTabs = (list: HTMLElement) =>
  Array.from(list.querySelectorAll<HTMLElement>('[role="tab"]')).filter((tab) => tab.closest('[role="tablist"]') === list);

export interface TabsListProps extends ComponentPropsWithRef<'div'> {
  /** Wrap from the last tab to the first and back. @default true */
  loop?: boolean;
}

/** The row (or column) of tabs: `role="tablist"`, with roving focus and Home/End. */
export function TabsList({ loop = true, ref, onKeyDown, ...props }: TabsListProps) {
  const context = useTabsContext('Tabs.List');
  const composedRef = useComposedRefs(ref, context.setList);
  return (
    <div
      role="tablist"
      aria-orientation={context.orientation}
      data-orientation={context.orientation}
      {...props}
      ref={composedRef}
      onKeyDown={composeEventHandlers(onKeyDown, (event: ReactKeyboardEvent<HTMLDivElement>) => {
        const list = event.currentTarget;
        const step = keyToNavigation(event.key, context.orientation, context.dir);
        if (!step || (event.target as HTMLElement).closest('[role="tablist"]') !== list) return;
        const tabs = getTabs(list);
        const items = tabs.map((tab) => ({ label: tab.textContent ?? '', disabled: tab.hasAttribute('data-disabled') }));
        const next = findNextIndex(items, tabs.indexOf(event.target as HTMLElement), step, { loop });
        if (next === -1) return;
        event.preventDefault();
        focusElement(tabs[next]);
      })}
    />
  );
}

export interface TabsTriggerProps extends ComponentPropsWithRef<'button'> {
  /** Value this tab selects. */
  value: string;
  /** Merge the tab's behaviour onto its only child instead of rendering a `<button>`. */
  asChild?: boolean;
}

/** One tab: `role="tab"`, `aria-selected`, `data-state="active|inactive"`. */
export function TabsTrigger({ value, asChild, disabled, onMouseDown, onKeyDown, onFocus, ...props }: TabsTriggerProps) {
  const context = useTabsContext('Tabs.Trigger');
  const selected = context.value === value;
  const Component = asChild ? Slot : 'button';
  return (
    <Component
      type={asChild ? undefined : 'button'}
      role="tab"
      id={triggerId(context.baseId, value)}
      aria-selected={selected}
      aria-controls={contentId(context.baseId, value)}
      tabIndex={selected ? 0 : -1}
      disabled={disabled}
      data-state={selected ? 'active' : 'inactive'}
      data-disabled={dataFlag(disabled)}
      data-orientation={context.orientation}
      data-value={value}
      {...props}
      onMouseDown={composeEventHandlers(onMouseDown, (event) => {
        // Select on press (not on click) like native tabs; ignore right clicks and Ctrl+click.
        if (!disabled && event.button === 0 && !event.ctrlKey) context.setValue(value);
        else if (disabled) event.preventDefault();
      })}
      onKeyDown={composeEventHandlers(onKeyDown, (event) => {
        if ((event.key === 'Enter' || event.key === ' ') && !disabled) context.setValue(value);
      })}
      onFocus={composeEventHandlers(onFocus, () => {
        if (!selected && !disabled && context.activationMode === 'automatic') context.setValue(value);
      })}
    />
  );
}

export interface TabsContentProps extends ComponentPropsWithRef<'div'> {
  /** Value of the tab this panel belongs to. */
  value: string;
  /** Keep the panel mounted (with `hidden`) while inactive, e.g. to preserve form state. */
  forceMount?: boolean;
}

/** The panel for one tab: `role="tabpanel"`, labelled by its tab, focusable. */
export function TabsContent({ value, forceMount, children, ...props }: TabsContentProps) {
  const context = useTabsContext('Tabs.Content');
  const selected = context.value === value;
  return (
    <div
      role="tabpanel"
      id={contentId(context.baseId, value)}
      aria-labelledby={triggerId(context.baseId, value)}
      tabIndex={0}
      hidden={!selected}
      data-state={selected ? 'active' : 'inactive'}
      data-orientation={context.orientation}
      {...props}
    >
      {selected || forceMount ? children : null}
    </div>
  );
}

/**
 * An element that tracks the selected tab, for a sliding underline or pill. It sets
 * `--pada-tabs-indicator-offset` and `--pada-tabs-indicator-size` (along the list's axis, in px)
 * and `data-orientation`; position it absolutely inside the list and animate those values.
 */
export function TabsIndicator({ style, ...props }: ComponentPropsWithRef<'span'>) {
  const context = useTabsContext('Tabs.Indicator');
  const { list, value, orientation } = context;
  const [geometry, setGeometry] = useState<{ offset: number; size: number } | null>(null);

  const measure = useCallback(() => {
    const active = list && getTabs(list).find((tab) => tab.dataset.value === value);
    if (!active) return setGeometry(null);
    setGeometry(
      orientation === 'horizontal'
        ? { offset: active.offsetLeft, size: active.offsetWidth }
        : { offset: active.offsetTop, size: active.offsetHeight },
    );
  }, [list, value, orientation]);

  useLayoutEffect(() => {
    measure();
    if (!list || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    getTabs(list).forEach((tab) => observer.observe(tab));
    return () => observer.disconnect();
  }, [list, measure]);

  return (
    <span
      aria-hidden="true"
      data-orientation={orientation}
      data-state={geometry ? 'visible' : 'hidden'}
      {...props}
      style={{
        ['--pada-tabs-indicator-offset' as string]: `${geometry?.offset ?? 0}px`,
        ['--pada-tabs-indicator-size' as string]: `${geometry?.size ?? 0}px`,
        ...style,
      }}
    />
  );
}

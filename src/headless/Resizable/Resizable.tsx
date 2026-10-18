import {
  Children,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useId,
  useMemo,
  useRef,
  useState,
  type ComponentPropsWithRef,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactElement,
} from 'react';
import { createPartContext } from '../utils/context';
import { composeEventHandlers, dataFlag } from '../utils/events';
import { useComposedRefs } from '../utils/refs';
import { useControllableState } from '../utils/useControllableState';

type Orientation = 'horizontal' | 'vertical';

interface PanelLimits {
  minSize: number;
  maxSize: number;
  collapsible: boolean;
  collapsedSize: number;
}

interface ResizableContextValue {
  orientation: Orientation;
  sizes: number[];
  limits: PanelLimits[];
  panelIds: string[];
  disabled: boolean;
  keyboardStep: number;
  rootRef: React.RefObject<HTMLDivElement | null>;
  /** Moves the boundary after panel `index` so that panel becomes `size` (percent). */
  resize: (index: number, size: number) => void;
  commit: () => void;
  toggleCollapse: (index: number) => void;
}

const [ResizableProvider, useResizableContext] = createPartContext<ResizableContextValue>('Resizable.Root');

/** Index of the panel a part belongs to (a handle gets the panel before it). Set by the root. */
const IndexContext = createContext(-1);

const clamp = (value: number, low: number, high: number) => Math.min(high, Math.max(low, value));
const round = (value: number) => Math.round(value * 1000) / 1000;

export interface ResizableRootProps extends Omit<ComponentPropsWithRef<'div'>, 'dir'> {
  /** `horizontal` lays panels side by side; `vertical` stacks them. @default 'horizontal' */
  orientation?: Orientation;
  /** Controlled panel sizes, in percent, one per panel. */
  sizes?: number[];
  /** Called with the new sizes on every change. */
  onSizesChange?: (sizes: number[]) => void;
  /** Called once a drag ends or a key press resizes, e.g. to save the layout. */
  onSizesCommit?: (sizes: number[]) => void;
  /** Percent moved by each arrow-key press. @default 10 */
  keyboardStep?: number;
  disabled?: boolean;
}

/**
 * A group of resizable panels separated by handles (WAI-ARIA APG Window Splitter). Panels and
 * handles must be direct children, in order: Panel, Handle, Panel, …
 */
export function ResizableRoot({
  orientation = 'horizontal',
  sizes: sizesProp,
  onSizesChange,
  onSizesCommit,
  keyboardStep = 10,
  disabled = false,
  children,
  ref,
  ...props
}: ResizableRootProps) {
  const baseId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const composedRef = useComposedRefs(ref, rootRef);

  // Panel settings are read from the children's props, so the root knows every panel's limits
  // and default size on its first render.
  const panels = Children.toArray(children).filter(
    (child): child is ReactElement<ResizablePanelProps> => isValidElement(child) && child.type === ResizablePanel,
  );
  const limits: PanelLimits[] = panels.map(({ props: panel }) => ({
    minSize: panel.minSize ?? 0,
    maxSize: panel.maxSize ?? 100,
    collapsible: !!panel.collapsible,
    collapsedSize: panel.collapsedSize ?? 0,
  }));
  const panelIds = panels.map((panel, index) => panel.props.id ?? `${baseId}panel-${index}`);

  const [defaultSizes] = useState(() => {
    const given = panels.map((panel) => panel.props.defaultSize);
    const unset = given.filter((size) => size === undefined).length;
    const remaining = 100 - given.reduce<number>((total, size) => total + (size ?? 0), 0);
    return given.map((size) => size ?? (unset ? remaining / unset : 0));
  });
  const [sizes, setSizes] = useControllableState({ prop: sizesProp, defaultProp: defaultSizes, onChange: onSizesChange });
  const latest = useRef(sizes);
  latest.current = sizes;
  // The size each collapsed panel had before it collapsed, to restore it.
  const beforeCollapse = useRef<Record<number, number>>({});

  const limitsRef = useRef(limits);
  limitsRef.current = limits;

  const resize = useCallback(
    (index: number, target: number) => {
      const current = latest.current;
      const next = current[index + 1];
      if (next === undefined) return;
      const own = limitsRef.current[index];
      const neighbour = limitsRef.current[index + 1];
      const pair = current[index] + next;
      // The panel can grow until its neighbour hits its minimum, and shrink until it hits its own.
      const low = Math.max(own.minSize, pair - neighbour.maxSize);
      const high = Math.min(own.maxSize, pair - neighbour.minSize);
      let size = clamp(target, low, high);
      // A collapsible panel dragged well below its minimum snaps shut.
      if (own.collapsible && target < own.minSize / 2) size = own.collapsedSize;
      if (round(size) === round(current[index])) return;
      const updated = current.map((value, position) =>
        position === index ? round(size) : position === index + 1 ? round(pair - size) : value,
      );
      latest.current = updated;
      setSizes(updated);
    },
    [setSizes],
  );

  const commit = useCallback(() => onSizesCommit?.(latest.current), [onSizesCommit]);

  const toggleCollapse = useCallback(
    (index: number) => {
      const own = limitsRef.current[index];
      if (!own?.collapsible) return;
      const size = latest.current[index];
      if (size <= own.collapsedSize) {
        resize(index, beforeCollapse.current[index] ?? Math.max(own.minSize, 100 / latest.current.length));
      } else {
        beforeCollapse.current[index] = size;
        resize(index, own.collapsedSize);
      }
      commit();
    },
    [resize, commit],
  );

  const context = useMemo(
    () => ({ orientation, sizes, limits, panelIds, disabled, keyboardStep, rootRef, resize, commit, toggleCollapse }),
    // limits and panelIds are derived from children each render; compare their contents.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [orientation, sizes, JSON.stringify(limits), panelIds.join(), disabled, keyboardStep, resize, commit, toggleCollapse],
  );

  let panelIndex = -1;
  return (
    <ResizableProvider value={context}>
      <div data-orientation={orientation} data-disabled={dataFlag(disabled)} {...props} ref={composedRef}>
        {Children.map(children, (child) => {
          if (!isValidElement(child)) return child;
          if (child.type === ResizablePanel) panelIndex += 1;
          return <IndexContext.Provider value={panelIndex}>{child}</IndexContext.Provider>;
        })}
      </div>
    </ResizableProvider>
  );
}

const PANEL_SETTINGS = new Set(['defaultSize', 'minSize', 'maxSize', 'collapsible', 'collapsedSize']);
const withoutPanelSettings = (props: ResizablePanelProps) =>
  Object.fromEntries(Object.entries(props).filter(([key]) => !PANEL_SETTINGS.has(key))) as ComponentPropsWithRef<'div'>;

export interface ResizablePanelProps extends ComponentPropsWithRef<'div'> {
  /** Initial size in percent. Panels without one share the remaining space. */
  defaultSize?: number;
  /** @default 0 */
  minSize?: number;
  /** @default 100 */
  maxSize?: number;
  /** Lets the panel collapse: Enter on the handle after it, or dragging well below `minSize`. */
  collapsible?: boolean;
  /** Size when collapsed, in percent. @default 0 */
  collapsedSize?: number;
}

/**
 * One panel. Its size is a flex ratio, so handles of any width never overflow the group.
 * `data-state` is `collapsed` or `expanded` for collapsible panels.
 */
export function ResizablePanel(panelProps: ResizablePanelProps) {
  // The root reads the size settings from these props; only the rest reach the element.
  const { style, ...props } = withoutPanelSettings(panelProps);
  const context = useResizableContext('Resizable.Panel');
  const index = useContext(IndexContext);
  const size = context.sizes[index] ?? 0;
  const limits = context.limits[index];
  return (
    <div
      id={context.panelIds[index]}
      data-orientation={context.orientation}
      data-state={limits?.collapsible ? (size <= limits.collapsedSize ? 'collapsed' : 'expanded') : undefined}
      data-size={Math.round(size)}
      {...props}
      style={{ flexGrow: size, flexShrink: 1, flexBasis: 0, minWidth: 0, minHeight: 0, overflow: 'hidden', ...style }}
    />
  );
}

export interface ResizableHandleProps extends ComponentPropsWithRef<'div'> {
  /** Accessible name: say what the handle resizes ("Resize file list"). */
  'aria-label'?: string;
}

/**
 * The separator between two panels: `role="separator"`, focusable. Arrow keys resize, Home and
 * End move to the limits, Enter collapses or restores a collapsible panel, and it can be dragged.
 * `data-dragging` is set while dragging.
 */
export function ResizableHandle({ onKeyDown, onPointerDown, onPointerMove, onPointerUp, onDoubleClick, ...props }: ResizableHandleProps) {
  const context = useResizableContext('Resizable.Handle');
  const index = useContext(IndexContext);
  const [dragging, setDragging] = useState(false);
  const start = useRef({ pointer: 0, size: 0, total: 1 });

  const size = context.sizes[index] ?? 0;
  const own = context.limits[index];
  const neighbour = context.limits[index + 1];
  const pair = size + (context.sizes[index + 1] ?? 0);
  const low = own && neighbour ? Math.max(own.collapsible ? own.collapsedSize : own.minSize, pair - neighbour.maxSize) : 0;
  const high = own && neighbour ? Math.min(own.maxSize, pair - neighbour.minSize) : 100;
  const horizontal = context.orientation === 'horizontal';

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (context.disabled) return;
    const rtl = horizontal && getComputedStyle(event.currentTarget).direction === 'rtl';
    const grow = horizontal ? (rtl ? 'ArrowLeft' : 'ArrowRight') : 'ArrowDown';
    const shrink = horizontal ? (rtl ? 'ArrowRight' : 'ArrowLeft') : 'ArrowUp';
    const moves: Record<string, number> = {
      [grow]: size + context.keyboardStep,
      [shrink]: size - context.keyboardStep,
      Home: low,
      End: high,
    };
    if (event.key === 'Enter') {
      event.preventDefault();
      context.toggleCollapse(index);
      return;
    }
    if (!(event.key in moves)) return;
    event.preventDefault();
    // Arrow keys stop at the minimum; only Enter or Home collapse.
    const target = event.key === 'Home' ? low : Math.max(moves[event.key], own?.minSize ?? 0);
    context.resize(index, target);
    context.commit();
  };

  return (
    <div
      role="separator"
      tabIndex={context.disabled ? undefined : 0}
      aria-orientation={horizontal ? 'vertical' : 'horizontal'}
      aria-controls={context.panelIds[index]}
      aria-valuenow={Math.round(size)}
      aria-valuemin={Math.round(low)}
      aria-valuemax={Math.round(high)}
      aria-disabled={context.disabled || undefined}
      data-orientation={context.orientation}
      data-dragging={dataFlag(dragging)}
      data-disabled={dataFlag(context.disabled)}
      {...props}
      onKeyDown={composeEventHandlers(onKeyDown, handleKeyDown)}
      onDoubleClick={composeEventHandlers(onDoubleClick, () => !context.disabled && context.toggleCollapse(index))}
      onPointerDown={composeEventHandlers(onPointerDown, (event: ReactPointerEvent<HTMLDivElement>) => {
        if (context.disabled || event.button !== 0) return;
        const box = context.rootRef.current?.getBoundingClientRect();
        const total = (horizontal ? box?.width : box?.height) || 1;
        start.current = { pointer: horizontal ? event.clientX : event.clientY, size, total };
        event.currentTarget.setPointerCapture?.(event.pointerId);
        event.currentTarget.focus({ preventScroll: true });
        setDragging(true);
        event.preventDefault();
      })}
      onPointerMove={composeEventHandlers(onPointerMove, (event: ReactPointerEvent<HTMLDivElement>) => {
        if (!dragging) return;
        const rtl = horizontal && getComputedStyle(event.currentTarget).direction === 'rtl';
        const moved = (horizontal ? event.clientX : event.clientY) - start.current.pointer;
        const delta = ((rtl ? -moved : moved) / start.current.total) * 100;
        context.resize(index, start.current.size + delta);
      })}
      onPointerUp={composeEventHandlers(onPointerUp, (event: ReactPointerEvent<HTMLDivElement>) => {
        if (!dragging) return;
        event.currentTarget.releasePointerCapture?.(event.pointerId);
        setDragging(false);
        context.commit();
      })}
    />
  );
}

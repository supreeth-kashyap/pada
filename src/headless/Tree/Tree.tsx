import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ComponentPropsWithRef,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import { createPartContext } from '../utils/context';
import { composeEventHandlers, dataFlag, openState } from '../utils/events';
import { focusElement } from '../utils/focus';
import { findNextIndex, findTypeaheadIndex } from '../utils/navigation';
import { useComposedRefs } from '../utils/refs';
import { useControllableState } from '../utils/useControllableState';
import { useTypeahead } from '../utils/useTypeahead';

type SelectionMode = 'single' | 'multiple' | 'none';

interface TreeContextValue {
  expanded: readonly string[];
  setExpanded: (value: string, open: boolean) => void;
  selectionMode: SelectionMode;
  selected: readonly string[];
  select: (value: string) => void;
  focusedValue: string | null;
  setFocusedValue: (value: string) => void;
}

const [TreeProvider, useTreeContext] = createPartContext<TreeContextValue>('Tree.Root');

interface TreeItemContextValue {
  value: string;
  level: number;
  expandable: boolean;
  open: boolean;
  selected: boolean;
  disabled: boolean;
  labelId: string;
  groupId: string;
  toggle: () => void;
}

const [TreeItemProvider, useTreeItemContext] = createPartContext<TreeItemContextValue>('Tree.Item');
const LevelContext = createContext(1);

const EMPTY: string[] = [];

export interface TreeRootProps extends Omit<ComponentPropsWithRef<'ul'>, 'defaultValue' | 'onChange'> {
  /** Controlled expanded items. */
  expanded?: string[];
  /** Initially expanded items when uncontrolled. */
  defaultExpanded?: string[];
  /** Called with the expanded items. */
  onExpandedChange?: (expanded: string[]) => void;
  /** `single` (default), `multiple` (Space or click toggles items) or `none` (navigation only). */
  selectionMode?: SelectionMode;
  /** Controlled selected items. */
  value?: string[];
  /** Initially selected items when uncontrolled. */
  defaultValue?: string[];
  /** Called with the selected items. */
  onValueChange?: (value: string[]) => void;
}

/** A tree of items. WAI-ARIA APG: Tree View. Name it with `aria-label` or `aria-labelledby`. */
export function TreeRoot({
  expanded: expandedProp,
  defaultExpanded = EMPTY,
  onExpandedChange,
  selectionMode = 'single',
  value: valueProp,
  defaultValue = EMPTY,
  onValueChange,
  ref,
  onKeyDown,
  children,
  ...props
}: TreeRootProps) {
  const [expanded, setExpandedList] = useControllableState({ prop: expandedProp, defaultProp: defaultExpanded, onChange: onExpandedChange });
  const [selected, setSelected] = useControllableState({ prop: valueProp, defaultProp: defaultValue, onChange: onValueChange });
  const [focusedValue, setFocusedValue] = useState<string | null>(null);
  const rootRef = useRef<HTMLUListElement>(null);
  const composedRef = useComposedRefs(ref, rootRef);
  const typeahead = useTypeahead();

  const setExpanded = useCallback(
    (item: string, open: boolean) => {
      if (open === expanded.includes(item)) return;
      setExpandedList(open ? [...expanded, item] : expanded.filter((value) => value !== item));
    },
    [expanded, setExpandedList],
  );

  const select = useCallback(
    (item: string) => {
      if (selectionMode === 'none') return;
      if (selectionMode === 'single') return setSelected([item]);
      setSelected(selected.includes(item) ? selected.filter((value) => value !== item) : [...selected, item]);
    },
    [selectionMode, selected, setSelected],
  );

  // One item is in the tab order: the focused one, else the first selected, else the first.
  // Re-checked when the items change, in case the focused one went away.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || (focusedValue !== null && root.querySelector(`[role="treeitem"][data-value="${CSS.escape(focusedValue)}"]`))) return;
    const items = getVisibleItems(root);
    const fallback = items.find((item) => item.dataset.value && selected.includes(item.dataset.value)) ?? items[0];
    if (fallback?.dataset.value) setFocusedValue(fallback.dataset.value);
  }, [focusedValue, selected, expanded, children]);

  const context = useMemo(
    () => ({ expanded, setExpanded, selectionMode, selected, select, focusedValue, setFocusedValue }),
    [expanded, setExpanded, selectionMode, selected, select, focusedValue, setFocusedValue],
  );

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLUListElement>) => {
    const root = event.currentTarget;
    const current = (event.target as HTMLElement).closest<HTMLElement>('[role="treeitem"]');
    if (!current || current.closest('[role="tree"]') !== root) return;
    const value = current.dataset.value!;
    const items = getVisibleItems(root);
    const index = items.indexOf(current);
    const navigable = items.map((item) => ({ label: itemLabel(item), disabled: false }));
    const isExpandable = current.hasAttribute('aria-expanded');
    const isOpen = current.getAttribute('aria-expanded') === 'true';
    const isDisabled = current.getAttribute('aria-disabled') === 'true';
    const focus = (element: HTMLElement | undefined | null) => {
      if (!element?.dataset.value) return;
      setFocusedValue(element.dataset.value);
      focusElement(element);
    };

    const steps: Record<string, () => void> = {
      ArrowDown: () => focus(items[findNextIndex(navigable, index, 'next')]),
      ArrowUp: () => focus(items[findNextIndex(navigable, index, 'previous')]),
      Home: () => focus(items[0]),
      End: () => focus(items[items.length - 1]),
      ArrowRight: () => {
        if (isExpandable && !isOpen) setExpanded(value, true);
        else if (isOpen) focus(getChildItems(current)[0]);
      },
      ArrowLeft: () => {
        if (isOpen) setExpanded(value, false);
        else focus(current.parentElement?.closest<HTMLElement>('[role="treeitem"]'));
      },
      Enter: () => !isDisabled && (selectionMode === 'none' && isExpandable ? setExpanded(value, !isOpen) : select(value)),
      ' ': () => !isDisabled && select(value),
      '*': () => {
        // Expand every sibling of the focused item.
        const siblings = Array.from(current.parentElement?.children ?? []).filter(
          (sibling): sibling is HTMLElement => sibling instanceof HTMLElement && sibling.hasAttribute('aria-expanded'),
        );
        setExpandedList([...new Set([...expanded, ...siblings.map((sibling) => sibling.dataset.value!)])]);
      },
    };
    const step = steps[event.key];
    if (step) {
      event.preventDefault();
      step();
      return;
    }
    const search = typeahead(event);
    if (search !== null) {
      event.preventDefault();
      focus(items[findTypeaheadIndex(navigable, index, search)]);
    }
  };

  return (
    <TreeProvider value={context}>
      <ul
        role="tree"
        aria-multiselectable={selectionMode === 'multiple' || undefined}
        {...props}
        ref={composedRef}
        onKeyDown={composeEventHandlers(onKeyDown, handleKeyDown)}
      >
        {children}
      </ul>
    </TreeProvider>
  );
}

/** Rendered tree items of this tree, top to bottom (collapsed groups render no items). */
const getVisibleItems = (root: HTMLElement) =>
  Array.from(root.querySelectorAll<HTMLElement>('[role="treeitem"]')).filter((item) => item.closest('[role="tree"]') === root);

const getChildItems = (item: HTMLElement) =>
  Array.from(item.querySelectorAll<HTMLElement>(':scope > [role="group"] > [role="treeitem"]'));

const itemLabel = (item: HTMLElement) => {
  const labelId = item.getAttribute('aria-labelledby');
  return (labelId && item.ownerDocument.getElementById(labelId)?.textContent) || '';
};

export interface TreeItemProps extends Omit<ComponentPropsWithRef<'li'>, 'value'> {
  /** Identifies the item in `expanded` and `value`. */
  value: string;
  /** The item can expand (it has, or will load, child items). */
  expandable?: boolean;
  disabled?: boolean;
}

/**
 * One item (`role="treeitem"`). Put a `Tree.ItemRow` (with a `Tree.ItemLabel`) inside, and a
 * `Tree.Group` of child items when it is `expandable`.
 */
export function TreeItem({ value, expandable = false, disabled = false, ...props }: TreeItemProps) {
  const tree = useTreeContext('Tree.Item');
  const level = useContext(LevelContext);
  const labelId = useId();
  const groupId = useId();
  const open = expandable && tree.expanded.includes(value);
  const selected = tree.selected.includes(value);
  const { setExpanded } = tree;
  const toggle = useCallback(() => setExpanded(value, !open), [setExpanded, value, open]);
  const item = useMemo(
    () => ({ value, level, expandable, open, selected, disabled, labelId, groupId, toggle }),
    [value, level, expandable, open, selected, disabled, labelId, groupId, toggle],
  );
  return (
    <TreeItemProvider value={item}>
      <li
        role="treeitem"
        aria-level={level}
        aria-expanded={expandable ? open : undefined}
        aria-selected={tree.selectionMode === 'none' ? undefined : selected}
        aria-disabled={disabled || undefined}
        aria-labelledby={labelId}
        tabIndex={tree.focusedValue === value ? 0 : -1}
        data-value={value}
        data-state={expandable ? openState(open) : undefined}
        data-selected={dataFlag(selected)}
        data-disabled={dataFlag(disabled)}
        {...props}
        onFocus={composeEventHandlers(props.onFocus, (event) => {
          // Focus bubbles from nested items; only the item itself counts.
          if (event.target === event.currentTarget && tree.focusedValue !== value) tree.setFocusedValue(value);
        })}
      />
    </TreeItemProvider>
  );
}

/**
 * The item's visible row. Clicking it focuses and selects the item (with `selectionMode="none"`
 * it toggles an expandable item instead). It sets `--pada-tree-level` for indentation.
 */
export function TreeItemRow({ onClick, style, ...props }: ComponentPropsWithRef<'div'>) {
  const tree = useTreeContext('Tree.ItemRow');
  const item = useTreeItemContext('Tree.ItemRow');
  return (
    <div
      data-level={item.level}
      data-state={item.expandable ? openState(item.open) : undefined}
      data-selected={dataFlag(item.selected)}
      data-disabled={dataFlag(item.disabled)}
      {...props}
      style={{ ['--pada-tree-level' as string]: item.level - 1, ...style }}
      onClick={composeEventHandlers(onClick, (event) => {
        const element = (event.currentTarget as HTMLElement).closest<HTMLElement>('[role="treeitem"]');
        tree.setFocusedValue(item.value);
        focusElement(element);
        if (item.disabled) return;
        if (tree.selectionMode === 'none' && item.expandable) item.toggle();
        else tree.select(item.value);
      })}
    />
  );
}

/** The expand/collapse indicator (a chevron). Clicking it toggles without selecting. */
export function TreeItemIndicator({ onClick, ...props }: ComponentPropsWithRef<'span'>) {
  const item = useTreeItemContext('Tree.ItemIndicator');
  return (
    <span
      aria-hidden="true"
      data-state={item.expandable ? openState(item.open) : undefined}
      data-expandable={dataFlag(item.expandable)}
      {...props}
      onClick={composeEventHandlers(onClick, (event) => {
        if (!item.expandable || item.disabled) return;
        event.stopPropagation();
        item.toggle();
      })}
    />
  );
}

/** The item's name; labels the tree item. */
export function TreeItemLabel(props: ComponentPropsWithRef<'span'>) {
  const item = useTreeItemContext('Tree.ItemLabel');
  return <span id={item.labelId} {...props} />;
}

/**
 * The child items (`role="group"`). Rendered only while the item is expanded. Sets
 * `--pada-tree-level` to its parent's level (from 0), e.g. to draw a guide line.
 */
export function TreeGroup({ style, ...props }: ComponentPropsWithRef<'ul'>) {
  const item = useTreeItemContext('Tree.Group');
  if (!item.open) return null;
  return (
    <LevelContext value={item.level + 1}>
      <ul role="group" id={item.groupId} {...props} style={{ ['--pada-tree-level' as string]: item.level - 1, ...style }} />
    </LevelContext>
  );
}

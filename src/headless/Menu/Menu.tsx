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
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type RefObject,
} from 'react';
import { createPartContext } from '../utils/context';
import { composeEventHandlers, dataFlag, openState } from '../utils/events';
import { useFloatingPosition, type FloatingOptions } from '../utils/floating';
import { focusElement, useFocusScope, type AutoFocusEvent } from '../utils/focus';
import { findNextIndex, findTypeaheadIndex, keyToNavigation } from '../utils/navigation';
import { Portal, type PortalProps } from '../utils/Portal';
import { useComposedRefs } from '../utils/refs';
import { Slot } from '../utils/Slot';
import { useControllableState } from '../utils/useControllableState';
import { useDismissable, type DismissEvent } from '../utils/useDismissable';
import { usePresence } from '../utils/usePresence';
import { useTypeahead } from '../utils/useTypeahead';

type FocusTarget = 'first' | 'last' | 'content';

/** A point or box to position a menu against, instead of its trigger (Floating UI virtual element). */
export interface MenuAnchor {
  getBoundingClientRect: () => DOMRect;
}

interface MenuContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  /** Closes this menu and every menu above it in the chain (an item was chosen). */
  closeAll: () => void;
  contentId: string;
  triggerId: string;
  trigger: HTMLElement | null;
  setTrigger: (element: HTMLElement | null) => void;
  /** What receives focus when the content mounts: set by how the menu was opened. */
  focusOnOpen: RefObject<FocusTarget>;
  isSub: boolean;
  dir: 'ltr' | 'rtl';
  /** Set for context menus: the menu opens at this point, not at its trigger. */
  anchor: MenuAnchor | null;
}

const [MenuProvider, useMenuContext] = createPartContext<MenuContextValue>('DropdownMenu.Root');

const ITEM_SELECTOR = '[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]';

/** Items that belong to this menu (not to a nested submenu), in DOM order. */
const getItems = (content: HTMLElement) =>
  Array.from(content.querySelectorAll<HTMLElement>(ITEM_SELECTOR)).filter(
    (item) => item.closest('[role="menu"]') === content,
  );

const itemLabel = (item: HTMLElement) => item.dataset.textValue ?? item.textContent ?? '';

function useMenuState(open: boolean | undefined, defaultOpen: boolean, onOpenChange?: (open: boolean) => void) {
  const [isOpen, setOpen] = useControllableState({ prop: open, defaultProp: defaultOpen, onChange: onOpenChange });
  const [trigger, setTrigger] = useState<HTMLElement | null>(null);
  const focusOnOpen = useRef<FocusTarget>('content');
  const baseId = useId();
  return { open: isOpen, setOpen, trigger, setTrigger, focusOnOpen, contentId: `${baseId}menu`, triggerId: `${baseId}trigger` };
}

// ── Root ───────────────────────────────────────────────────────────────────────────────────
export interface DropdownMenuRootProps {
  children?: ReactNode;
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Called when the menu opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Reading direction, for arrow keys and submenu placement. @default 'ltr' */
  dir?: 'ltr' | 'rtl';
}

/** Holds the state for a menu button. Renders no element. WAI-ARIA APG: Menu Button. */
export function DropdownMenuRoot({ children, open, defaultOpen = false, onOpenChange, dir = 'ltr' }: DropdownMenuRootProps) {
  const state = useMenuState(open, defaultOpen, onOpenChange);
  const { setOpen } = state;
  const closeAll = useCallback(() => setOpen(false), [setOpen]);
  const value = useMemo(() => ({ ...state, closeAll, isSub: false, dir, anchor: null }), [state.open, state.trigger, closeAll, dir]); // eslint-disable-line react-hooks/exhaustive-deps
  return <MenuProvider value={value}>{children}</MenuProvider>;
}

export interface DropdownMenuTriggerProps extends ComponentPropsWithRef<'button'> {
  /** Merge the trigger behaviour onto its only child instead of rendering a `<button>`. */
  asChild?: boolean;
}

/** Opens the menu: on click, or with Enter, Space, ArrowDown (first item) and ArrowUp (last item). */
export function DropdownMenuTrigger({ asChild, ref, onClick, onKeyDown, disabled, ...props }: DropdownMenuTriggerProps) {
  const context = useMenuContext('DropdownMenu.Trigger');
  const composedRef = useComposedRefs(ref, context.setTrigger);
  const Component = asChild ? Slot : 'button';
  const openWith = (target: FocusTarget) => {
    context.focusOnOpen.current = target;
    context.setOpen(true);
  };
  return (
    <Component
      type={asChild ? undefined : 'button'}
      id={context.triggerId}
      aria-haspopup="menu"
      aria-expanded={context.open}
      aria-controls={context.open ? context.contentId : undefined}
      data-state={openState(context.open)}
      data-disabled={dataFlag(disabled)}
      disabled={disabled}
      {...props}
      ref={composedRef}
      onClick={composeEventHandlers(onClick, (event) => {
        // detail is 0 for clicks synthesised from Enter/Space, which onKeyDown already handled.
        if (event.detail === 0) return;
        if (context.open) context.setOpen(false);
        else openWith('content');
      })}
      onKeyDown={composeEventHandlers(onKeyDown, (event) => {
        if (['Enter', ' ', 'ArrowDown'].includes(event.key)) {
          event.preventDefault();
          openWith('first');
        } else if (event.key === 'ArrowUp') {
          event.preventDefault();
          openWith('last');
        }
      })}
    />
  );
}

export type DropdownMenuPortalProps = PortalProps;

/** Renders the content (or a submenu's content) into `document.body`. */
export function DropdownMenuPortal(props: DropdownMenuPortalProps) {
  return <Portal {...props} />;
}

// ── Content ────────────────────────────────────────────────────────────────────────────────
export interface DropdownMenuContentProps extends ComponentPropsWithRef<'div'>, FloatingOptions {
  /** Keep mounted while closed, for animation libraries that manage presence themselves. */
  forceMount?: boolean;
  /** Wrap focus from the last item to the first and back. @default true */
  loop?: boolean;
  /** Called when focus returns to the trigger on close. Prevent it to focus something else. */
  onCloseAutoFocus?: (event: AutoFocusEvent) => void;
  /** Called on Escape. Prevent it to keep the menu open. */
  onEscapeKeyDown?: (event: DismissEvent<KeyboardEvent>) => void;
  /** Called on a pointer-down outside. Prevent it to keep the menu open. */
  onPointerDownOutside?: (event: DismissEvent<PointerEvent>) => void;
  /** Called on any interaction outside. Prevent it to keep the menu open. */
  onInteractOutside?: (event: DismissEvent<PointerEvent | FocusEvent>) => void;
}

/** The menu: `role="menu"`, with arrow-key, Home/End and type-ahead navigation. */
export function DropdownMenuContent({ forceMount, ref, ...props }: DropdownMenuContentProps) {
  const context = useMenuContext('DropdownMenu.Content');
  const presence = usePresence(context.open);
  const composedRef = useComposedRefs(ref, presence.ref);
  if (!(forceMount || presence.isPresent)) return null;
  return <MenuContentImpl {...props} ref={composedRef} context={context} />;
}

function MenuContentImpl({
  context,
  ref,
  side,
  align,
  sideOffset,
  alignOffset,
  avoidCollisions,
  collisionPadding,
  arrowPadding,
  hideWhenDetached,
  loop = true,
  onCloseAutoFocus,
  onEscapeKeyDown,
  onPointerDownOutside,
  onInteractOutside,
  onKeyDown,
  onPointerMove,
  style,
  ...props
}: Omit<DropdownMenuContentProps, 'forceMount'> & { context: MenuContextValue }) {
  const { open, setOpen, trigger, isSub, dir, focusOnOpen, anchor } = context;
  const contentRef = useRef<HTMLDivElement>(null);
  const floating = useFloatingPosition(open, {
    side: side ?? (isSub ? (dir === 'rtl' ? 'left' : 'right') : 'bottom'),
    align: align ?? 'start',
    sideOffset: sideOffset ?? (isSub ? 0 : anchor ? 2 : 4),
    alignOffset: alignOffset ?? (isSub ? -4 : 0),
    avoidCollisions,
    collisionPadding,
    arrowPadding,
    hideWhenDetached,
  });
  const composedRef = useComposedRefs(ref, contentRef, floating.refs.setFloating);
  const { setReference } = floating.refs;
  useLayoutEffect(() => {
    setReference(anchor ?? trigger);
  }, [anchor, trigger, setReference]);

  useDismissable(contentRef, {
    enabled: open,
    onDismiss: useCallback(() => setOpen(false), [setOpen]),
    onEscapeKeyDown,
    onPointerDownOutside,
    dismissOnFocusOutside: true,
    onInteractOutside: (event) => {
      onInteractOutside?.(event);
      if (event.target instanceof Node && trigger?.contains(event.target)) event.preventDefault();
    },
  });
  useFocusScope(contentRef, {
    trapped: false,
    onMountAutoFocus: (event) => {
      event.preventDefault();
      const content = contentRef.current;
      if (!content) return;
      const items = getItems(content).filter((item) => !item.hasAttribute('data-disabled'));
      const target = focusOnOpen.current === 'first' ? items[0] : focusOnOpen.current === 'last' ? items[items.length - 1] : null;
      focusElement(target ?? content);
      focusOnOpen.current = 'content';
    },
    onUnmountAutoFocus: onCloseAutoFocus,
  });

  const typeahead = useTypeahead();
  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const content = contentRef.current;
    if (!content) return;
    // Keys inside a nested submenu's content bubble through React's tree; leave them to it.
    if (!(event.target as HTMLElement).closest || (event.target as HTMLElement).closest('[role="menu"]') !== content) return;
    if (event.key === 'Tab') {
      event.preventDefault();
      context.closeAll();
      return;
    }
    const items = getItems(content);
    const descriptors = items.map((item) => ({ label: itemLabel(item), disabled: item.hasAttribute('data-disabled') }));
    const current = items.indexOf(document.activeElement as HTMLElement);
    const step = keyToNavigation(event.key, 'vertical', dir);
    if (step) {
      event.preventDefault();
      const next = findNextIndex(descriptors, current, step, { loop });
      if (next !== -1) focusElement(items[next]);
      return;
    }
    const search = typeahead(event);
    if (search !== null) {
      const next = findTypeaheadIndex(descriptors, current, search);
      if (next !== -1 && next !== current) focusElement(items[next]);
    }
  };

  return (
    <div
      id={context.contentId}
      role="menu"
      aria-orientation="vertical"
      // A context menu's trigger is an area, not a button that names the menu.
      aria-labelledby={anchor ? undefined : context.triggerId}
      tabIndex={-1}
      data-state={openState(open)}
      data-side={floating.side}
      data-align={floating.align}
      data-pada-layer=""
      {...props}
      ref={composedRef}
      style={{ ...floating.floatingStyles, ...style }}
      onKeyDown={composeEventHandlers(onKeyDown, handleKeyDown)}
      onPointerMove={composeEventHandlers(onPointerMove, (event) => {
        // Moving the pointer off the items (onto padding or a label) clears the highlight.
        if (event.target === contentRef.current && document.activeElement !== contentRef.current) {
          focusElement(contentRef.current);
        }
      })}
    />
  );
}

// ── Items ──────────────────────────────────────────────────────────────────────────────────
/** Event passed to `onSelect`. Call `preventDefault()` to keep the menu open. */
export interface MenuSelectEvent {
  defaultPrevented: boolean;
  preventDefault(): void;
}

interface ItemBehaviourProps {
  disabled?: boolean;
  onSelect?: (event: MenuSelectEvent) => void;
  textValue?: string;
}

function useItemBehaviour(
  { disabled, onSelect, textValue }: ItemBehaviourProps,
  props: ComponentPropsWithRef<'div'>,
  partName: string,
  closeOnSelect = true,
) {
  const context = useMenuContext(partName);
  const [highlighted, setHighlighted] = useState(false);
  const select = () => {
    if (disabled) return;
    const event: MenuSelectEvent = {
      defaultPrevented: false,
      preventDefault() {
        event.defaultPrevented = true;
      },
    };
    onSelect?.(event);
    if (closeOnSelect && !event.defaultPrevented) context.closeAll();
  };
  return {
    highlighted,
    itemProps: {
      tabIndex: -1,
      'aria-disabled': disabled || undefined,
      'data-disabled': dataFlag(disabled),
      'data-highlighted': dataFlag(highlighted),
      'data-text-value': textValue,
      ...props,
      onClick: composeEventHandlers(props.onClick, select),
      onKeyDown: composeEventHandlers(props.onKeyDown, (event: ReactKeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          select();
        }
      }),
      onPointerMove: composeEventHandlers(props.onPointerMove, (event: ReactPointerEvent<HTMLDivElement>) => {
        if (disabled || event.pointerType === 'touch') return;
        if (document.activeElement !== event.currentTarget) focusElement(event.currentTarget);
      }),
      onPointerLeave: composeEventHandlers(props.onPointerLeave, (event: ReactPointerEvent<HTMLDivElement>) => {
        // Clear the highlight when the pointer moves to another part of the same menu. Moving
        // into a submenu's content (or off the menu entirely) keeps it, so the submenu stays open.
        const menu = event.currentTarget.closest<HTMLElement>('[role="menu"]');
        const related = event.relatedTarget;
        if (document.activeElement === event.currentTarget && related instanceof Node && menu?.contains(related)) {
          focusElement(menu);
        }
      }),
      onFocus: composeEventHandlers(props.onFocus, () => setHighlighted(true)),
      onBlur: composeEventHandlers(props.onBlur, () => setHighlighted(false)),
    },
  };
}

export interface DropdownMenuItemProps extends Omit<ComponentPropsWithRef<'div'>, 'onSelect'>, ItemBehaviourProps {
  /** Render the item behaviour on your own element (a link, for navigation items). */
  asChild?: boolean;
}

/** An action. Chosen with click, Enter or Space; closes the menu unless `onSelect` prevents it. */
export function DropdownMenuItem({ asChild, disabled, onSelect, textValue, ...props }: DropdownMenuItemProps) {
  const { itemProps } = useItemBehaviour({ disabled, onSelect, textValue }, props, 'DropdownMenu.Item');
  const Component = asChild ? Slot : 'div';
  return <Component role="menuitem" {...itemProps} />;
}

const [ItemIndicatorProvider, useItemIndicatorContext] = createPartContext<{ checked: boolean | 'indeterminate' }>(
  'DropdownMenu.CheckboxItem or DropdownMenu.RadioItem',
);

export interface DropdownMenuCheckboxItemProps extends DropdownMenuItemProps {
  /** Checked state. `'indeterminate'` for mixed. */
  checked?: boolean | 'indeterminate';
  /** Called with the new checked state. */
  onCheckedChange?: (checked: boolean) => void;
}

/** A toggle: `role="menuitemcheckbox"` with `aria-checked`. Closes the menu unless `onSelect` prevents it. */
export function DropdownMenuCheckboxItem({
  asChild,
  checked = false,
  onCheckedChange,
  disabled,
  onSelect,
  textValue,
  ...props
}: DropdownMenuCheckboxItemProps) {
  const { itemProps } = useItemBehaviour(
    {
      disabled,
      textValue,
      onSelect: (event) => {
        onSelect?.(event);
        onCheckedChange?.(checked === 'indeterminate' ? true : !checked);
      },
    },
    props,
    'DropdownMenu.CheckboxItem',
  );
  const Component = asChild ? Slot : 'div';
  return (
    <ItemIndicatorProvider value={{ checked }}>
      <Component
        role="menuitemcheckbox"
        aria-checked={checked === 'indeterminate' ? 'mixed' : checked}
        data-state={checked === 'indeterminate' ? 'indeterminate' : checked ? 'checked' : 'unchecked'}
        {...itemProps}
      />
    </ItemIndicatorProvider>
  );
}

const [RadioGroupProvider, useRadioGroupContext] = createPartContext<{ value?: string; onValueChange?: (value: string) => void }>(
  'DropdownMenu.RadioGroup',
);

export interface DropdownMenuRadioGroupProps extends ComponentPropsWithRef<'div'> {
  /** The checked item's value. */
  value?: string;
  /** Called with the chosen item's value. */
  onValueChange?: (value: string) => void;
}

/** Groups radio items; exactly one is checked. */
export function DropdownMenuRadioGroup({ value, onValueChange, ...props }: DropdownMenuRadioGroupProps) {
  return (
    <RadioGroupProvider value={{ value, onValueChange }}>
      <div role="group" {...props} />
    </RadioGroupProvider>
  );
}

export interface DropdownMenuRadioItemProps extends DropdownMenuItemProps {
  /** This item's value in its RadioGroup. */
  value: string;
}

/** One option in a RadioGroup: `role="menuitemradio"` with `aria-checked`. */
export function DropdownMenuRadioItem({ asChild, value, disabled, onSelect, textValue, ...props }: DropdownMenuRadioItemProps) {
  const group = useRadioGroupContext('DropdownMenu.RadioItem');
  const checked = group.value === value;
  const { itemProps } = useItemBehaviour(
    {
      disabled,
      textValue,
      onSelect: (event) => {
        onSelect?.(event);
        group.onValueChange?.(value);
      },
    },
    props,
    'DropdownMenu.RadioItem',
  );
  const Component = asChild ? Slot : 'div';
  return (
    <ItemIndicatorProvider value={{ checked }}>
      <Component role="menuitemradio" aria-checked={checked} data-state={checked ? 'checked' : 'unchecked'} {...itemProps} />
    </ItemIndicatorProvider>
  );
}

export interface DropdownMenuItemIndicatorProps extends ComponentPropsWithRef<'span'> {
  /** Render even when unchecked (to animate it). */
  forceMount?: boolean;
}

/** Renders its children only while the surrounding checkbox or radio item is checked. */
export function DropdownMenuItemIndicator({ forceMount, ...props }: DropdownMenuItemIndicatorProps) {
  const { checked } = useItemIndicatorContext('DropdownMenu.ItemIndicator');
  if (!forceMount && !checked) return null;
  const state = checked === 'indeterminate' ? 'indeterminate' : checked ? 'checked' : 'unchecked';
  return <span aria-hidden="true" data-state={state} {...props} />;
}

/** A non-focusable heading for a group of items. */
export function DropdownMenuLabel(props: ComponentPropsWithRef<'div'>) {
  return <div {...props} />;
}

/** Groups related items. Label it with `aria-labelledby` pointing at a DropdownMenu.Label. */
export function DropdownMenuGroup(props: ComponentPropsWithRef<'div'>) {
  return <div role="group" {...props} />;
}

/** A divider between groups of items. */
export function DropdownMenuSeparator(props: ComponentPropsWithRef<'div'>) {
  return <div role="separator" aria-orientation="horizontal" {...props} />;
}

// ── Submenus ───────────────────────────────────────────────────────────────────────────────
export interface DropdownMenuSubProps {
  children?: ReactNode;
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Called when the submenu opens or closes. */
  onOpenChange?: (open: boolean) => void;
}

/** A nested menu. Contains a SubTrigger and a SubContent. */
export function DropdownMenuSub({ children, open, defaultOpen = false, onOpenChange }: DropdownMenuSubProps) {
  const parent = useMenuContext('DropdownMenu.Sub');
  const state = useMenuState(open, defaultOpen, onOpenChange);
  // A submenu closes when its parent closes.
  const { setOpen } = state;
  useEffect(() => {
    if (!parent.open) setOpen(false);
  }, [parent.open, setOpen]);
  const value = useMemo(
    () => ({ ...state, closeAll: parent.closeAll, isSub: true, dir: parent.dir, anchor: null }),
    [state.open, state.trigger, parent.closeAll, parent.dir], // eslint-disable-line react-hooks/exhaustive-deps
  );
  return <MenuProvider value={value}>{children}</MenuProvider>;
}

export type DropdownMenuSubTriggerProps = Omit<DropdownMenuItemProps, 'onSelect'>;

/** The item that opens a submenu: on hover, click, Enter, Space or ArrowRight (ArrowLeft in RTL). */
export function DropdownMenuSubTrigger({ asChild, disabled, textValue, ref, ...props }: DropdownMenuSubTriggerProps) {
  const context = useMenuContext('DropdownMenu.SubTrigger');
  const composedRef = useComposedRefs(ref, context.setTrigger);
  const openKey = context.dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
  const openSub = (focus: FocusTarget) => {
    if (disabled) return;
    context.focusOnOpen.current = focus;
    context.setOpen(true);
  };
  const { itemProps } = useItemBehaviour(
    { disabled, textValue, onSelect: () => openSub('first') },
    {
      ...props,
      onKeyDown: composeEventHandlers(props.onKeyDown, (event: ReactKeyboardEvent<HTMLDivElement>) => {
        if (event.key === openKey) {
          event.preventDefault();
          openSub('first');
        }
      }),
      onPointerMove: composeEventHandlers(props.onPointerMove, () => {
        if (!context.open) openSub('content');
      }),
    },
    'DropdownMenu.SubTrigger',
    false,
  );
  const Component = asChild ? Slot : 'div';
  return (
    <Component
      role="menuitem"
      id={context.triggerId}
      aria-haspopup="menu"
      aria-expanded={context.open}
      aria-controls={context.open ? context.contentId : undefined}
      data-state={openState(context.open)}
      {...itemProps}
      ref={composedRef}
    />
  );
}

export type DropdownMenuSubContentProps = Omit<DropdownMenuContentProps, 'side' | 'align'>;

/** The submenu's content. ArrowLeft (ArrowRight in RTL) and Escape close it and return focus. */
export function DropdownMenuSubContent({ forceMount, ref, onKeyDown, ...props }: DropdownMenuSubContentProps) {
  const context = useMenuContext('DropdownMenu.SubContent');
  const presence = usePresence(context.open);
  const composedRef = useComposedRefs(ref, presence.ref);
  if (!(forceMount || presence.isPresent)) return null;
  const closeKey = context.dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft';
  return (
    <MenuContentImpl
      {...props}
      ref={composedRef}
      context={context}
      onKeyDown={composeEventHandlers(onKeyDown, (event) => {
        if (event.key === closeKey && (event.target as HTMLElement).closest('[role="menu"]') === event.currentTarget) {
          event.preventDefault();
          context.setOpen(false);
        }
      })}
    />
  );
}

// ── Context menu ───────────────────────────────────────────────────────────────────────────
export interface ContextMenuRootProps {
  children?: ReactNode;
  /** Called when the menu opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Reading direction, for arrow keys and submenu placement. @default 'ltr' */
  dir?: 'ltr' | 'rtl';
}

const pointAnchor = (x: number, y: number): MenuAnchor => ({
  getBoundingClientRect: () => DOMRect.fromRect({ x, y, width: 0, height: 0 }),
});

/**
 * Holds the state for a context menu: the same menu as DropdownMenu (use its Content, Item,
 * CheckboxItem, Sub… parts), opened at the pointer from a `ContextMenu.Trigger` area.
 */
export function ContextMenuRoot({ children, onOpenChange, dir = 'ltr' }: ContextMenuRootProps) {
  const state = useMenuState(undefined, false, onOpenChange);
  const [anchor, setAnchor] = useState<MenuAnchor | null>(null);
  const { setOpen } = state;
  const closeAll = useCallback(() => setOpen(false), [setOpen]);
  const openAt = useCallback(
    (x: number, y: number) => {
      setAnchor(pointAnchor(x, y));
      state.focusOnOpen.current = 'first';
      setOpen(true);
    },
    [setOpen, state.focusOnOpen],
  );
  const value = useMemo(
    () => ({ ...state, closeAll, isSub: false, dir, anchor: anchor ?? pointAnchor(0, 0) }),
    [state.open, state.trigger, closeAll, dir, anchor], // eslint-disable-line react-hooks/exhaustive-deps
  );
  return (
    <ContextMenuOpenContext value={openAt}>
      <MenuProvider value={value}>{children}</MenuProvider>
    </ContextMenuOpenContext>
  );
}

const [ContextMenuOpenContext, useContextMenuOpen] = createPartContext<(x: number, y: number) => void>('ContextMenu.Root');

const LONG_PRESS_MS = 600;
const LONG_PRESS_SLOP = 10;

export interface ContextMenuTriggerProps extends ComponentPropsWithRef<'div'> {
  /** Merge the behaviour onto your own element instead of rendering a `<div>`. */
  asChild?: boolean;
  /** Let the browser's own context menu show instead. */
  disabled?: boolean;
}

/**
 * The area that opens the menu: right-click opens it at the pointer, Shift+F10 or the
 * ContextMenu key at the focused element, and a long press on touch screens.
 */
export function ContextMenuTrigger({
  asChild,
  disabled,
  ref,
  onContextMenu,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  ...props
}: ContextMenuTriggerProps) {
  const context = useMenuContext('ContextMenu.Trigger');
  const openAt = useContextMenuOpen('ContextMenu.Trigger');
  const composedRef = useComposedRefs(ref, context.setTrigger);
  const press = useRef<{ x: number; y: number; timer: number } | null>(null);
  const cancelPress = () => {
    if (press.current) window.clearTimeout(press.current.timer);
    press.current = null;
  };
  useEffect(() => cancelPress, []);
  const Component = asChild ? Slot : 'div';
  return (
    <Component
      data-state={openState(context.open)}
      data-disabled={dataFlag(disabled)}
      {...props}
      ref={composedRef}
      onContextMenu={composeEventHandlers(onContextMenu, (event) => {
        if (disabled) return;
        event.preventDefault();
        cancelPress();
        // From the keyboard there is no pointer position: open at the focused element.
        if (event.clientX === 0 && event.clientY === 0) {
          const box = (event.target as HTMLElement).getBoundingClientRect();
          openAt(box.left, box.bottom);
        } else {
          openAt(event.clientX, event.clientY);
        }
      })}
      onPointerDown={composeEventHandlers(onPointerDown, (event: ReactPointerEvent<HTMLElement>) => {
        if (disabled || event.pointerType !== 'touch') return;
        const { clientX: x, clientY: y } = event;
        cancelPress();
        press.current = { x, y, timer: window.setTimeout(() => openAt(x, y), LONG_PRESS_MS) };
      })}
      onPointerMove={composeEventHandlers(onPointerMove, (event: ReactPointerEvent<HTMLElement>) => {
        if (press.current && Math.hypot(event.clientX - press.current.x, event.clientY - press.current.y) > LONG_PRESS_SLOP) cancelPress();
      })}
      onPointerUp={composeEventHandlers(onPointerUp, cancelPress)}
      onPointerCancel={composeEventHandlers(onPointerCancel, cancelPress)}
    />
  );
}

// ── Menubar ────────────────────────────────────────────────────────────────────────────────
interface MenubarContextValue {
  /** The open menu's value, or '' when every menu is closed. */
  value: string;
  setValue: (value: string) => void;
  /** The trigger that takes Tab (roving focus). */
  tabStop: string;
  setTabStop: (value: string) => void;
  dir: 'ltr' | 'rtl';
  loop: boolean;
  rootRef: RefObject<HTMLDivElement | null>;
  /** Each menu's "what to focus when the content mounts" signal, by value. */
  focusTargets: RefObject<Map<string, RefObject<FocusTarget>>>;
}

const [MenubarProvider, useMenubarContext] = createPartContext<MenubarContextValue>('Menubar.Root');
const [MenubarMenuValueProvider, useMenubarMenuValue] = createPartContext<string>('Menubar.Menu');

const getMenubarTriggers = (root: HTMLElement | null) =>
  root ? Array.from(root.querySelectorAll<HTMLElement>('[data-pada-menubar-trigger]')).filter((trigger) => trigger.closest('[role="menubar"]') === root) : [];

/** Opens the menu after (`step` 1) or before (-1) `from`, focusing its first item. */
function openAdjacentMenu(menubar: MenubarContextValue, from: string, step: 1 | -1) {
  const triggers = getMenubarTriggers(menubar.rootRef.current).filter((trigger) => !trigger.hasAttribute('data-disabled'));
  const index = triggers.findIndex((trigger) => trigger.dataset.value === from);
  if (index === -1) return;
  let next = index + step;
  if (next < 0 || next >= triggers.length) {
    if (!menubar.loop) return;
    next = (next + triggers.length) % triggers.length;
  }
  const value = triggers[next].dataset.value ?? '';
  const target = menubar.focusTargets.current.get(value);
  if (target) target.current = 'first';
  menubar.setTabStop(value);
  menubar.setValue(value);
}

export interface MenubarRootProps extends Omit<ComponentPropsWithRef<'div'>, 'defaultValue' | 'dir'> {
  /** Controlled open menu (its `value`), or '' for none. */
  value?: string;
  /** Initially open menu when uncontrolled. @default '' */
  defaultValue?: string;
  /** Called when a menu opens (its value) or every menu closes (''). */
  onValueChange?: (value: string) => void;
  /** Wrap focus from the last menu to the first and back. @default true */
  loop?: boolean;
  /** Reading direction, for arrow keys and submenu placement. @default 'ltr' */
  dir?: 'ltr' | 'rtl';
}

/**
 * A horizontal bar of menus, as in a desktop application (WAI-ARIA APG Menubar). One Tab stop;
 * arrow keys move between menus, and once a menu is open, between open menus.
 */
export function MenubarRoot({ value: valueProp, defaultValue = '', onValueChange, loop = true, dir = 'ltr', ref, ...props }: MenubarRootProps) {
  const [value, setValue] = useControllableState({ prop: valueProp, defaultProp: defaultValue, onChange: onValueChange });
  const [tabStop, setTabStop] = useState('');
  const rootRef = useRef<HTMLDivElement>(null);
  const composedRef = useComposedRefs(ref, rootRef);
  const focusTargets = useRef(new Map<string, RefObject<FocusTarget>>());

  // Until a trigger has been focused, the first enabled one takes Tab.
  useLayoutEffect(() => {
    if (tabStop) return;
    const first = getMenubarTriggers(rootRef.current).find((trigger) => !trigger.hasAttribute('data-disabled'));
    if (first?.dataset.value) setTabStop(first.dataset.value);
  }, [tabStop]);

  const context = useMemo(() => ({ value, setValue, tabStop, setTabStop, dir, loop, rootRef, focusTargets }), [value, setValue, tabStop, dir, loop]);
  return (
    <MenubarProvider value={context}>
      <div role="menubar" aria-orientation="horizontal" dir={dir} {...props} ref={composedRef} />
    </MenubarProvider>
  );
}

export interface MenubarMenuProps {
  children?: ReactNode;
  /** Identifies the menu for `Menubar.Root`'s `value`. Generated when omitted. */
  value?: string;
}

/** One menu in the bar: a Trigger and its Content. Inside it, use the DropdownMenu item parts. */
export function MenubarMenu({ children, value: valueProp }: MenubarMenuProps) {
  const menubar = useMenubarContext('Menubar.Menu');
  const generated = useId();
  const value = valueProp ?? generated;
  const open = menubar.value === value;
  const { setValue } = menubar;
  const setOpen = useCallback((next: boolean) => setValue(next ? value : ''), [setValue, value]);
  const state = useMenuState(open, false, undefined);
  const { focusOnOpen } = state;

  useLayoutEffect(() => {
    const targets = menubar.focusTargets.current;
    targets.set(value, focusOnOpen);
    return () => {
      targets.delete(value);
    };
  }, [menubar.focusTargets, value, focusOnOpen]);

  const closeAll = useCallback(() => setOpen(false), [setOpen]);
  const context = useMemo(
    () => ({ ...state, open, setOpen, closeAll, isSub: false, dir: menubar.dir, anchor: null }),
    [state.trigger, open, setOpen, closeAll, menubar.dir], // eslint-disable-line react-hooks/exhaustive-deps
  );
  return (
    <MenubarMenuValueProvider value={value}>
      <MenuProvider value={context}>{children}</MenuProvider>
    </MenubarMenuValueProvider>
  );
}

export type MenubarTriggerProps = ComponentPropsWithRef<'button'>;

/**
 * The menu's name in the bar: `role="menuitem"` with a popup. Click, Enter, Space or ArrowDown
 * opens it; ArrowLeft and ArrowRight move along the bar; hovering another trigger while a menu
 * is open switches to that menu.
 */
export function MenubarTrigger({ ref, onClick, onKeyDown, onFocus, onPointerEnter, disabled, ...props }: MenubarTriggerProps) {
  const menubar = useMenubarContext('Menubar.Trigger');
  const context = useMenuContext('Menubar.Trigger');
  const value = useMenubarMenuValue('Menubar.Trigger');
  const composedRef = useComposedRefs(ref, context.setTrigger);
  const openWith = (target: FocusTarget) => {
    context.focusOnOpen.current = target;
    context.setOpen(true);
  };
  const moveFocus = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    const triggers = getMenubarTriggers(menubar.rootRef.current);
    const descriptors = triggers.map((trigger) => ({ label: trigger.textContent ?? '', disabled: trigger.hasAttribute('data-disabled') }));
    const step = keyToNavigation(event.key, 'horizontal', menubar.dir);
    if (!step) return false;
    const next = findNextIndex(descriptors, triggers.indexOf(event.currentTarget), step, { loop: menubar.loop });
    if (next !== -1) focusElement(triggers[next]);
    return true;
  };
  return (
    <button
      type="button"
      role="menuitem"
      id={context.triggerId}
      aria-haspopup="menu"
      aria-expanded={context.open}
      aria-controls={context.open ? context.contentId : undefined}
      tabIndex={menubar.tabStop === value ? 0 : -1}
      data-value={value}
      data-state={openState(context.open)}
      data-disabled={dataFlag(disabled)}
      data-pada-menubar-trigger=""
      disabled={disabled}
      {...props}
      ref={composedRef}
      onFocus={composeEventHandlers(onFocus, () => menubar.setTabStop(value))}
      onClick={composeEventHandlers(onClick, (event) => {
        if (event.detail === 0) return;
        if (context.open) context.setOpen(false);
        else openWith('content');
      })}
      onPointerEnter={composeEventHandlers(onPointerEnter, (event: ReactPointerEvent<HTMLButtonElement>) => {
        // Moving across the bar while a menu is open switches menus, as in desktop apps.
        if (disabled || !menubar.value || context.open) return;
        focusElement(event.currentTarget);
        openWith('content');
      })}
      onKeyDown={composeEventHandlers(onKeyDown, (event) => {
        if (['Enter', ' ', 'ArrowDown'].includes(event.key)) {
          event.preventDefault();
          openWith('first');
        } else if (event.key === 'ArrowUp') {
          event.preventDefault();
          openWith('last');
        } else if (moveFocus(event)) {
          event.preventDefault();
        }
      })}
    />
  );
}

export type MenubarContentProps = DropdownMenuContentProps;

/**
 * The open menu. Besides the menu keys, ArrowRight and ArrowLeft open the next or previous
 * menu in the bar (unless they open or close a submenu).
 */
export function MenubarContent({ onKeyDown, ...props }: MenubarContentProps) {
  const menubar = useMenubarContext('Menubar.Content');
  const value = useMenubarMenuValue('Menubar.Content');
  const next = menubar.dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
  const previous = next === 'ArrowRight' ? 'ArrowLeft' : 'ArrowRight';
  return (
    <DropdownMenuContent
      {...props}
      onKeyDown={composeEventHandlers(onKeyDown, (event: ReactKeyboardEvent<HTMLDivElement>) => {
        if (event.key !== next && event.key !== previous) return;
        // Submenu triggers and submenu content handle these keys first and prevent them.
        const inSubmenu = (event.target as HTMLElement).closest('[role="menu"]') !== event.currentTarget;
        if (event.key === previous && inSubmenu) return;
        event.preventDefault();
        openAdjacentMenu(menubar, value, event.key === next ? 1 : -1);
      })}
    />
  );
}

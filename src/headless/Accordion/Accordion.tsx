import {
  useCallback,
  useId,
  useMemo,
  type ComponentPropsWithRef,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import { CollapsibleContent, CollapsibleRoot, CollapsibleTrigger, type CollapsibleContentProps } from '../Collapsible/Collapsible';
import { createPartContext } from '../utils/context';
import { composeEventHandlers, dataFlag, openState } from '../utils/events';
import { focusElement } from '../utils/focus';
import { findNextIndex, keyToNavigation } from '../utils/navigation';
import { Slot } from '../utils/Slot';
import { useControllableState } from '../utils/useControllableState';

type Orientation = 'horizontal' | 'vertical';

interface AccordionContextValue {
  value: string[];
  toggle: (itemValue: string, open: boolean) => void;
  /** False when a single accordion must keep one item open. */
  collapsible: boolean;
  disabled: boolean;
  orientation: Orientation;
}

const [AccordionProvider, useAccordionContext] = createPartContext<AccordionContextValue>('Accordion.Root');

interface AccordionItemContextValue {
  value: string;
  open: boolean;
  disabled: boolean;
  triggerId: string;
}

const [AccordionItemProvider, useAccordionItemContext] = createPartContext<AccordionItemContextValue>('Accordion.Item');

interface AccordionRootBaseProps extends Omit<ComponentPropsWithRef<'div'>, 'defaultValue' | 'dir'> {
  /** Disables every item. */
  disabled?: boolean;
  /** Arrow keys follow the orientation: Up/Down when vertical, Left/Right when horizontal. */
  orientation?: Orientation;
  /** Reading direction, for horizontal arrow keys. */
  dir?: 'ltr' | 'rtl';
}

export interface AccordionSingleProps extends AccordionRootBaseProps {
  /** One item open at a time. */
  type: 'single';
  /** Controlled open item (`''` for none). */
  value?: string;
  /** Initially open item when uncontrolled. */
  defaultValue?: string;
  /** Called with the newly open item (`''` when it closed). */
  onValueChange?: (value: string) => void;
  /** Let the open item close again, leaving none open. @default false */
  collapsible?: boolean;
}

export interface AccordionMultipleProps extends AccordionRootBaseProps {
  /** Any number of items open. */
  type: 'multiple';
  /** Controlled open items. */
  value?: string[];
  /** Initially open items when uncontrolled. */
  defaultValue?: string[];
  /** Called with the open items. */
  onValueChange?: (value: string[]) => void;
}

export type AccordionRootProps = AccordionSingleProps | AccordionMultipleProps;

const EMPTY: string[] = [];

/** A stack of collapsible sections. WAI-ARIA APG: Accordion. */
export function AccordionRoot(props: AccordionRootProps) {
  return props.type === 'multiple' ? <AccordionMultiple {...props} /> : <AccordionSingle {...props} />;
}

function AccordionSingle({ type, value: valueProp, defaultValue = '', onValueChange, collapsible = false, ...rest }: AccordionSingleProps) {
  const [value, setValue] = useControllableState({ prop: valueProp, defaultProp: defaultValue, onChange: onValueChange });
  const toggle = useCallback(
    (itemValue: string, open: boolean) => {
      if (open) setValue(itemValue);
      else if (collapsible) setValue('');
    },
    [setValue, collapsible],
  );
  const list = useMemo(() => (value ? [value] : EMPTY), [value]);
  return <AccordionImpl type={type} value={list} toggle={toggle} collapsible={collapsible} rest={rest} />;
}

function AccordionMultiple({ type, value: valueProp, defaultValue = EMPTY, onValueChange, ...rest }: AccordionMultipleProps) {
  const [value, setValue] = useControllableState({ prop: valueProp, defaultProp: defaultValue, onChange: onValueChange });
  const toggle = useCallback(
    (itemValue: string, open: boolean) =>
      setValue(open ? [...value.filter((item) => item !== itemValue), itemValue] : value.filter((item) => item !== itemValue)),
    [setValue, value],
  );
  return <AccordionImpl type={type} value={value} toggle={toggle} collapsible rest={rest} />;
}

/** Accordion triggers of this root (not of a nested accordion), in DOM order. */
const getTriggers = (root: HTMLElement) =>
  Array.from(root.querySelectorAll<HTMLElement>('[data-pada-accordion-trigger]')).filter(
    (trigger) => trigger.closest('[data-pada-accordion]') === root,
  );

function AccordionImpl({
  type,
  value,
  toggle,
  collapsible,
  rest: { disabled = false, orientation = 'vertical', dir = 'ltr', onKeyDown, ...props },
}: {
  type: 'single' | 'multiple';
  value: string[];
  toggle: (itemValue: string, open: boolean) => void;
  collapsible: boolean;
  rest: AccordionRootBaseProps;
}) {
  const context = useMemo(
    () => ({ value, toggle, collapsible, disabled, orientation }),
    [value, toggle, collapsible, disabled, orientation],
  );
  return (
    <AccordionProvider value={context}>
      <div
        data-pada-accordion=""
        data-type={type}
        data-orientation={orientation}
        data-disabled={dataFlag(disabled)}
        dir={dir}
        {...props}
        onKeyDown={composeEventHandlers(onKeyDown, (event: ReactKeyboardEvent<HTMLDivElement>) => {
          const root = event.currentTarget;
          const target = event.target as HTMLElement;
          if (!target.hasAttribute('data-pada-accordion-trigger') || target.closest('[data-pada-accordion]') !== root) return;
          const step = keyToNavigation(event.key, orientation, dir);
          if (!step) return;
          const triggers = getTriggers(root);
          const items = triggers.map((trigger) => ({ label: trigger.textContent ?? '', disabled: trigger.hasAttribute('data-disabled') }));
          const next = findNextIndex(items, triggers.indexOf(target), step, { loop: true });
          if (next === -1) return;
          event.preventDefault();
          focusElement(triggers[next]);
        })}
      />
    </AccordionProvider>
  );
}

export interface AccordionItemProps extends ComponentPropsWithRef<'div'> {
  /** Identifies the item in the root's `value`. */
  value: string;
  disabled?: boolean;
}

/** One section: a header with its trigger, and the content it shows. */
export function AccordionItem({ value, disabled: disabledProp, ...props }: AccordionItemProps) {
  const context = useAccordionContext('Accordion.Item');
  const open = context.value.includes(value);
  const disabled = context.disabled || !!disabledProp;
  const triggerId = useId();
  const itemContext = useMemo(() => ({ value, open, disabled, triggerId }), [value, open, disabled, triggerId]);
  return (
    <AccordionItemProvider value={itemContext}>
      <CollapsibleRoot
        open={open}
        onOpenChange={(next) => context.toggle(value, next)}
        disabled={disabled}
        data-orientation={context.orientation}
        {...props}
      />
    </AccordionItemProvider>
  );
}

export interface AccordionHeaderProps extends ComponentPropsWithRef<'h3'> {
  /** Merge onto your own heading element (for another level, `<h2>`) instead of rendering `<h3>`. */
  asChild?: boolean;
}

/** The heading that wraps the trigger. Renders an `<h3>`; use `asChild` for another level. */
export function AccordionHeader({ asChild, ...props }: AccordionHeaderProps) {
  const item = useAccordionItemContext('Accordion.Header');
  const Component = asChild ? Slot : 'h3';
  return <Component data-state={openState(item.open)} data-disabled={dataFlag(item.disabled)} {...props} />;
}

export interface AccordionTriggerProps extends ComponentPropsWithRef<'button'> {
  /** Merge the trigger's behaviour onto its only child instead of rendering a `<button>`. */
  asChild?: boolean;
}

/**
 * The button that opens and closes its item. Arrow keys (and Home/End) move between triggers.
 * When a single accordion cannot collapse, the open trigger is `aria-disabled`.
 */
export function AccordionTrigger(props: AccordionTriggerProps) {
  const context = useAccordionContext('Accordion.Trigger');
  const item = useAccordionItemContext('Accordion.Trigger');
  const locked = item.open && !context.collapsible;
  return (
    <CollapsibleTrigger
      id={item.triggerId}
      data-pada-accordion-trigger=""
      data-orientation={context.orientation}
      aria-disabled={locked || undefined}
      {...props}
      onClick={composeEventHandlers(props.onClick, (event) => {
        // The open item of a non-collapsible single accordion stays open.
        if (locked) event.preventDefault();
      })}
    />
  );
}

/** The item's content: a region labelled by its trigger. Animatable while closing. */
export function AccordionContent(props: CollapsibleContentProps) {
  const context = useAccordionContext('Accordion.Content');
  const item = useAccordionItemContext('Accordion.Content');
  return <CollapsibleContent role="region" aria-labelledby={item.triggerId} data-orientation={context.orientation} {...props} />;
}

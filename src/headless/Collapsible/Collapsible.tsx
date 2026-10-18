import { useId, useMemo, type ComponentPropsWithRef } from 'react';
import { createPartContext } from '../utils/context';
import { composeEventHandlers, dataFlag, openState } from '../utils/events';
import { useComposedRefs } from '../utils/refs';
import { Slot } from '../utils/Slot';
import { useControllableState } from '../utils/useControllableState';
import { usePresence } from '../utils/usePresence';

interface CollapsibleContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  disabled: boolean;
  contentId: string;
}

const [CollapsibleProvider, useCollapsibleContext] = createPartContext<CollapsibleContextValue>('Collapsible.Root');

export interface CollapsibleRootProps extends ComponentPropsWithRef<'div'> {
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Called with the new open state. */
  onOpenChange?: (open: boolean) => void;
  /** Stops the trigger from toggling. */
  disabled?: boolean;
}

/** Holds the open state of one disclosure. WAI-ARIA APG: Disclosure. */
export function CollapsibleRoot({ open: openProp, defaultOpen = false, onOpenChange, disabled = false, ...props }: CollapsibleRootProps) {
  const [open, setOpen] = useControllableState({ prop: openProp, defaultProp: defaultOpen, onChange: onOpenChange });
  const contentId = useId();
  const context = useMemo(() => ({ open, setOpen, disabled, contentId }), [open, setOpen, disabled, contentId]);
  return (
    <CollapsibleProvider value={context}>
      <div data-state={openState(open)} data-disabled={dataFlag(disabled)} {...props} />
    </CollapsibleProvider>
  );
}

export interface CollapsibleTriggerProps extends ComponentPropsWithRef<'button'> {
  /** Merge the trigger's behaviour onto its only child instead of rendering a `<button>`. */
  asChild?: boolean;
}

/** The button that shows and hides the content: `aria-expanded`, `aria-controls`. */
export function CollapsibleTrigger({ asChild, onClick, ...props }: CollapsibleTriggerProps) {
  const context = useCollapsibleContext('Collapsible.Trigger');
  const Component = asChild ? Slot : 'button';
  return (
    <Component
      type={asChild ? undefined : 'button'}
      aria-expanded={context.open}
      aria-controls={context.contentId}
      disabled={context.disabled}
      data-state={openState(context.open)}
      data-disabled={dataFlag(context.disabled)}
      {...props}
      onClick={composeEventHandlers(onClick, () => {
        if (!context.disabled) context.setOpen(!context.open);
      })}
    />
  );
}

export interface CollapsibleContentProps extends ComponentPropsWithRef<'div'> {
  /** Keep the children mounted (with `hidden`) while closed, e.g. to preserve form state. */
  forceMount?: boolean;
}

/**
 * The content. It stays in the DOM (with `hidden`) while closed, so `aria-controls` always
 * points somewhere, and stays visible with `data-state="closed"` until its exit transition ends,
 * so the height can animate (the styled skin animates `grid-template-rows`).
 */
export function CollapsibleContent({ forceMount, children, ref, ...props }: CollapsibleContentProps) {
  const context = useCollapsibleContext('Collapsible.Content');
  const presence = usePresence(context.open);
  const composedRef = useComposedRefs(ref, presence.ref);
  return (
    <div
      id={context.contentId}
      hidden={!presence.isPresent}
      data-state={openState(context.open)}
      data-disabled={dataFlag(context.disabled)}
      {...props}
      ref={composedRef}
    >
      {presence.isPresent || forceMount ? children : null}
    </div>
  );
}

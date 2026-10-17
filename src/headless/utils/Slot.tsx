import {
  Children,
  cloneElement,
  isValidElement,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react';
import { composeRefs } from './refs';

export interface SlotProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  ref?: Ref<HTMLElement>;
}

type AnyProps = Record<string, unknown>;

function mergeProps(slotProps: AnyProps, childProps: AnyProps): AnyProps {
  const merged: AnyProps = { ...slotProps, ...childProps };
  for (const key of Object.keys(slotProps)) {
    const slotValue = slotProps[key];
    const childValue = childProps[key];
    if (/^on[A-Z]/.test(key) && typeof slotValue === 'function' && typeof childValue === 'function') {
      // The child's own handler runs first; it can stop Pada's behaviour with preventDefault().
      merged[key] = (event: { defaultPrevented?: boolean }, ...rest: unknown[]) => {
        (childValue as (...args: unknown[]) => void)(event, ...rest);
        if (!event?.defaultPrevented) (slotValue as (...args: unknown[]) => void)(event, ...rest);
      };
    } else if (key === 'style') {
      merged.style = { ...(slotValue as object), ...(childValue as object) };
    } else if (key === 'className') {
      merged.className = [slotValue, childValue].filter(Boolean).join(' ');
    } else if (childValue === undefined) {
      merged[key] = slotValue;
    }
  }
  return merged;
}

/**
 * Renders its only child with the slot's props merged in: event handlers composed, styles and
 * class names combined, refs joined. This powers `asChild` on every headless part, so
 * `<Dialog.Trigger asChild><Link href="…"/></Dialog.Trigger>` gives the link the trigger's
 * behaviour and ARIA without an extra wrapper element.
 */
export function Slot({ children, ref, ...slotProps }: SlotProps) {
  if (!isValidElement(children)) {
    return Children.count(children) > 1 ? Children.only(null) : null;
  }
  const child = children as ReactElement<AnyProps & { ref?: Ref<HTMLElement> }>;
  return cloneElement(child, {
    ...mergeProps(slotProps as AnyProps, child.props),
    ref: ref ? composeRefs(ref, child.props.ref) : child.props.ref,
  });
}

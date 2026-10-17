import { useEffect, useRef, type RefObject } from 'react';

/** Event passed to dismiss callbacks. Call `preventDefault()` to keep the layer open. */
export interface DismissEvent<E extends Event = Event> {
  originalEvent: E;
  target: EventTarget | null;
  defaultPrevented: boolean;
  preventDefault(): void;
}

function createDismissEvent<E extends Event>(originalEvent: E): DismissEvent<E> {
  const event: DismissEvent<E> = {
    originalEvent,
    target: originalEvent.target,
    defaultPrevented: false,
    preventDefault() {
      event.defaultPrevented = true;
    },
  };
  return event;
}

export interface DismissableOptions {
  /** Only listens while true. */
  enabled: boolean;
  /** Called when the layer should close (after the specific callback, unless it prevented it). */
  onDismiss: () => void;
  onEscapeKeyDown?: (event: DismissEvent<KeyboardEvent>) => void;
  onPointerDownOutside?: (event: DismissEvent<PointerEvent>) => void;
  onFocusOutside?: (event: DismissEvent<FocusEvent>) => void;
  /** Called for both pointer-down and focus outside, before the specific callback. */
  onInteractOutside?: (event: DismissEvent<PointerEvent | FocusEvent>) => void;
  /** Close when focus moves outside. Non-modal overlays (popover, menu) want this; dialogs do not. */
  dismissOnFocusOutside?: boolean;
}

// Open layers in the order they opened. Only the top layer reacts to Escape, and a layer
// ignores interactions inside any layer opened after it (a menu inside a dialog, a submenu).
const layers: HTMLElement[] = [];

const isInsideLayerAbove = (layer: HTMLElement, target: Node) => {
  const index = layers.indexOf(layer);
  return layers.slice(index + 1).some((above) => above.contains(target));
};

/**
 * Closes a floating layer on Escape, on pointer-down outside it, and (optionally) when focus
 * leaves it. Layers stack: Escape only closes the topmost, and clicks inside a nested layer do
 * not count as "outside" for the layers beneath it.
 */
export function useDismissable(ref: RefObject<HTMLElement | null>, options: DismissableOptions) {
  const latest = useRef(options);
  latest.current = options;
  const { enabled } = options;

  useEffect(() => {
    const layer = ref.current;
    if (!enabled || !layer) return;
    layers.push(layer);

    const dismissWith = <E extends Event>(
      originalEvent: E,
      specific: ((event: DismissEvent<E>) => void) | undefined,
      interact: boolean,
    ) => {
      const event = createDismissEvent(originalEvent);
      if (interact) latest.current.onInteractOutside?.(event as unknown as DismissEvent<PointerEvent | FocusEvent>);
      if (!event.defaultPrevented) specific?.(event);
      if (!event.defaultPrevented) latest.current.onDismiss();
    };

    const isOutside = (target: EventTarget | null) =>
      target instanceof Node && !layer.contains(target) && !isInsideLayerAbove(layer, target);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || layers[layers.length - 1] !== layer) return;
      dismissWith(event, latest.current.onEscapeKeyDown, false);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (isOutside(event.target)) dismissWith(event, latest.current.onPointerDownOutside, true);
    };
    const onFocusIn = (event: FocusEvent) => {
      if (latest.current.dismissOnFocusOutside && isOutside(event.target)) {
        dismissWith(event, latest.current.onFocusOutside, true);
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('focusin', onFocusIn);
    // Registered on the next tick so the pointer-down that opened the layer does not close it.
    const timer = window.setTimeout(() => document.addEventListener('pointerdown', onPointerDown, true), 0);

    return () => {
      layers.splice(layers.indexOf(layer), 1);
      window.clearTimeout(timer);
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('focusin', onFocusIn);
      document.removeEventListener('pointerdown', onPointerDown, true);
    };
  }, [enabled, ref]);
}

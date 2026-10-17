import { useEffect, useRef, type RefObject } from 'react';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]',
  '[contenteditable="true"]',
].join(', ');

/** Tabbable elements inside `root`, in DOM order. Scoped to the root, never the document. */
export const getTabbable = (root: HTMLElement | null): HTMLElement[] =>
  root
    ? Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
        (element) => element.tabIndex >= 0 && !element.closest('[hidden], [inert]'),
      )
    : [];

/** Focuses without scrolling the page, which would jump when a portalled overlay opens. */
export const focusElement = (element: HTMLElement | null | undefined) => element?.focus({ preventScroll: true });

/** Event passed to auto-focus callbacks. Call `preventDefault()` to handle focus yourself. */
export interface AutoFocusEvent {
  defaultPrevented: boolean;
  preventDefault(): void;
}

const createAutoFocusEvent = (): AutoFocusEvent => {
  const event: AutoFocusEvent = {
    defaultPrevented: false,
    preventDefault() {
      event.defaultPrevented = true;
    },
  };
  return event;
};

export interface FocusScopeOptions {
  /** Keep Tab and Shift+Tab, and focus generally, inside the container. */
  trapped: boolean;
  /** Called before focus moves in on mount. Prevent it to focus something else yourself. */
  onMountAutoFocus?: (event: AutoFocusEvent) => void;
  /** Called before focus returns to the previously focused element on unmount. */
  onUnmountAutoFocus?: (event: AutoFocusEvent) => void;
}

/**
 * Moves focus into the container on mount (the element with `data-autofocus`, else the first
 * tabbable, else the container itself), optionally traps it there, and returns it to whatever
 * was focused before on unmount.
 */
export function useFocusScope(ref: RefObject<HTMLElement | null>, { trapped, ...callbacks }: FocusScopeOptions) {
  const latest = useRef(callbacks);
  latest.current = callbacks;

  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    if (!container.contains(document.activeElement)) {
      const event = createAutoFocusEvent();
      latest.current.onMountAutoFocus?.(event);
      if (!event.defaultPrevented) {
        const preferred = container.querySelector<HTMLElement>('[data-autofocus]');
        focusElement(preferred ?? getTabbable(container)[0] ?? container);
      }
    }

    return () => {
      const event = createAutoFocusEvent();
      latest.current.onUnmountAutoFocus?.(event);
      if (!event.defaultPrevented && previouslyFocused?.isConnected) {
        // Deferred so it runs after any aria-hidden/inert cleanup in the same commit.
        window.setTimeout(() => focusElement(previouslyFocused), 0);
      }
    };
  }, [ref]);

  useEffect(() => {
    const container = ref.current;
    if (!trapped || !container) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || event.altKey || event.ctrlKey || event.metaKey) return;
      const tabbable = getTabbable(container);
      if (tabbable.length === 0) {
        event.preventDefault();
        return;
      }
      const first = tabbable[0];
      const last = tabbable[tabbable.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && (active === first || active === container)) {
        event.preventDefault();
        focusElement(last);
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        focusElement(first);
      }
    };
    // Focus that escapes some other way (a click on a scrollbar, programmatic focus) comes back.
    const onFocusIn = (event: FocusEvent) => {
      const target = event.target as Node | null;
      if (target && !container.contains(target) && !(target as Element).closest?.('[data-pada-layer]')) {
        focusElement(getTabbable(container)[0] ?? container);
      }
    };

    container.addEventListener('keydown', onKeyDown);
    document.addEventListener('focusin', onFocusIn);
    return () => {
      container.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('focusin', onFocusIn);
    };
  }, [ref, trapped]);
}

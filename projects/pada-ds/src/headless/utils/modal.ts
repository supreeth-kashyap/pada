import { useEffect, type RefObject } from 'react';

let scrollLocks = 0;
let restoreScroll: (() => void) | null = null;

/** Locks page scrolling while active, keeping the scrollbar's width so the layout does not shift. */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    if (scrollLocks === 0) {
      const { body, documentElement } = document;
      const scrollbarWidth = window.innerWidth - documentElement.clientWidth;
      const previous = { overflow: body.style.overflow, paddingRight: body.style.paddingRight };
      body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) {
        body.style.paddingRight = `calc(${getComputedStyle(body).paddingRight} + ${scrollbarWidth}px)`;
      }
      restoreScroll = () => {
        body.style.overflow = previous.overflow;
        body.style.paddingRight = previous.paddingRight;
      };
    }
    scrollLocks += 1;
    return () => {
      scrollLocks -= 1;
      if (scrollLocks === 0) {
        restoreScroll?.();
        restoreScroll = null;
      }
    };
  }, [active]);
}

const hiddenCounts = new WeakMap<Element, number>();

/**
 * Hides everything outside `ref` from assistive technology (aria-hidden on the siblings of the
 * branch that contains it, up to <body>) while active, so a modal dialog's content is all a
 * screen reader can reach. Elements marked `data-pada-layer` (other open overlays) are skipped.
 */
export function useHideOthers(ref: RefObject<HTMLElement | null>, active: boolean) {
  useEffect(() => {
    const target = ref.current;
    if (!active || !target) return;
    const hidden: Element[] = [];
    let branch: Element | null = target;
    while (branch && branch !== document.body && branch.parentElement) {
      for (const sibling of Array.from(branch.parentElement.children)) {
        if (sibling === branch || sibling.hasAttribute('data-pada-layer')) continue;
        if (['SCRIPT', 'STYLE', 'TEMPLATE'].includes(sibling.tagName)) continue;
        const count = hiddenCounts.get(sibling) ?? 0;
        if (count === 0 && sibling.getAttribute('aria-hidden') === 'true') continue;
        hiddenCounts.set(sibling, count + 1);
        sibling.setAttribute('aria-hidden', 'true');
        hidden.push(sibling);
      }
      branch = branch.parentElement;
    }
    return () => {
      for (const element of hidden) {
        const count = (hiddenCounts.get(element) ?? 1) - 1;
        hiddenCounts.set(element, count);
        if (count === 0) element.removeAttribute('aria-hidden');
      }
    };
  }, [ref, active]);
}

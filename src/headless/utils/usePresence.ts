import { useCallback, useEffect, useState } from 'react';

const toMs = (value: string) =>
  value
    .split(',')
    .map((part) => {
      const trimmed = part.trim();
      const number = parseFloat(trimmed);
      if (Number.isNaN(number)) return 0;
      return trimmed.endsWith('ms') ? number : number * 1000;
    });

/** Longest transition or animation on the element, delays included, in ms. */
export function getExitDuration(node: Element): number {
  const style = getComputedStyle(node);
  const longest = (durations: string, delays: string) => {
    const d = toMs(durations);
    const l = toMs(delays);
    return Math.max(0, ...d.map((duration, index) => duration + (l[index % l.length] ?? 0)));
  };
  return Math.max(
    longest(style.transitionDuration || '0s', style.transitionDelay || '0s'),
    style.animationName && style.animationName !== 'none'
      ? longest(style.animationDuration || '0s', style.animationDelay || '0s')
      : 0,
  );
}

/**
 * Keeps an element mounted after `present` turns false until its exit transition or animation
 * finishes, so closing parts can animate out. The element gets `data-state="closed"` first;
 * CSS animates it; then it unmounts. With no transition (or reduced motion, where every Pada
 * duration is 0) it unmounts immediately.
 *
 * Pass the returned `ref` to the animated element and render it while `isPresent` is true.
 */
export function usePresence(present: boolean) {
  const [node, setNode] = useState<HTMLElement | null>(null);
  const [exiting, setExiting] = useState(false);
  const [wasPresent, setWasPresent] = useState(present);

  // Entering cancels a running exit; leaving starts one. Adjusting state during render keeps
  // the element mounted in the same commit that flips data-state to "closed".
  if (present !== wasPresent) {
    setWasPresent(present);
    setExiting(!present);
  }

  useEffect(() => {
    if (!exiting) return;
    const duration = node ? getExitDuration(node) : 0;
    if (duration === 0) {
      setExiting(false);
      return;
    }
    const finish = (event: Event) => {
      if (event.target === node) setExiting(false);
    };
    node?.addEventListener('animationend', finish);
    // transitionend fires per property, so a timer at the longest duration is the reliable end.
    const timer = window.setTimeout(() => setExiting(false), duration + 34);
    return () => {
      node?.removeEventListener('animationend', finish);
      window.clearTimeout(timer);
    };
  }, [exiting, node]);

  const ref = useCallback((element: HTMLElement | null) => setNode(element), []);
  return { isPresent: present || exiting, ref };
}

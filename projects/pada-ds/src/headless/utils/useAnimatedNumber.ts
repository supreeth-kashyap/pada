import { useEffect, useRef, useState, type RefObject } from 'react';

export interface AnimatedNumberOptions {
  /** Base duration in ms, scaled by `--pada-motion-scale` on the element (0 under reduced motion). @default 480 */
  duration?: number;
  /** Animate from 0 on first render instead of starting at the value. @default false */
  fromZero?: boolean;
}

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

/** The element's `--pada-motion-scale` (1 when unset, 0 under reduced motion). */
const motionScale = (element: Element | null) => {
  if (!element || typeof getComputedStyle === 'undefined') return 1;
  const raw = getComputedStyle(element).getPropertyValue('--pada-motion-scale').trim();
  if (raw === '') {
    return typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 1;
  }
  const scale = Number(raw);
  return Number.isFinite(scale) ? scale : 1;
};

/**
 * A number that counts from its previous value to `value` (a "ticker"), for KPIs and counters.
 * Respects `--pada-motion-scale` on `ref`'s element: with reduced motion it jumps.
 */
export function useAnimatedNumber(value: number, ref: RefObject<Element | null>, { duration = 480, fromZero = false }: AnimatedNumberOptions = {}) {
  const [display, setDisplay] = useState(fromZero ? 0 : value);
  const current = useRef(display);
  current.current = display;

  useEffect(() => {
    const from = current.current;
    const total = duration * motionScale(ref.current);
    if (from === value || total <= 0 || typeof requestAnimationFrame === 'undefined') {
      setDisplay(value);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / total);
      setDisplay(from + (value - from) * easeOutCubic(progress));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, duration, ref]);

  return display;
}

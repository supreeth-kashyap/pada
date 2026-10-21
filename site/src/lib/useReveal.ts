import { useEffect } from 'react';

/**
 * Fades `[data-reveal]` elements in as they scroll into view. Elements already on screen, and
 * everything under reduced motion, show immediately. Server-rendered markup stays visible until
 * this runs (the hidden state is only applied by the `html.js-reveal` class it sets).
 */
export function useReveal(deps: unknown[] = []) {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-in)'));
    if (reduced || !('IntersectionObserver' in window)) {
      nodes.forEach((node) => node.classList.add('is-in'));
      return;
    }
    document.documentElement.classList.add('js-reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.08 },
    );
    nodes.forEach((node) => {
      if (node.getBoundingClientRect().top < window.innerHeight) node.classList.add('is-in');
      else observer.observe(node);
    });
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

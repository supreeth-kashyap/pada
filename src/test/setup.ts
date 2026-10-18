import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup();
  document.body.innerHTML = '';
  document.body.removeAttribute('style');
});

// jsdom lacks these; Floating UI and some parts read them.
if (!('ResizeObserver' in globalThis)) {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}
if (!Element.prototype.scrollIntoView) Element.prototype.scrollIntoView = () => {};
// jsdom has no canvas; stub it so parts that paint one (ColorPicker) skip painting quietly.
HTMLCanvasElement.prototype.getContext = (() => null) as typeof HTMLCanvasElement.prototype.getContext;
if (!('PointerEvent' in window)) {
  // @ts-expect-error minimal polyfill: jsdom only has MouseEvent
  window.PointerEvent = class PointerEvent extends MouseEvent {};
}

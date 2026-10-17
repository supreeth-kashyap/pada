import {
  arrow as arrowMiddleware,
  autoUpdate,
  flip,
  hide,
  offset,
  shift,
  size,
  useFloating,
  type Placement,
} from '@floating-ui/react-dom';
import { useState, type CSSProperties } from 'react';

export type Side = 'top' | 'right' | 'bottom' | 'left';
export type Align = 'start' | 'center' | 'end';

export interface FloatingOptions {
  /** Preferred side of the anchor. Flips to the opposite side when there is no room. */
  side?: Side;
  /** Alignment along the side. */
  align?: Align;
  /** Gap between anchor and content, in px. */
  sideOffset?: number;
  /** Shift along the alignment axis, in px. */
  alignOffset?: number;
  /** Flip and shift to stay in the viewport. */
  avoidCollisions?: boolean;
  /** Distance to keep from the viewport edges, in px. */
  collisionPadding?: number;
  /** Size of the arrow element, if any, so it stays inside rounded corners. */
  arrowPadding?: number;
  /** Hide the content when its anchor scrolls out of view. @default false */
  hideWhenDetached?: boolean;
}

const ORIGIN: Record<Side, string> = { top: 'bottom', right: 'left', bottom: 'top', left: 'right' };

/**
 * Anchored positioning for popovers, menus and tooltips (Floating UI). Returns refs for the
 * anchor and the floating element, the styles to spread on the floating element, and the
 * resolved side and alignment for `data-side` / `data-align`.
 *
 * The floating element also gets CSS variables the styled layer can use:
 * `--pada-floating-available-width/height`, `--pada-floating-anchor-width/height` and
 * `--pada-floating-transform-origin` (the anchor-facing edge, for scale-in motion).
 */
export function useFloatingPosition(open: boolean, options: FloatingOptions = {}) {
  const {
    side = 'bottom',
    align = 'center',
    sideOffset = 4,
    alignOffset = 0,
    avoidCollisions = true,
    collisionPadding = 8,
    arrowPadding = 0,
    hideWhenDetached = false,
  } = options;
  const [arrowElement, setArrowElement] = useState<HTMLElement | null>(null);
  const placement = (align === 'center' ? side : `${side}-${align}`) as Placement;

  const floating = useFloating({
    open,
    placement,
    strategy: 'fixed',
    // Position with top/left, leaving `transform` free for enter and exit animations.
    transform: false,
    whileElementsMounted: (reference, floatingElement, update) =>
      autoUpdate(reference, floatingElement, update, { animationFrame: false }),
    middleware: [
      offset({ mainAxis: sideOffset, alignmentAxis: alignOffset }),
      avoidCollisions && flip({ padding: collisionPadding }),
      avoidCollisions && shift({ padding: collisionPadding }),
      size({
        padding: collisionPadding,
        apply({ availableWidth, availableHeight, rects, elements }) {
          const style = elements.floating.style;
          style.setProperty('--pada-floating-available-width', `${availableWidth}px`);
          style.setProperty('--pada-floating-available-height', `${availableHeight}px`);
          style.setProperty('--pada-floating-anchor-width', `${rects.reference.width}px`);
          style.setProperty('--pada-floating-anchor-height', `${rects.reference.height}px`);
        },
      }),
      arrowElement && arrowMiddleware({ element: arrowElement, padding: arrowPadding }),
      hideWhenDetached && hide({ strategy: 'referenceHidden' }),
    ],
  });

  const [resolvedSide, resolvedAlign = 'center'] = floating.placement.split('-') as [Side, Align | undefined];
  const referenceHidden = hideWhenDetached && floating.middlewareData.hide?.referenceHidden;

  const floatingStyles: CSSProperties = {
    // Not hidden before the first position: focus() is a no-op on hidden elements, and open
    // overlays move focus in on mount. Floating UI positions within the same frame.
    ...floating.floatingStyles,
    ...(referenceHidden ? { visibility: 'hidden', pointerEvents: 'none' } : {}),
    ['--pada-floating-transform-origin' as string]: ORIGIN[resolvedSide],
  };

  const arrowData = floating.middlewareData.arrow;
  const arrowStyles: CSSProperties = {
    position: 'absolute',
    left: arrowData?.x,
    top: arrowData?.y,
    [ORIGIN[resolvedSide]]: 0,
  };

  return {
    refs: floating.refs,
    floatingStyles,
    arrowStyles,
    setArrowElement,
    side: resolvedSide,
    align: resolvedAlign,
    isPositioned: floating.isPositioned,
  };
}

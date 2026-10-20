import { useCallback, useEffect, useRef, useState, type ComponentPropsWithRef, type CSSProperties } from 'react';
import { useComposedRefs } from '../../headless/utils/refs';
import './ScrollArea.css';

const cx = (...names: (string | undefined | false)[]) => names.filter(Boolean).join(' ');

export interface ScrollAreaProps extends ComponentPropsWithRef<'div'> {
  /** Which way it scrolls. @default 'vertical' */
  orientation?: 'vertical' | 'horizontal' | 'both';
  /** Maximum height (vertical) before it scrolls, e.g. 320 or "50vh". */
  maxHeight?: number | string;
  /** Maximum width (horizontal) before it scrolls. */
  maxWidth?: number | string;
  /** Fade the edges where more content is hidden. @default true */
  fade?: boolean;
  /** `auto` shows the thin scrollbar while hovering or scrolling; `always` keeps it. @default 'auto' */
  scrollbar?: 'auto' | 'always';
}

interface Edges {
  overflowing: boolean;
  start: boolean;
  end: boolean;
}

/**
 * A scrolling region with slim, themed scrollbars and faded edges. Scrolling stays native
 * (touch, wheel, keyboard, scroll snapping, find-in-page). When content overflows, the region
 * becomes focusable so keyboard users can scroll it; give it an `aria-label` then.
 */
export function ScrollArea({
  orientation = 'vertical',
  maxHeight,
  maxWidth,
  fade = true,
  scrollbar = 'auto',
  className,
  style,
  ref,
  onScroll,
  children,
  ...props
}: ScrollAreaProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const composedRef = useComposedRefs(ref, viewportRef);
  const [edges, setEdges] = useState<Edges>({ overflowing: false, start: true, end: true });

  const measure = useCallback(() => {
    const element = viewportRef.current;
    if (!element) return;
    const vertical = orientation !== 'horizontal';
    const size = vertical ? element.clientHeight : element.clientWidth;
    const scrollSize = vertical ? element.scrollHeight : element.scrollWidth;
    const position = Math.abs(vertical ? element.scrollTop : element.scrollLeft);
    const next = { overflowing: scrollSize > size + 1, start: position <= 1, end: position + size >= scrollSize - 1 };
    setEdges((previous) =>
      previous.overflowing === next.overflowing && previous.start === next.start && previous.end === next.end ? previous : next,
    );
  }, [orientation]);

  useEffect(() => {
    const element = viewportRef.current;
    measure();
    if (!element || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    Array.from(element.children).forEach((child) => observer.observe(child));
    return () => observer.disconnect();
  }, [measure, children]);

  return (
    <div
      {...props}
      ref={composedRef}
      // Focusable only when there is something to scroll (axe: scrollable-region-focusable).
      tabIndex={props.tabIndex ?? (edges.overflowing ? 0 : undefined)}
      role={props.role ?? (edges.overflowing && (props['aria-label'] || props['aria-labelledby']) ? 'region' : undefined)}
      className={cx('scroll-area', className)}
      data-orientation={orientation}
      data-scrollbar={scrollbar}
      data-fade={fade ? '' : undefined}
      data-overflowing={edges.overflowing ? '' : undefined}
      data-at-start={edges.start ? '' : undefined}
      data-at-end={edges.end ? '' : undefined}
      style={
        {
          ...(maxHeight !== undefined && { '--pada-scroll-area-max-height': typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight }),
          ...(maxWidth !== undefined && { '--pada-scroll-area-max-width': typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth }),
          ...style,
        } as CSSProperties
      }
      onScroll={(event) => {
        onScroll?.(event);
        measure();
      }}
    >
      {children}
    </div>
  );
}

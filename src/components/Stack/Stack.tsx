import type { ComponentPropsWithRef, CSSProperties, ElementType } from 'react';
import './Stack.css';

type Space = 0 | 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16;

export interface StackProps extends ComponentPropsWithRef<'div'> {
  /** Main axis. */
  direction?: 'row' | 'column';
  /** Gap in spacing steps (n × 0.25rem × density): `gap={3}` is 12px at default density. */
  gap?: Space;
  /** Cross-axis alignment. */
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  /** Main-axis distribution. */
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  /** Wrap onto new lines when out of room. */
  wrap?: boolean;
  /** Element to render, e.g. `ul`, `section`, `nav`. */
  as?: ElementType;
}

const spaceToken = (gap: Space) => (gap === 0 ? '0px' : `var(--pada-space-${String(gap).replace('.', '-')})`);

/** Flex layout with token-based gaps, so spacing follows density. */
export function Stack({ direction = 'column', gap = 2, align, justify, wrap, as: Component = 'div', className, style, ...props }: StackProps) {
  return (
    <Component
      data-direction={direction}
      data-align={align}
      data-justify={justify}
      data-wrap={wrap ? '' : undefined}
      {...props}
      className={['stack', className].filter(Boolean).join(' ')}
      style={{ ['--pada-stack-gap' as string]: spaceToken(gap), ...style } as CSSProperties}
    />
  );
}

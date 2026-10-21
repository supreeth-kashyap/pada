import type { ComponentPropsWithRef, CSSProperties } from 'react';
import './AspectRatio.css';

export interface AspectRatioProps extends ComponentPropsWithRef<'div'> {
  /** Width divided by height: `16 / 9`, `1`, `4 / 3`. @default 1 */
  ratio?: number;
}

/** Keeps its content at a fixed shape; images and videos inside fill it (cropped to fit). */
export function AspectRatio({ ratio = 1, className, style, ...props }: AspectRatioProps) {
  return (
    <div
      {...props}
      className={['aspect-ratio', className].filter(Boolean).join(' ')}
      style={{ '--pada-aspect-ratio': ratio, ...style } as CSSProperties}
    />
  );
}

import type { ComponentPropsWithRef } from 'react';
import './Separator.css';

export interface SeparatorProps extends ComponentPropsWithRef<'div'> {
  orientation?: 'horizontal' | 'vertical';
  /**
   * Purely visual (the default): hidden from assistive technology. Set `false` when the line
   * separates sections that a screen reader user should know are distinct.
   */
  decorative?: boolean;
}

/** A thin line between content, horizontal or vertical. */
export function Separator({ orientation = 'horizontal', decorative = true, className, ...props }: SeparatorProps) {
  return (
    <div
      role={decorative ? 'none' : 'separator'}
      aria-orientation={decorative ? undefined : orientation}
      data-orientation={orientation}
      {...props}
      className={['separator', className].filter(Boolean).join(' ')}
    />
  );
}

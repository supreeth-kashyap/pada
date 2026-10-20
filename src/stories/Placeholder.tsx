import type { CSSProperties, ReactNode } from 'react';

/** A themed stand-in box for layout stories (grids, stacks, carousels, panels). */
export function Placeholder({ children, style }: { children?: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        display: 'grid',
        placeItems: 'center',
        minHeight: 48,
        padding: 12,
        borderRadius: 8,
        border: '1px dashed var(--color-accent-400)',
        background: 'var(--color-accent-50)',
        color: 'var(--color-accent-800)',
        fontSize: 13,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

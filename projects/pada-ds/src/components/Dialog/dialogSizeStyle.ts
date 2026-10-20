import type { CSSProperties } from 'react';

/** Sets `--pada-dialog-width` and `--pada-dialog-height` from 1.x-style width/height props. */
export function dialogSizeStyle(width?: number | string, height?: number | string): CSSProperties {
  const toCss = (value: number | string) => (typeof value === 'number' ? `${value}px` : value);
  return {
    ...(width !== undefined ? { ['--pada-dialog-width' as string]: toCss(width) } : {}),
    ...(height !== undefined ? { ['--pada-dialog-height' as string]: toCss(height) } : {}),
  };
}

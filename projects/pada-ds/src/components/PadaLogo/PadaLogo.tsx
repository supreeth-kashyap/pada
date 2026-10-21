import type { ComponentPropsWithRef } from 'react';
import './PadaLogo.css';
import { MARK_LEFT, MARK_RIGHT, WORDMARK as WORDMARK_PATH } from './paths';

const cx = (...names: (string | undefined | false)[]) => names.filter(Boolean).join(' ');

const SIZES = { sm: 20, md: 32, lg: 48, xl: 64 } as const;
const MARK = { width: 28.67, height: 32.875 };
const WORDMARK = { width: 109.484, height: 15.875 };
// The wordmark sits centred on the mark, eight units to its right.
const LOCKUP = { width: 146.2, height: 32.875, wordmarkX: 36.7, wordmarkY: 8.5 };

export interface PadaLogoProps extends Omit<ComponentPropsWithRef<'svg'>, 'children'> {
  /** `lockup` (mark and wordmark), `mark` alone, or `wordmark` alone. @default 'lockup' */
  variant?: 'lockup' | 'mark' | 'wordmark';
  /**
   * `color`: amber left half, accent right half (it follows `data-accent`), stone wordmark.
   * `accent`: both halves in the accent. `mono`: everything in `currentColor`. @default 'color'
   */
  tone?: 'color' | 'accent' | 'mono';
  /** Height in px, or a preset. @default 'md' (32px) */
  size?: keyof typeof SIZES | number;
  /**
   * `true` steps in once on mount (left half, right half, then the wordmark); `'loop'` lifts the
   * halves in turn, for a branded loading indicator. Both are still under reduced motion.
   */
  animated?: boolean | 'loop';
  /** Accessible name. @default 'Pada' ('Loading' when looping) */
  title?: string;
  /** Hide from assistive technology when a text label sits next to it. */
  decorative?: boolean;
}

function Mark() {
  return (
    <g className="pada-logo-mark">
      <path className="pada-logo-half" data-side="left" d={MARK_LEFT} />
      <path className="pada-logo-half" data-side="right" d={MARK_RIGHT} />
    </g>
  );
}

function Wordmark({ x = 0, y = 0 }: { x?: number; y?: number }) {
  return <path className="pada-logo-wordmark" d={WORDMARK_PATH} transform={x || y ? `translate(${x} ${y})` : undefined} />;
}

/** The Pada logo: the geometric mark, the "Pada . design" wordmark, or both, as inline SVG. */
export function PadaLogo({
  variant = 'lockup',
  tone = 'color',
  size = 'md',
  animated = false,
  title,
  decorative = false,
  className,
  ...props
}: PadaLogoProps) {
  const height = typeof size === 'number' ? size : SIZES[size];
  const box = variant === 'mark' ? MARK : variant === 'wordmark' ? WORDMARK : LOCKUP;
  const loop = animated === 'loop';
  const label = title ?? (loop ? 'Loading' : 'Pada');

  return (
    <svg
      viewBox={`0 0 ${box.width} ${box.height}`}
      height={height}
      width={(height * box.width) / box.height}
      role={decorative ? undefined : loop ? 'status' : 'img'}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative || undefined}
      focusable="false"
      data-tone={tone}
      data-variant={variant}
      data-animated={loop ? 'loop' : animated ? 'enter' : undefined}
      className={cx('pada-logo', className)}
      {...props}
    >
      {variant !== 'wordmark' && <Mark />}
      {variant === 'wordmark' && <Wordmark />}
      {variant === 'lockup' && <Wordmark x={LOCKUP.wordmarkX} y={LOCKUP.wordmarkY} />}
    </svg>
  );
}

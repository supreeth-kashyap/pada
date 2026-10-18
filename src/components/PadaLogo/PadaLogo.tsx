import type { ComponentPropsWithRef } from 'react';
import './PadaLogo.css';

const cx = (...names: (string | undefined | false)[]) => names.filter(Boolean).join(' ');

// "Twin Soles": two soles standing on a shared baseline (pāda, Sanskrit for foot: the part
// that carries the weight). The left sole is drawn once and mirrored for the right.
const SOLE =
  'M10.6 3.6C13.4 3.6 15 5.9 15 9.2C15 12.3 14 14.5 13.3 16.7C12.8 18.4 13 20.4 13.4 22.3C13.9 24.8 12.3 26.7 10.1 26.7C7.8 26.7 6.3 25 6.3 22.6C6.3 19.6 4.9 17.3 4.5 14.2C3.9 9 6.6 3.6 10.6 3.6Z';
const MIRROR = 'matrix(-1 0 0 1 32 0)';

const SIZES = { sm: 20, md: 32, lg: 48, xl: 64 } as const;
const MARK = { width: 32, height: 32 };
const WORDMARK = { width: 67, height: 27 };
// The wordmark's baseline (y = 22) sits on the mark's ground line in the lockup.
const LOCKUP = { width: 110, height: 32, wordmarkX: 42, wordmarkY: 6.4 };

export interface PadaLogoProps extends Omit<ComponentPropsWithRef<'svg'>, 'children'> {
  /** `lockup` (mark and wordmark), `mark` alone, or `wordmark` alone. @default 'lockup' */
  variant?: 'lockup' | 'mark' | 'wordmark';
  /**
   * `color`: amber left sole, accent right sole (it follows `data-accent`). `accent`: both soles
   * in the accent. `mono`: everything in `currentColor`. @default 'color'
   */
  tone?: 'color' | 'accent' | 'mono';
  /** Height in px, or a preset. @default 'md' (32px) */
  size?: keyof typeof SIZES | number;
  /** Draw a toe above each sole. Defaults to on from 48px up, where it stays legible. */
  toes?: boolean;
  /**
   * `true` steps in once on mount (left sole, right sole, then the ground); `'loop'` walks, for
   * a branded loading indicator. Both are still under reduced motion.
   */
  animated?: boolean | 'loop';
  /** Accessible name. @default 'Pada' ('Loading' when looping) */
  title?: string;
  /** Hide from assistive technology when a text label sits next to it. */
  decorative?: boolean;
}

function Mark({ toes }: { toes: boolean }) {
  return (
    <g className="pada-logo-mark">
      <g className="pada-logo-sole" data-side="left">
        <path d={SOLE} />
        {toes && <circle cx="13" cy="1.6" r="1.5" />}
      </g>
      <g className="pada-logo-sole" data-side="right">
        <path d={SOLE} transform={MIRROR} />
        {toes && <circle cx="19" cy="1.6" r="1.5" />}
      </g>
      <rect className="pada-logo-ground" x="3" y="28.4" width="26" height="2.4" rx="1.2" />
    </g>
  );
}

function Wordmark({ x = 0, y = 0 }: { x?: number; y?: number }) {
  // Geometric, single-storey letters drawn as strokes: no font needed.
  return (
    <g className="pada-logo-wordmark" transform={`translate(${x} ${y})`}>
      <path d="M3 10V25.4" />
      <circle cx="9" cy="16" r="6" />
      <circle cx="25.5" cy="16" r="6" />
      <path d="M31.5 10V22" />
      <circle cx="42" cy="16" r="6" />
      <path d="M48 2.5V22" />
      <circle cx="58.5" cy="16" r="6" />
      <path d="M64.5 10V22" />
    </g>
  );
}

/** The Pada logo: the "Twin Soles" mark, the wordmark, or both, as inline SVG. */
export function PadaLogo({
  variant = 'lockup',
  tone = 'color',
  size = 'md',
  toes,
  animated = false,
  title,
  decorative = false,
  className,
  ...props
}: PadaLogoProps) {
  const height = typeof size === 'number' ? size : SIZES[size];
  const box = variant === 'mark' ? MARK : variant === 'wordmark' ? WORDMARK : LOCKUP;
  const showToes = toes ?? height >= 48;
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
      {variant !== 'wordmark' && <Mark toes={showToes} />}
      {variant === 'wordmark' && <Wordmark />}
      {variant === 'lockup' && <Wordmark x={LOCKUP.wordmarkX} y={LOCKUP.wordmarkY} />}
    </svg>
  );
}

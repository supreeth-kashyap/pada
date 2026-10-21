export const TextSize = {
  XS: 'xs',
  SM: 'sm',
  BASE: 'base',
  LG: 'lg',
  XL: 'xl',
  '2XL': '2xl',
  '3XL': '3xl',
  '4XL': '4xl',
  '5XL': '5xl',
  '6XL': '6xl',
  '7XL': '7xl',
  '8XL': '8xl',
  '9XL': '9xl',
} as const;

export type TextSize = typeof TextSize[keyof typeof TextSize];

export const TextWeight = {
  THIN: '100',
  EXTRALIGHT: '200',
  LIGHT: '300',
  NORMAL: '400',
  MEDIUM: '500',
  SEMIBOLD: '600',
  BOLD: '700',
  EXTRABOLD: '800',
  BLACK: '900',
} as const;

export type TextWeight = typeof TextWeight[keyof typeof TextWeight];

export const TextFamily = {
  SANS: 'sans',
  SERIF: 'serif',
  MONO: 'mono',
} as const;

export type TextFamily = typeof TextFamily[keyof typeof TextFamily];

export const TextLineHeight = {
  XS: 'xs',
  SM: 'sm',
  BASE: 'base',
  LG: 'lg',
  XL: 'xl',
  '2XL': '2xl',
} as const;

export type TextLineHeight = typeof TextLineHeight[keyof typeof TextLineHeight];

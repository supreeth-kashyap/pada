/**
 * Colour maths for ColorPicker: OKLCH ↔ sRGB (Björn Ottosson's OKLab), gamut mapping, and
 * parsing and formatting of `#rrggbb` and `oklch()` strings.
 */

/** A colour in OKLCH: lightness 0–1, chroma 0–~0.37, hue 0–360 degrees. */
export interface Oklch {
  l: number;
  c: number;
  h: number;
}

export type ColorFormat = 'hex' | 'oklch';

/** The largest chroma any sRGB colour reaches; the picker's horizontal axis ends here. */
export const MAX_CHROMA = 0.37;

const clamp = (value: number, low: number, high: number) => Math.min(high, Math.max(low, value));

const toLinear = (channel: number) => (channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
const fromLinear = (channel: number) => (channel <= 0.0031308 ? 12.92 * channel : 1.055 * channel ** (1 / 2.4) - 0.055);

/** OKLCH to sRGB channels (0–1). Channels outside 0–1 mean the colour is outside sRGB. */
export function oklchToRgb({ l, c, h }: Oklch): [number, number, number] {
  const radians = (h * Math.PI) / 180;
  const a = c * Math.cos(radians);
  const b = c * Math.sin(radians);
  const l_ = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m_ = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s_ = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    fromLinear(4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_),
    fromLinear(-1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_),
    fromLinear(-0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_),
  ];
}

/** sRGB channels (0–1) to OKLCH. Greys get hue 0. */
export function rgbToOklch([red, green, blue]: [number, number, number]): Oklch {
  const r = toLinear(red);
  const g = toLinear(green);
  const b = toLinear(blue);
  const l_ = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m_ = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s_ = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const l = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
  const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
  const bb = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;
  const c = Math.hypot(a, bb);
  const h = c < 1e-4 ? 0 : ((Math.atan2(bb, a) * 180) / Math.PI + 360) % 360;
  return { l: clamp(l, 0, 1), c, h };
}

const EPSILON = 1e-4;
export const inGamut = (color: Oklch) => oklchToRgb(color).every((channel) => channel >= -EPSILON && channel <= 1 + EPSILON);

/** The same lightness and hue with chroma reduced until the colour fits in sRGB. */
export function toGamut(color: Oklch): Oklch {
  if (inGamut(color)) return color;
  let low = 0;
  let high = color.c;
  for (let step = 0; step < 20; step += 1) {
    const middle = (low + high) / 2;
    if (inGamut({ ...color, c: middle })) low = middle;
    else high = middle;
  }
  return { ...color, c: low };
}

const hex2 = (channel: number) =>
  Math.round(clamp(channel, 0, 1) * 255)
    .toString(16)
    .padStart(2, '0');

/** `#rrggbb`, mapped into sRGB first. */
export function formatHex(color: Oklch): string {
  const [r, g, b] = oklchToRgb(toGamut(color));
  return `#${hex2(r)}${hex2(g)}${hex2(b)}`;
}

const round = (value: number, digits: number) => Number(value.toFixed(digits));

/** `oklch(62.8% 0.258 29.2)` — the colour as chosen, which may be outside sRGB. */
export function formatOklch({ l, c, h }: Oklch): string {
  return `oklch(${round(l * 100, 1)}% ${round(c, 3)} ${round(h, 1)})`;
}

export const formatColor = (color: Oklch, format: ColorFormat) => (format === 'oklch' ? formatOklch(color) : formatHex(color));

/** Parses `#rgb`, `#rrggbb` (alpha digits are ignored) or `oklch(L C H)`. Returns null otherwise. */
export function parseColor(input: string): Oklch | null {
  const text = input.trim().toLowerCase();
  const hex = text.match(/^#?([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/);
  if (hex) {
    let digits = hex[1];
    if (digits.length <= 4) digits = [...digits].map((digit) => digit + digit).join('');
    const channel = (index: number) => parseInt(digits.slice(index, index + 2), 16) / 255;
    return rgbToOklch([channel(0), channel(2), channel(4)]);
  }
  const oklch = text.match(/^oklch\(\s*([\d.]+)(%?)\s+([\d.]+)\s+([\d.]+)(?:deg)?\s*(?:\/\s*[\d.]+%?\s*)?\)$/);
  if (oklch) {
    const lightness = Number(oklch[1]) / (oklch[2] ? 100 : 1);
    const [l, c, h] = [lightness, Number(oklch[3]), Number(oklch[4])];
    if ([l, c, h].some(Number.isNaN)) return null;
    return { l: clamp(l, 0, 1), c: clamp(c, 0, MAX_CHROMA), h: ((h % 360) + 360) % 360 };
  }
  return null;
}

// Formatting and parsing for NumberInput: Intl.NumberFormat for display, and a parser that
// understands the same locale's group and decimal symbols, currency signs and percent.

export interface NumberFormatter {
  format: (value: number) => string;
  /** The number typed text stands for, or null when it holds no number. */
  parse: (text: string) => number | null;
}

const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function createNumberFormatter(locale?: string, options?: Intl.NumberFormatOptions): NumberFormatter {
  const formatter = new Intl.NumberFormat(locale, options);
  const parts = formatter.formatToParts(-12345.6);
  const group = parts.find((part) => part.type === 'group')?.value ?? ',';
  const decimal = parts.find((part) => part.type === 'decimal')?.value ?? '.';
  const percent = options?.style === 'percent';
  // Group separators can be a no-break space; any space-like character counts.
  const groupPattern = new RegExp(/\s/.test(group) ? '[\\s\\u00a0\\u202f]' : escape(group), 'g');

  return {
    format: (value) => formatter.format(value),
    parse: (text) => {
      const normalized = text
        .replace(groupPattern, '')
        .replace(decimal, '.')
        .replace(/[−–]/g, '-')
        .replace(/[^\d.-]/g, '');
      if (!/\d/.test(normalized)) return null;
      const negative = normalized.trim().startsWith('-') || /^\s*\(.*\)\s*$/.test(text);
      const number = Number(normalized.replace(/-/g, ''));
      if (Number.isNaN(number)) return null;
      const signed = negative ? -number : number;
      return percent ? signed / 100 : signed;
    },
  };
}

/** Digits after the decimal point, including those hidden in exponent notation (1e-7). */
const decimals = (value: number) => {
  if (!Number.isFinite(value)) return 0;
  const match = /(?:\.(\d+))?(?:e-(\d+))?$/.exec(value.toString());
  return (match?.[1]?.length ?? 0) + Number(match?.[2] ?? 0);
};

/**
 * Removes floating-point noise from stepping (0.1 + 0.2 = 0.30000000000000004) while keeping
 * the precision of a typed value (3.14159 stays as typed).
 */
export const roundToPrecision = (value: number, step: number) => {
  const places = decimals(value) > 10 ? decimals(step) : Math.max(decimals(step), decimals(value));
  return Number(value.toFixed(Math.min(20, places)));
};

export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

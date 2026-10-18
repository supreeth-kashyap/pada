import { describe, expect, it } from 'vitest';
import { formatHex, formatOklch, inGamut, parseColor, rgbToOklch, toGamut } from './color';

describe('color', () => {
  it('round-trips hex through OKLCH', () => {
    for (const hex of ['#000000', '#ffffff', '#4f46e5', '#ff0000', '#22c55e', '#f59e0b', '#808080']) {
      expect(formatHex(parseColor(hex)!)).toBe(hex);
    }
  });

  it('matches known OKLCH values', () => {
    const red = rgbToOklch([1, 0, 0]);
    expect(red.l).toBeCloseTo(0.628, 3);
    expect(red.c).toBeCloseTo(0.2577, 3);
    expect(red.h).toBeCloseTo(29.23, 1);
    expect(rgbToOklch([0.5, 0.5, 0.5]).c).toBeLessThan(1e-4);
  });

  it('parses short hex and oklch() strings', () => {
    expect(formatHex(parseColor('#f00')!)).toBe('#ff0000');
    expect(formatHex(parseColor('4f46e5')!)).toBe('#4f46e5');
    const parsed = parseColor('oklch(62.8% 0.258 29.2)')!;
    expect(parsed.l).toBeCloseTo(0.628);
    expect(parsed.h).toBeCloseTo(29.2);
    expect(parseColor('oklch(0.5 0.1 200deg / 50%)')!.l).toBe(0.5);
    expect(parseColor('red')).toBeNull();
    expect(parseColor('#12')).toBeNull();
  });

  it('maps out-of-gamut colours into sRGB by reducing chroma', () => {
    const vivid = { l: 0.7, c: 0.35, h: 150 };
    expect(inGamut(vivid)).toBe(false);
    const mapped = toGamut(vivid);
    expect(inGamut(mapped)).toBe(true);
    expect(mapped.l).toBe(0.7);
    expect(mapped.c).toBeLessThan(0.35);
    expect(formatOklch({ l: 0.62845, c: 0.25768, h: 29.234 })).toBe('oklch(62.8% 0.258 29.2)');
  });
});

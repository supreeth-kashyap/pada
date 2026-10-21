// Pada token model: the single source of truth for every design token.
//
// scripts/build-tokens.mjs turns this into src/styles/tokens.generated.css (used by the
// components and the demo) and into dist/tokens.{css,scss,js,d.ts,json} for consumers.
//
// Tiers
//   0 reference   --pada-ref-*        raw ramps and scales; components never read them
//   1 semantic    --pada-color-* …    meaning-based; light and dark live in one light-dark() value
//   2 derived     calc()/color-mix()  computed from tier 1 and the knobs below
//   3 component   --pada-<component>-* declared in each component's CSS (not here)
//   4 local       consumer overrides on any element
//
// Knobs and palettes are plain custom properties that the theme axes (data-accent,
// data-neutral, data-density, data-radius, data-motion, data-contrast) reassign. Any token that
// reads a knob or a palette, directly or through another token, is re-declared on every
// element that carries an axis attribute, so a subtree with data-accent="amber" gets amber
// hover colours, focus rings and so on. The generator works that out from the references.

import { hues } from './palette.mjs';

const ld = (light, dark) => `light-dark(${light}, ${dark})`;
const v = (name) => `var(--pada-${name})`;

export const STEPS = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];
// Dark mode reads each ramp backwards so "50" stays the faintest tint on the current surface.
// Same mapping as Pada 1.x (500 is shared by both themes).
const DARK_STEP = {
  50: '900', 100: '800', 200: '700', 300: '600', 400: '500', 500: '500',
  600: '400', 700: '300', 800: '200', 900: '50', 950: '50',
};

export const HUES = Object.keys(hues);

// Intents and the reference hue each one uses by default.
export const INTENTS = {
  accent: 'indigo',
  neutral: 'stone',
  success: 'green',
  warning: 'amber',
  danger: 'red',
  info: 'sky',
};

// Lightness and chroma per step for data-accent="custom", taken from Tailwind v4's indigo in
// OKLCH so the generated ramp has the same perceptual shape for any hue.
const CUSTOM_RAMP = {
  50: [0.962, 0.018], 100: [0.93, 0.034], 200: [0.87, 0.065], 300: [0.785, 0.115],
  400: [0.673, 0.182], 500: [0.585, 0.233], 600: [0.511, 0.262], 700: [0.457, 0.24],
  800: [0.398, 0.195], 900: [0.359, 0.144], 950: [0.257, 0.09],
};

export const SPACE_STEPS = [
  '0-5', '1', '1-5', '2', '2-5', '3', '3-5', '4', '5', '6', '7', '8', '9', '10', '11', '12',
  '14', '16', '20', '24', '28', '32', '36', '40', '44', '48', '52', '56', '60', '64', '72', '80', '96',
];

export const BREAKPOINTS = { sm: 640, md: 768, lg: 1024, xl: 1280, '2xl': 1536 };

const tokens = [];
const add = (name, value, meta = {}) => {
  tokens.push({ name, value, tier: 1, type: 'other', description: '', ...meta });
};

// ── Knobs ────────────────────────────────────────────────────────────────────────────────────
export const knobs = [
  ['accent-hue', '277', 'number', 'OKLCH hue of the accent ramp when data-accent="custom".'],
  ['accent-chroma', '1', 'number', 'Chroma multiplier for data-accent="custom" (0 = grey, 1 = full).'],
  ['radius-base', '0.25rem', 'dimension', 'Base corner radius; the radius scale multiplies it.'],
  ['density', '1', 'number', 'Spacing and control-height multiplier (compact 0.85, spacious 1.15).'],
  ['type-base', '13px', 'dimension', 'Body font size (font-size-md); the text scale is built from it.'],
  ['type-ratio', '1.2', 'number', 'Modular scale ratio between text sizes.'],
  ['motion-scale', '1', 'number', 'Multiplier for every duration. 0 under prefers-reduced-motion.'],
  ['contrast', '0', 'number', '0 = standard, 1 = more contrast (muted text and borders move toward the foreground).'],
].map(([name, value, type, description]) => ({ name, value, type, description, tier: 'knob' }));

// ── Tier 0: reference ────────────────────────────────────────────────────────────────────────
for (const hue of HUES) {
  for (const step of STEPS) {
    add(`ref-${hue}-${step}`, hues[hue][step], { tier: 0, type: 'color', group: 'ref-color' });
  }
}
add('ref-white', '#ffffff', { tier: 0, type: 'color', group: 'ref-color' });
add('ref-black', '#000000', { tier: 0, type: 'color', group: 'ref-color' });
add('ref-space-unit', '0.25rem', { tier: 0, type: 'dimension', description: 'One spacing step.' });

// ── Palettes (tier 1 inputs, reassigned by data-accent / data-neutral) ───────────────────────
export const palettes = [];
for (const [intent, hue] of Object.entries(INTENTS)) {
  for (const step of STEPS) {
    palettes.push({
      name: `palette-${intent}-${step}`,
      value: v(`ref-${hue}-${step}`),
      tier: 'palette',
      type: 'color',
      intent,
    });
  }
}

// ── Tier 1: themed ramps ─────────────────────────────────────────────────────────────────────
// Tailwind's "neutral" hue gets no themed ramp of its own: --pada-color-neutral-* is the neutral
// intent (stone by default). It stays available as --pada-ref-neutral-* and data-neutral="neutral".
for (const hue of HUES.filter((name) => !(name in INTENTS))) {
  for (const step of STEPS) {
    add(`color-${hue}-${step}`, ld(v(`ref-${hue}-${step}`), v(`ref-${hue}-${DARK_STEP[step]}`)), {
      type: 'color',
      group: 'hue-ramp',
      description: `${hue} ${step}; dark mode reads step ${DARK_STEP[step]}.`,
    });
  }
}
for (const intent of Object.keys(INTENTS)) {
  for (const step of STEPS) {
    add(
      `color-${intent}-${step}`,
      ld(v(`palette-${intent}-${step}`), v(`palette-${intent}-${DARK_STEP[step]}`)),
      { type: 'color', group: 'intent-ramp' },
    );
  }
}

// ── Tier 1 + 2: intent roles ─────────────────────────────────────────────────────────────────
// Text on a solid fill is picked from the fill's WCAG relative luminance with relative colour
// syntax: white below 0.179, black above. That is where white and black have equal contrast, so
// the better of the two always reaches at least 4.58:1, for any fill and any data-accent. Channels
// are clamped first because out-of-gamut fills (data-accent="custom") are clipped to sRGB on screen.
const luminance = '(0.2126 * clamp(0, r, 1) + 0.7152 * clamp(0, g, 1) + 0.0722 * clamp(0, b, 1))';
const onSolid = (solid) => {
  const channel = `clamp(0, (0.179 - ${luminance}) * 100000, 1)`;
  return `color(from ${v(solid)} srgb-linear ${channel} ${channel} ${channel})`;
};
// Hover and pressed fills move away from the on-solid text (darker under white text, lighter
// under black), so they keep at least the contrast of the resting fill.
const awayFromText = (intent) => `oklch(from ${v(`color-${intent}-on-solid`)} calc(1 - l) 0 0)`;
for (const intent of Object.keys(INTENTS)) {
  const p = (step) => v(`palette-${intent}-${step}`);
  const role = (suffix, value, tier, description) =>
    add(`color-${intent}-${suffix}`, value, { tier, type: 'color', group: 'intent-role', description });
  // Dark mode uses step 500 nudged 30% toward 600, so indigo, violet and the other mid-tone
  // accents keep white text.
  role('solid', ld(p(600), `color-mix(in oklch, ${p(500)}, ${p(600)} 30%)`), 1, `Filled ${intent} backgrounds (buttons, selected states).`);
  role('solid-hover', `color-mix(in oklch, ${v(`color-${intent}-solid`)}, ${awayFromText(intent)} 12%)`, 2, 'Hover on solid: 12% away from the on-solid text.');
  role('solid-pressed', `color-mix(in oklch, ${v(`color-${intent}-solid`)}, ${awayFromText(intent)} 22%)`, 2, 'Pressed solid: 22% away from the on-solid text.');
  role('on-solid', onSolid(`color-${intent}-solid`), 2, 'Text and icons on the solid fill: white or black, whichever has more contrast.');
  role('subtle', ld(p(50), p(950)), 1, `Tinted ${intent} backgrounds.`);
  role('subtle-hover', `color-mix(in oklch, ${v(`color-${intent}-subtle`)}, ${v(`color-${intent}-solid`)} 10%)`, 2, 'Hover on subtle: 10% toward the solid.');
  role('fg', ld(p(700), p(300)), 1, `${intent} text on surfaces.`);
  role('border', ld(p(200), p(800)), 1, `${intent} borders.`);
}

// ── Tier 1 + 2: surfaces, text, borders ──────────────────────────────────────────────────────
const n = (step) => v(`palette-neutral-${step}`);
const withContrast = (base, amount) =>
  `color-mix(in oklch, ${base}, ${v('color-fg')} calc(var(--pada-contrast) * ${amount}%))`;
const surface = (name, value, description) =>
  add(`color-${name}`, value, { type: 'color', group: 'surface', description });
surface('surface', ld(v('ref-white'), n(900)), 'Default page and component background.');
surface('surface-sunken', ld(n(50), n(950)), 'Recessed areas: wells, table headers, code.');
surface('surface-raised', ld(v('ref-white'), n(800)), 'Cards and panels above the page.');
surface('surface-overlay', ld(v('ref-white'), n(800)), 'Popovers, menus, dialogs.');
surface('surface-inverse', ld(n(900), n(50)), 'Inverted surfaces such as tooltips.');
surface('backdrop', ld('rgb(0 0 0 / 0.5)', 'rgb(0 0 0 / 0.7)'), 'Scrim behind modal overlays.');
surface('static-white', v('ref-white'), 'White in every theme.');
surface('static-black', v('ref-black'), 'Black in every theme.');

const text = (name, value, tier, description) =>
  add(`color-${name}`, value, { tier, type: 'color', group: 'text', description });
text('fg', ld(n(900), n(50)), 1, 'Primary text.');
text('fg-muted', withContrast(ld(n(600), n(400)), 60), 2, 'Secondary text. Moves toward fg with the contrast knob.');
text('fg-subtle', withContrast(ld(n(500), `color-mix(in oklch, ${n(500)}, ${n(400)} 65%)`), 60), 2, 'Placeholders and tertiary text. At least 4.5:1 on every surface.');
text('fg-disabled', ld(n(400), n(600)), 1, 'Disabled text.');
text('fg-on-inverse', ld(v('ref-white'), n(900)), 1, 'Text on surface-inverse.');
text('fg-link', v('color-accent-fg'), 1, 'Links.');

const border = (name, value, tier, description) =>
  add(`color-${name}`, value, { tier, type: 'color', group: 'border', description });
border('border', withContrast(ld(n(200), n(700)), 50), 2, 'Default borders and dividers.');
border('border-strong', withContrast(ld(n(300), n(600)), 50), 2, 'Input borders and emphasised dividers.');
border('border-subtle', ld(n(100), n(800)), 1, 'Faint separators.');
border('focus-ring', ld(v('palette-accent-500'), v('palette-accent-400')), 1, 'Focus outline colour.');

// ── Spacing, radius, sizes (tier 2: knob-driven) ─────────────────────────────────────────────
add('space-0', '0px', { type: 'dimension', group: 'space' });
add('space-px', '1px', { type: 'dimension', group: 'space' });
for (const step of SPACE_STEPS) {
  const factor = step.replace('-5', '.5');
  add(`space-${step}`, `calc(${factor} * var(--pada-ref-space-unit) * var(--pada-density))`, {
    tier: 2, type: 'dimension', group: 'space', description: `${factor} × space unit × density.`,
  });
}

const RADIUS = { xs: 0.5, sm: 1, md: 1.5, lg: 2, xl: 3, '2xl': 4, '3xl': 6 };
add('radius-none', '0px', { type: 'dimension', group: 'radius' });
for (const [name, factor] of Object.entries(RADIUS)) {
  add(`radius-${name}`, `calc(var(--pada-radius-base) * ${factor})`, {
    tier: 2, type: 'dimension', group: 'radius', description: `${factor} × radius-base.`,
  });
}
add('radius-full', '9999px', { type: 'dimension', group: 'radius' });

for (const [name, units] of Object.entries({ sm: 7, md: 8, lg: 10 })) {
  add(`control-height-${name}`, `calc(${units} * var(--pada-ref-space-unit) * var(--pada-density))`, {
    tier: 2, type: 'dimension', group: 'size', description: 'Height of buttons, inputs and selects.',
  });
}
for (const [name, px] of Object.entries({ sm: 12, md: 16, lg: 20 })) {
  add(`icon-size-${name}`, `${px}px`, { type: 'dimension', group: 'size' });
}

// ── Typography ───────────────────────────────────────────────────────────────────────────────
add('font-sans', '"SF Pro", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"', { type: 'fontFamily', group: 'font' });
add('font-serif', 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif', { type: 'fontFamily', group: 'font' });
add('font-mono', 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace', { type: 'fontFamily', group: 'font' });
for (const [name, weight] of Object.entries({ regular: 400, medium: 500, semibold: 600, bold: 700 })) {
  add(`font-weight-${name}`, String(weight), { type: 'fontWeight', group: 'font' });
}
for (const [name, power] of Object.entries({ xs: -2, sm: -1, md: 0, lg: 1, xl: 2 })) {
  add(
    `font-size-${name}`,
    power === 0 ? 'var(--pada-type-base)' : `calc(var(--pada-type-base) * pow(var(--pada-type-ratio), ${power}))`,
    { tier: 2, type: 'dimension', group: 'font-size', description: `type-base × type-ratio^${power}.` },
  );
}
for (const [name, px] of Object.entries({ '2xl': 24, '3xl': 30, '4xl': 36, '5xl': 48, '6xl': 60, '7xl': 72, '8xl': 96, '9xl': 128 })) {
  add(`font-size-${name}`, `${px}px`, { type: 'dimension', group: 'font-size', description: 'Display size.' });
}
for (const [name, value] of Object.entries({ xs: '1', sm: '1.25', md: '1.5', lg: '1.625', xl: '2', '2xl': '2.5' })) {
  add(`line-height-${name}`, value, { type: 'number', group: 'line-height' });
}
for (const [name, value] of Object.entries({ xs: '-0.05em', sm: '-0.025em', md: '0em', lg: '0.025em', xl: '0.05em', '2xl': '0.1em' })) {
  add(`letter-spacing-${name}`, value, { type: 'dimension', group: 'letter-spacing' });
}

// ── Elevation, focus, gradients ──────────────────────────────────────────────────────────────
const SHADOWS = {
  xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
};
for (const [name, value] of Object.entries(SHADOWS)) {
  add(`shadow-${name}`, value, { type: 'shadow', group: 'shadow' });
}
add('focus-ring-width', '2px', { type: 'dimension', group: 'focus' });
add('focus-ring-offset', '2px', { type: 'dimension', group: 'focus' });
add(
  'shadow-focus',
  `0 0 0 var(--pada-focus-ring-offset) ${v('color-surface')}, 0 0 0 calc(var(--pada-focus-ring-offset) + var(--pada-focus-ring-width)) ${v('color-focus-ring')}`,
  { tier: 2, type: 'shadow', group: 'focus', description: 'Focus ring as a box-shadow: a surface-coloured gap, then the ring.' },
);
['xs', 'sm', 'md', 'lg', 'xl', '2xl'].forEach((name, index) => {
  const step = ['50', '100', '200', '300', '400', '500'][index];
  add(`gradient-${name}`, `linear-gradient(45deg, ${v(`ref-purple-${step}`)}, ${v(`ref-fuchsia-${step}`)})`, {
    type: 'gradient', group: 'gradient',
  });
});

// ── Motion ───────────────────────────────────────────────────────────────────────────────────
for (const [name, ms] of Object.entries({ instant: 50, fast: 120, normal: 200, slow: 320, slower: 480 })) {
  add(`duration-${name}`, `calc(${ms}ms * var(--pada-motion-scale))`, {
    tier: 2, type: 'duration', group: 'motion', description: `${ms}ms × motion-scale.`,
  });
}
const EASINGS = {
  standard: 'cubic-bezier(0.2, 0, 0, 1)',
  enter: 'cubic-bezier(0, 0, 0.2, 1)',
  exit: 'cubic-bezier(0.4, 0, 1, 1)',
  emphasized: 'cubic-bezier(0.22, 1, 0.36, 1)',
  spring: 'linear(0, 0.5 7%, 0.94 19%, 1.04 27%, 1.01 36%, 1)',
};
for (const [name, value] of Object.entries(EASINGS)) {
  add(`ease-${name}`, value, { type: 'cubicBezier', group: 'motion' });
}
add('motion-distance-sm', '4px', { type: 'dimension', group: 'motion' });
add('motion-distance-md', '8px', { type: 'dimension', group: 'motion' });
add('motion-scale-enter', '0.96', { type: 'number', group: 'motion' });
add('motion-scale-press', '0.97', { type: 'number', group: 'motion' });

// ── Layers, opacity, borders, breakpoints ────────────────────────────────────────────────────
const LAYERS = { base: 0, raised: 10, dropdown: 1000, sticky: 1100, overlay: 1200, modal: 1300, popover: 1400, toast: 1500, tooltip: 1600 };
for (const [name, value] of Object.entries(LAYERS)) {
  add(`z-${name}`, String(value), { type: 'number', group: 'z-index' });
}
for (const [name, value] of Object.entries({ disabled: '0.5', muted: '0.7' })) {
  add(`opacity-${name}`, value, { type: 'number', group: 'opacity' });
}
for (const [name, value] of Object.entries({ thin: '1px', thick: '2px' })) {
  add(`border-width-${name}`, value, { type: 'dimension', group: 'border-width' });
}
for (const [name, px] of Object.entries(BREAKPOINTS)) {
  add(`breakpoint-${name}`, `${px}px`, {
    type: 'dimension', group: 'breakpoint',
    description: 'For reference from JS; media queries cannot read custom properties (use tokens.scss or tokens.js).',
  });
}

export { tokens };

// ── Theme axes ───────────────────────────────────────────────────────────────────────────────
const accentPalette = (hue) =>
  Object.fromEntries(STEPS.map((step) => [`palette-accent-${step}`, v(`ref-${hue}-${step}`)]));
const customAccent = Object.fromEntries(
  STEPS.map((step) => {
    const [l, c] = CUSTOM_RAMP[step];
    return [`palette-accent-${step}`, `oklch(${l} calc(${c} * var(--pada-accent-chroma)) var(--pada-accent-hue))`];
  }),
);
const neutralPalette = (hue) =>
  Object.fromEntries(STEPS.map((step) => [`palette-neutral-${step}`, v(`ref-${hue}-${step}`)]));

export const axes = {
  accent: {
    ...Object.fromEntries(HUES.map((hue) => [hue, accentPalette(hue)])),
    custom: customAccent,
  },
  neutral: Object.fromEntries(['slate', 'gray', 'zinc', 'neutral', 'stone'].map((hue) => [hue, neutralPalette(hue)])),
  density: {
    compact: { density: '0.85' },
    comfortable: { density: '1' },
    spacious: { density: '1.15' },
  },
  radius: {
    none: { 'radius-base': '0px' },
    sm: { 'radius-base': '0.125rem' },
    md: { 'radius-base': '0.25rem' },
    lg: { 'radius-base': '0.375rem' },
    xl: { 'radius-base': '0.5rem' },
  },
  motion: {
    reduced: { 'motion-scale': '0' },
    full: { 'motion-scale': '1' },
  },
  contrast: {
    standard: { contrast: '0' },
    more: { contrast: '1' },
  },
};

// Media queries that set knobs on :root before any attribute is applied.
export const mediaDefaults = [
  { query: '(prefers-reduced-motion: reduce)', knobs: { 'motion-scale': '0' } },
  { query: '(prefers-contrast: more)', knobs: { contrast: '1' } },
];

// ── Legacy 1.x names ─────────────────────────────────────────────────────────────────────────
// Every custom property Pada 1.x defined keeps working in 2.x as an alias. Removed in 3.0.
const LEGACY_RADIUS = {
  'radius-none': 'radius-none', 'radius-sm': 'radius-xs', radius: 'radius-sm', 'radius-md': 'radius-md',
  'radius-lg': 'radius-lg', 'radius-xl': 'radius-xl', 'radius-2xl': 'radius-2xl', 'radius-3xl': 'radius-3xl',
  'radius-full': 'radius-full',
};
const LEGACY_RADIUS_FACTOR = { '4xl': 8, '5xl': 10, '6xl': 12, '7xl': 14, '8xl': 16 };
const LEGACY_SHADOW = { 'shadow-sm': 'shadow-xs', shadow: 'shadow-sm', 'shadow-focus-ring': 'shadow-focus' };
const LEGACY_NAMED = {
  'color-bg': v('color-surface'),
  'color-fg': v('color-fg'),
  'color-fg-muted': v('color-fg-muted'),
  'color-border': v('color-border'),
  'color-focus-ring': v('color-focus-ring'),
  'color-white': ld(v('ref-white'), v('ref-black')),
  'color-black': ld(v('ref-black'), v('ref-white')),
  'color-end-white': v('color-static-white'),
  'color-end-black': v('color-static-black'),
  'font-family-sans': v('font-sans'),
  'font-family-serif': v('font-serif'),
  'font-family-mono': v('font-mono'),
  'font-size-base': v('font-size-md'),
  'line-height-base': v('line-height-md'),
  'letter-spacing-base': v('letter-spacing-md'),
  'z-index-auto': 'auto',
};

export function legacyAlias(name) {
  const bare = name.replace(/^--/, '');
  let match;
  if (LEGACY_NAMED[bare]) return LEGACY_NAMED[bare];
  if (LEGACY_RADIUS[bare]) return v(LEGACY_RADIUS[bare]);
  if ((match = bare.match(/^radius-(\dxl)$/)) && LEGACY_RADIUS_FACTOR[match[1]]) {
    return `calc(var(--pada-radius-base) * ${LEGACY_RADIUS_FACTOR[match[1]]})`;
  }
  if (LEGACY_SHADOW[bare]) return v(LEGACY_SHADOW[bare]);
  if ((match = bare.match(/^color-primary-(\d+)$/))) return v(`color-accent-${match[1]}`);
  if ((match = bare.match(/^color-secondary-(\d+)$/))) return v(`color-amber-${match[1]}`);
  if ((match = bare.match(/^color-neutral-(\d+)$/))) return v(`color-neutral-${match[1]}`);
  if ((match = bare.match(/^color-accent-(\d+)$/))) return v(`color-purple-${match[1]}`);
  if ((match = bare.match(/^color-accent-neutral-(\d+)$/))) return v(`color-stone-${match[1]}`);
  if ((match = bare.match(/^color-accent-([a-z]+)-(\d+)$/))) return v(`color-${match[1]}-${match[2]}`);
  if ((match = bare.match(/^color-([a-z]+)-(\d+)$/)) && HUES.includes(match[1])) return v(`ref-${match[1]}-${match[2]}`);
  if ((match = bare.match(/^(?:spacing|size)-(.+)$/))) return v(`space-${match[1]}`);
  if ((match = bare.match(/^z-index-(\d+)$/))) return match[1];
  if ((match = bare.match(/^(font-size|line-height|letter-spacing|gradient|shadow)-(.+)$/))) return v(`${match[1]}-${match[2]}`);
  return null;
}

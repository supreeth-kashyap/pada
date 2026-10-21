// Foundation blocks for the Docs pages of both Storybooks (colour ramps, type, space, radius,
// elevation, motion, knobs and token tables). Everything is drawn from the live --pada-* tokens.
// createElement, not JSX, so the file compiles in the React and the Angular Storybook. Synced to
// pada-ds-angular by scripts/sync-storybook-angular.mjs; edit it in the pada repo.
import { createElement as h, useEffect, useMemo, useRef, useState } from 'react';
import docs from './docs-data';

const data = docs as unknown as {
  tokenStats: Record<'reference' | 'palette' | 'semantic' | 'derived' | 'knobs' | 'component', number>;
  colorTokens: string[];
};

const HUES = ['slate', 'gray', 'zinc', 'neutral', 'stone', 'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose'];
const STEPS = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];
const INTENTS = ['accent', 'neutral', 'success', 'warning', 'danger', 'info'];

/** The value a custom property (or an expression of one) resolves to on <html>, kept up to date. */
function useResolved(name: string, as: 'raw' | 'color' | 'length') {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState('');
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const read = () => {
      if (as === 'raw') return setValue(getComputedStyle(el).getPropertyValue(name).trim());
      const property = as === 'color' ? 'color' : 'width';
      el.style.setProperty(property, `var(${name})`);
      setValue(getComputedStyle(el).getPropertyValue(property));
      el.style.removeProperty(property);
    };
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, [name, as]);
  return { ref, value };
}

export function TokenValue({ name, as = 'raw' }: { name: string; as?: 'raw' | 'color' | 'length' }) {
  const { ref, value } = useResolved(name, as);
  return h('span', { ref, className: 'pada-doc-value' }, value);
}

export function ColorRamps() {
  return h(
    'div',
    { className: 'pada-fd-ramps' },
    HUES.map((hue) =>
      h(
        'div',
        { key: hue, className: 'pada-fd-ramp' },
        h('code', null, hue),
        h(
          'div',
          { className: 'pada-fd-steps' },
          STEPS.map((step) =>
            h('span', { key: step, title: `--pada-ref-${hue}-${step}`, style: { background: `var(--pada-ref-${hue}-${step})` } }),
          ),
        ),
      ),
    ),
  );
}

export function IntentSwatches() {
  return h(
    'div',
    { className: 'pada-fd-intents' },
    INTENTS.map((intent) =>
      h(
        'div',
        { key: intent, className: 'pada-fd-intent' },
        h('strong', null, intent),
        ['solid', 'solid-hover', 'on-solid', 'subtle', 'fg', 'border'].map((role) =>
          h(
            'div',
            { key: role, className: 'pada-fd-intent-row' },
            h('span', { className: 'pada-doc-swatch', style: { background: `var(--pada-color-${intent}-${role})` } }),
            h('code', null, `-${role}`),
          ),
        ),
      ),
    ),
  );
}

export function ColorTokenTable() {
  const [query, setQuery] = useState('');
  const names = useMemo(() => data.colorTokens.filter((n) => n.includes(query.trim().toLowerCase())), [query]);
  return h(
    'div',
    null,
    h('input', {
      className: 'pada-doc-filter',
      type: 'search',
      placeholder: `Filter ${data.colorTokens.length} colour tokens`,
      'aria-label': 'Filter colour tokens',
      value: query,
      onChange: (e: { currentTarget: { value: string } }) => setQuery(e.currentTarget.value),
    }),
    h(
      'div',
      { className: 'pada-doc-table-wrap pada-doc-scroll' },
      h(
        'table',
        { className: 'pada-doc-table' },
        h('thead', null, h('tr', null, h('th', null, 'Token'), h('th', null, 'Now'))),
        h(
          'tbody',
          null,
          names.map((name) =>
            h(
              'tr',
              { key: name },
              h('td', null, h('span', { className: 'pada-doc-swatch', style: { background: `var(${name})` } }), h('code', null, name)),
              h('td', null, h(TokenValue, { name, as: 'color' })),
            ),
          ),
        ),
      ),
    ),
  );
}

export function TypeScale() {
  return h(
    'div',
    { className: 'pada-fd-rows' },
    ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'].map((step) =>
      h(
        'div',
        { key: step, className: 'pada-fd-type' },
        h('code', null, `--pada-font-size-${step}`, ' · ', h(TokenValue, { name: `--pada-font-size-${step}`, as: 'length' })),
        h('span', { style: { fontSize: `var(--pada-font-size-${step})`, lineHeight: 1.2 } }, 'The foundation your product stands on'),
      ),
    ),
  );
}

export function SpaceScale() {
  return h(
    'div',
    { className: 'pada-fd-rows' },
    ['0-5', '1', '1-5', '2', '3', '4', '5', '6', '8', '10', '12', '16', '20', '24'].map((step) =>
      h(
        'div',
        { key: step, className: 'pada-fd-space' },
        h('code', null, `--pada-space-${step}`),
        h('span', { className: 'pada-fd-bar', style: { width: `var(--pada-space-${step})` } }),
        h(TokenValue, { name: `--pada-space-${step}`, as: 'length' }),
      ),
    ),
  );
}

export function ControlHeights() {
  return h(
    'div',
    { className: 'pada-fd-rows' },
    ['sm', 'md', 'lg'].map((size) =>
      h(
        'div',
        { key: size, className: 'pada-fd-space' },
        h('code', null, `--pada-control-height-${size}`),
        h('span', { className: 'pada-fd-bar', style: { width: `var(--pada-control-height-${size})`, height: `var(--pada-control-height-${size})` } }),
        h(TokenValue, { name: `--pada-control-height-${size}`, as: 'length' }),
      ),
    ),
  );
}

export function RadiusScale() {
  return h(
    'div',
    { className: 'pada-fd-tiles' },
    ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', 'full'].map((r) =>
      h('div', { key: r, className: 'pada-fd-tile' }, h('span', { className: 'pada-fd-radius', style: { borderRadius: `var(--pada-radius-${r})` } }), h('code', null, r)),
    ),
  );
}

export function ShadowScale() {
  return h(
    'div',
    { className: 'pada-fd-tiles' },
    ['xs', 'sm', 'md', 'lg', 'xl', '2xl'].map((s) =>
      h('div', { key: s, className: 'pada-fd-shadow', style: { boxShadow: `var(--pada-shadow-${s})` } }, h('code', null, s)),
    ),
  );
}

export function MotionScale() {
  const [moved, setMoved] = useState(false);
  return h(
    'div',
    { className: 'pada-fd-motion' },
    h('button', { type: 'button', className: 'pada-doc-copy', onClick: () => setMoved((m) => !m) }, moved ? 'Back' : 'Play'),
    ['standard', 'enter', 'exit', 'emphasized', 'spring'].map((ease) =>
      h(
        'div',
        { key: ease, className: 'pada-fd-lane' },
        h('code', null, `--pada-ease-${ease}`),
        h(
          'div',
          { className: 'pada-fd-track' },
          h('span', { className: 'pada-fd-dot', 'data-moved': moved ? '' : undefined, style: { transitionTimingFunction: `var(--pada-ease-${ease})` } }),
        ),
      ),
    ),
    h(
      'div',
      { className: 'pada-fd-durations' },
      ['instant', 'fast', 'normal', 'slow', 'slower'].map((d) =>
        h('span', { key: d }, h('code', null, `--pada-duration-${d}`), ' ', h(TokenValue, { name: `--pada-duration-${d}` })),
      ),
    ),
  );
}

const KNOBS: [string, string][] = [
  ['--pada-accent-hue', 'Hue of the custom accent (data-accent="custom")'],
  ['--pada-accent-chroma', 'Saturation of the custom accent'],
  ['--pada-radius-base', 'Every radius is a multiple of it (data-radius)'],
  ['--pada-density', 'Multiplies spacing and control heights (data-density)'],
  ['--pada-type-base', 'The body font size'],
  ['--pada-type-ratio', 'The ratio between font-size steps'],
  ['--pada-motion-scale', 'Multiplies durations; 0 under reduced motion (data-motion)'],
  ['--pada-contrast', 'Pushes borders and muted text to full contrast (data-contrast)'],
];

export function KnobTable() {
  return h(
    'div',
    { className: 'pada-doc-table-wrap' },
    h(
      'table',
      { className: 'pada-doc-table' },
      h('thead', null, h('tr', null, h('th', null, 'Knob'), h('th', null, 'Now'), h('th', null, 'What it does'))),
      h(
        'tbody',
        null,
        KNOBS.map(([name, what]) => h('tr', { key: name }, h('td', null, h('code', null, name)), h('td', null, h(TokenValue, { name })), h('td', null, what))),
      ),
    ),
  );
}

export function TierDiagram() {
  const tiers: [string, string, number, string][] = [
    ['Component', '--pada-button-bg', data.tokenStats.component, 'Declared by each component; variants reassign them.'],
    ['Derived', '--pada-color-accent-solid-hover', data.tokenStats.derived, 'calc() and color-mix() on semantic tokens and knobs.'],
    ['Semantic', '--pada-color-accent-solid', data.tokenStats.semantic, 'Meaning; light and dark in one light-dark() value.'],
    ['Palette', '--pada-palette-accent-600', data.tokenStats.palette, 'Ramps by intent; data-accent / data-neutral swap them.'],
    ['Reference', '--pada-ref-indigo-600', data.tokenStats.reference, 'Raw colours and scales; components never read them.'],
  ];
  return h(
    'ol',
    { className: 'pada-fd-tiers' },
    tiers.map(([label, example, count, note], i) =>
      h(
        'li',
        { key: label, style: { marginLeft: `${i * 14}px` } },
        h('span', { className: 'pada-fd-tier-num' }, String(i + 1)),
        h('div', null, h('strong', null, label), ' ', h('span', { className: 'pada-doc-muted' }, `${count} tokens`), h('p', null, note), h('code', null, example)),
      ),
    ),
  );
}

import { useEffect, useRef, useState } from 'react';
import { ToggleGroup } from 'pada-ds';
import { Link as RouterLink } from 'react-router-dom';
import { docs } from '../lib/docs';
import { ROUTES } from '../lib/paths';
import { ArrowRight } from '../shell/icons';

type Tier = 'component' | 'derived' | 'semantic' | 'palette' | 'reference' | 'knob';

interface ChainNode {
  tier: Tier;
  name: string;
  value: string;
  kind?: 'color' | 'length';
}

const CHAINS: Record<string, { label: string; knob: string; nodes: ChainNode[] }> = {
  colour: {
    label: 'Button colour',
    knob: 'data-accent · data-theme',
    nodes: [
      { tier: 'component', name: '--pada-button-bg', value: 'var(--pada-color-accent-solid)', kind: 'color' },
      { tier: 'semantic', name: '--pada-color-accent-solid', value: 'light-dark(var(--pada-palette-accent-600), var(--pada-palette-accent-500))', kind: 'color' },
      { tier: 'palette', name: '--pada-palette-accent-600', value: 'var(--pada-ref-indigo-600)', kind: 'color' },
      { tier: 'reference', name: '--pada-ref-indigo-600', value: '#4f46e5', kind: 'color' },
    ],
  },
  size: {
    label: 'Control height',
    knob: 'data-density',
    nodes: [
      { tier: 'component', name: '--pada-button-height', value: 'var(--pada-control-height-md)', kind: 'length' },
      { tier: 'derived', name: '--pada-control-height-md', value: 'calc(8 × var(--pada-ref-space-unit) × var(--pada-density))', kind: 'length' },
      { tier: 'knob', name: '--pada-density', value: '0.85 · 1 · 1.15' },
      { tier: 'reference', name: '--pada-ref-space-unit', value: '0.25rem', kind: 'length' },
    ],
  },
  radius: {
    label: 'Corner radius',
    knob: 'data-radius',
    nodes: [
      { tier: 'component', name: '--pada-dialog-radius', value: 'var(--pada-radius-2xl)', kind: 'length' },
      { tier: 'derived', name: '--pada-radius-2xl', value: 'calc(var(--pada-radius-base) × 4)', kind: 'length' },
      { tier: 'knob', name: '--pada-radius-base', value: '0 · .125 · .25 · .375 · .5rem', kind: 'length' },
    ],
  },
  type: {
    label: 'Type size',
    knob: '--pada-type-base · --pada-type-ratio',
    nodes: [
      { tier: 'component', name: '--pada-button-font-size', value: 'var(--pada-font-size-md)', kind: 'length' },
      { tier: 'derived', name: '--pada-font-size-lg', value: 'calc(var(--pada-type-base) × var(--pada-type-ratio))', kind: 'length' },
      { tier: 'knob', name: '--pada-type-base', value: '13px', kind: 'length' },
    ],
  },
};

const TIERS: { id: Tier; label: string; count: number; example: string; note: string }[] = [
  { id: 'component', label: 'Component', count: docs.tokenStats.component, example: '--pada-button-bg', note: 'Declared by each component; variants only reassign these.' },
  { id: 'derived', label: 'Derived', count: docs.tokenStats.derived, example: '--pada-color-accent-solid-hover', note: 'calc() and color-mix() on semantic tokens and the knobs.' },
  { id: 'semantic', label: 'Semantic', count: docs.tokenStats.semantic, example: '--pada-color-fg-muted', note: 'Meaning, with light and dark in one light-dark() value.' },
  { id: 'palette', label: 'Palette', count: docs.tokenStats.palette, example: '--pada-palette-accent-600', note: 'Ramps by intent: accent, neutral, success, warning, danger, info.' },
  { id: 'reference', label: 'Reference', count: docs.tokenStats.reference, example: '--pada-ref-indigo-600', note: 'Raw colours and scales. Components never read them.' },
];

/**
 * Resolves each node to the value the browser actually uses in the current theme: colours through
 * a probe's `color`, lengths through its `width`. Component tokens are declared on the component's
 * own class, so they resolve through the token they point at.
 */
function useResolved(nodes: ChainNode[]) {
  const probe = useRef<HTMLSpanElement>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  useEffect(() => {
    const el = probe.current;
    if (!el) return;
    const resolve = (name: string, kind: ChainNode['kind']) => {
      const property = kind === 'color' ? 'color' : 'width';
      el.style.setProperty(property, `var(${name})`);
      const value = getComputedStyle(el).getPropertyValue(property);
      el.style.removeProperty(property);
      return getComputedStyle(el).getPropertyValue(name).trim() ? value : '';
    };
    const read = () => {
      const out: Record<string, string> = {};
      for (let i = nodes.length - 1; i >= 0; i--) {
        const node = nodes[i];
        if (!node.kind) continue;
        out[node.name] = resolve(node.name, node.kind) || (nodes[i + 1] ? out[nodes[i + 1].name] ?? '' : '');
      }
      setValues(out);
    };
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'data-accent', 'data-density', 'data-radius'] });
    const scheme = window.matchMedia('(prefers-color-scheme: dark)');
    scheme.addEventListener('change', read);
    return () => {
      observer.disconnect();
      scheme.removeEventListener('change', read);
    };
  }, [nodes]);
  return { probe, values };
}

export function TokenArchitecture() {
  const [chainId, setChainId] = useState('colour');
  const chain = CHAINS[chainId];
  const { probe, values } = useResolved(chain.nodes);
  const { component, derived, semantic, palette, reference } = docs.tokenStats;
  const total = component + derived + semantic + palette + reference;

  return (
    <section className="section tokens-arch" id="tokens" aria-labelledby="tokens-title">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <p className="eyebrow">Token architecture</p>
          <h2 id="tokens-title" className="h2">
            Five tiers. <span className="serif">Eight knobs.</span>
          </h2>
          <p className="lede">
            {total.toLocaleString('en')} custom properties, in a chain: component tokens point at derived and semantic
            ones, which point at palettes, which point at raw reference values. Knobs feed the derived tier, so one
            attribute moves everything that depends on it.
          </p>
        </div>

        <div className="ta-grid">
          <ol className="ta-stack" aria-label="Token tiers, from component to reference" data-reveal>
            {TIERS.map((tier, i) => (
              <li
                key={tier.id}
                className="ta-plate"
                data-tier={tier.id}
                data-active={chain.nodes.some((n) => n.tier === tier.id) ? '' : undefined}
                style={{ ['--i' as string]: i }}
              >
                <div className="ta-plate-head">
                  <span className="ta-tier-num">{String(i + 1).padStart(2, '0')}</span>
                  <strong>{tier.label}</strong>
                  <span className="ta-count">{tier.count}</span>
                </div>
                <code>{tier.example}</code>
                <p>{tier.note}</p>
              </li>
            ))}
            <li className="ta-knobs" data-active={chain.nodes.some((n) => n.tier === 'knob') ? '' : undefined}>
              <strong>Knobs</strong>
              <span>accent-hue · density · radius-base · type-base · type-ratio · motion-scale · contrast</span>
            </li>
          </ol>

          <div className="ta-trace" data-reveal style={{ ['--reveal-delay' as string]: '0.1s' }}>
            <div className="ta-trace-head">
              <span>Trace a token</span>
              <ToggleGroup.Root type="single" size="sm" aria-label="Token chain" value={chainId} onValueChange={(v) => v && setChainId(v)}>
                {Object.entries(CHAINS).map(([id, c]) => (
                  <ToggleGroup.Item key={id} value={id}>{c.label}</ToggleGroup.Item>
                ))}
              </ToggleGroup.Root>
            </div>
            <span ref={probe} className="ta-probe" aria-hidden="true" />
            <ol className="ta-chain" key={chainId}>
              {chain.nodes.map((node, i) => {
                const resolved = values[node.name];
                return (
                  <li key={node.name} className="ta-node" data-tier={node.tier} style={{ ['--i' as string]: i }}>
                    <span className="ta-node-tier">{node.tier}</span>
                    <code className="ta-node-name">{node.name}</code>
                    <code className="ta-node-value">{node.value}</code>
                    {resolved && node.kind === 'color' && (
                      <span className="ta-resolved">
                        <span className="ta-swatch" style={{ background: resolved }} />
                        {resolved}
                      </span>
                    )}
                    {resolved && node.kind === 'length' && <span className="ta-resolved">{resolved}</span>}
                  </li>
                );
              })}
            </ol>
            <p className="ta-knob-note">
              Moved by <code>{chain.knob}</code>. Switch the site theme or try the playground above: the swatches are live.
            </p>
            <RouterLink className="text-link" to={ROUTES.tokens}>
              Read the token guide <ArrowRight size={14} />
            </RouterLink>
          </div>
        </div>
      </div>
    </section>
  );
}

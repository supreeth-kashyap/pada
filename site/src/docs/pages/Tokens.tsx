import { useMemo, useState } from 'react';
import { CodeSnippet, SearchField } from 'pada-ds';
import tokensCss from '../../../../projects/pada-ds/src/styles/tokens.generated.css?raw';
import { docs } from '../../lib/docs';
import { DocHeader, DocSection, DocsLayout } from '../DocsLayout';
import { TokenValue } from '../TokenValue';

/** The semantic colour tokens and their light / dark definitions, read from the generated CSS. */
const SEMANTIC_COLOURS = (() => {
  const seen = new Map<string, string>();
  for (const [, name, value] of tokensCss.matchAll(/^\s*(--pada-color-[a-z0-9-]+)\s*:\s*([^;]+);/gm)) {
    if (!seen.has(name)) seen.set(name, value.trim());
  }
  return [...seen].map(([name, value]) => ({ name, value }));
})();

const TIERS = [
  ['Reference', '--pada-ref-*', '--pada-ref-indigo-600', docs.tokenStats.reference, 'Raw colour ramps and scales. Components never read them.'],
  ['Palette', '--pada-palette-<intent>-*', '--pada-palette-accent-600', docs.tokenStats.palette, 'Ramps by intent; data-accent and data-neutral swap them.'],
  ['Semantic', '--pada-color-*, --pada-font-* …', '--pada-color-fg-muted', docs.tokenStats.semantic, 'Meaning. Light and dark live in one light-dark() value.'],
  ['Derived', 'same names', '--pada-space-3', docs.tokenStats.derived, 'calc() and color-mix() on semantic tokens and the knobs.'],
  ['Component', '--pada-<component>-*', '--pada-button-bg', docs.tokenStats.component, 'Declared by each component. Variants only reassign these.'],
] as const;

const KNOBS = [
  ['--pada-accent-hue', 'Hue of the custom accent (with data-accent="custom")'],
  ['--pada-accent-chroma', 'Saturation of the custom accent'],
  ['--pada-radius-base', 'Every radius is a multiple of it (data-radius)'],
  ['--pada-density', 'Multiplies spacing and control heights (data-density)'],
  ['--pada-type-base', 'The body font size; other sizes are steps from it'],
  ['--pada-type-ratio', 'The ratio between font-size steps'],
  ['--pada-motion-scale', 'Multiplies every duration; 0 under reduced motion (data-motion)'],
  ['--pada-contrast', 'Pushes borders and muted text towards full contrast (data-contrast)'],
];

export function Tokens() {
  const [query, setQuery] = useState('');
  const colours = useMemo(() => SEMANTIC_COLOURS.filter((t) => t.name.includes(query.trim().toLowerCase())), [query]);

  return (
    <DocsLayout
      toc={[
        { id: 'tiers', label: 'Five tiers' },
        { id: 'knobs', label: 'Knobs' },
        { id: 'naming', label: 'Naming' },
        { id: 'using', label: 'Using tokens' },
        { id: 'formats', label: 'Formats' },
        { id: 'colours', label: 'Colour tokens' },
      ]}
    >
      <article className="doc">
        <DocHeader
          eyebrow="Guides"
          title="Design tokens"
          lede="Every colour, size, radius, shadow, duration and layer in Pada is a --pada-* custom property. They are generated from one model and layered so a change in one place flows everywhere it should, and nowhere else."
        />

        <DocSection id="tiers" title="Five tiers">
          <ol className="tier-list">
            {TIERS.map(([label, pattern, example, count, note], i) => (
              <li key={label} style={{ ['--i' as string]: i }}>
                <span className="tier-num">{i + 1}</span>
                <div>
                  <strong>{label}</strong> <span className="tier-count">{count} tokens</span>
                  <p>{note}</p>
                  <code>{pattern}</code> · <code>{example}</code>
                </div>
              </li>
            ))}
          </ol>
          <p>
            A component token points at a semantic or derived token, which points at a palette step, which points at a
            reference value: <code>--pada-button-bg</code> → <code>--pada-color-accent-solid</code> →{' '}
            <code>--pada-palette-accent-600</code> → <code>--pada-ref-indigo-600</code>.
          </p>
        </DocSection>

        <DocSection id="knobs" title="Knobs">
          <p>Eight plain custom properties drive the derived tier. The theme attributes set them for you; set them directly for values in between.</p>
          <div className="table-wrap">
            <table className="doc-table">
              <thead>
                <tr><th scope="col">Knob</th><th scope="col">Now</th><th scope="col">What it does</th></tr>
              </thead>
              <tbody>
                {KNOBS.map(([name, what]) => (
                  <tr key={name}>
                    <th scope="row"><code>{name}</code></th>
                    <td><TokenValue name={name} /></td>
                    <td>{what}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DocSection>

        <DocSection id="naming" title="Naming">
          <ul className="doc-list">
            <li>Colours by role, then intent, then variant: <code>--pada-color-danger-solid-hover</code>, <code>--pada-color-fg-muted</code>.</li>
            <li>Intents are <code>accent</code>, <code>neutral</code>, <code>success</code>, <code>warning</code>, <code>danger</code> and <code>info</code>; each has <code>-solid</code>, <code>-solid-hover</code>, <code>-on-solid</code>, <code>-subtle</code>, <code>-fg</code> and <code>-border</code>.</li>
            <li>Scales by step: <code>--pada-space-4</code> (4 × 0.25rem × density), <code>--pada-radius-lg</code>, <code>--pada-font-size-xl</code>, <code>--pada-shadow-md</code>.</li>
            <li>Motion and layers: <code>--pada-duration-fast</code>, <code>--pada-ease-emphasized</code>, <code>--pada-z-modal</code>.</li>
          </ul>
        </DocSection>

        <DocSection id="using" title="Using tokens in your CSS">
          <p>Style your own UI with semantic tokens, so it follows the theme, density and contrast like Pada's components do.</p>
          <CodeSnippet
            code={'.panel {\n  padding: var(--pada-space-4);\n  border: 1px solid var(--pada-color-border);\n  border-radius: var(--pada-radius-xl);\n  background: var(--pada-color-surface);\n  color: var(--pada-color-fg);\n  box-shadow: var(--pada-shadow-sm);\n  transition: box-shadow var(--pada-duration-fast) var(--pada-ease-standard);\n}'}
            language="css"
            type="multi-line"
            label="panel.css"
          />
          <p>Don't read <code>--pada-ref-*</code> or <code>--pada-palette-*</code> directly: those don't change with the theme the way semantic tokens do.</p>
        </DocSection>

        <DocSection id="formats" title="Formats">
          <ul className="doc-list">
            <li><code>pada-ds/tokens.css</code>: the custom properties only (light and dark).</li>
            <li><code>pada-ds/tokens.scss</code> and <code>pada-ds/tokens.json</code>: the same tokens for Sass and design tools.</li>
            <li><code>pada-ds/tokens</code>: token names as <code>var()</code> strings and the breakpoints, for JavaScript.</li>
            <li>The Angular package ships the same <code>tokens.css</code> and <code>_tokens.scss</code>, synced from one source.</li>
          </ul>
        </DocSection>

        <DocSection id="colours" title="Colour tokens">
          <p>Every semantic colour, with its value in the current theme. Switch the site theme to see them change.</p>
          <div className="index-search">
            <SearchField value={query} onChange={setQuery} placeholder="Filter colour tokens" aria-label="Filter colour tokens" />
          </div>
          <div className="table-wrap">
            <table className="doc-table token-table">
              <thead>
                <tr><th scope="col">Token</th><th scope="col">Now</th></tr>
              </thead>
              <tbody>
                {colours.map((t) => (
                  <tr key={t.name}>
                    <th scope="row">
                      <span className="swatch-dot" style={{ background: `var(${t.name})` }} />
                      <code>{t.name}</code>
                    </th>
                    <td><TokenValue name={t.name} as="color" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DocSection>
      </article>
    </DocsLayout>
  );
}

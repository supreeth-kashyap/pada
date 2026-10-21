import { Badge, Button, CodeSnippet, Switch } from 'pada-ds';
import { Link as RouterLink } from 'react-router-dom';
import { DocHeader, DocSection, DocsLayout } from '../DocsLayout';

const AXES = [
  ['data-theme', 'light, dark (unset follows the OS)', 'Light or dark colours, through light-dark()'],
  ['data-accent', '22 hues (indigo, emerald, rose …) or custom', 'The accent palette; custom builds an OKLCH ramp from --pada-accent-hue'],
  ['data-neutral', 'stone, slate, gray, zinc, neutral', 'Surfaces, text and borders'],
  ['data-density', 'compact, comfortable, spacious', 'Spacing and control heights (×0.85, ×1, ×1.15)'],
  ['data-radius', 'none, sm, md, lg, xl', 'The base radius every corner is derived from'],
  ['data-motion', 'reduced, full', 'Durations; defaults to the OS reduced-motion setting'],
  ['data-contrast', 'standard, more', 'Stronger borders and text; defaults to the OS contrast setting'],
];

const SCOPES = [
  { label: 'Default', attrs: {} },
  { label: 'Violet, compact, XL radius', attrs: { 'data-accent': 'violet', 'data-density': 'compact', 'data-radius': 'xl' } },
  { label: 'Dark, amber, no radius', attrs: { 'data-theme': 'dark', 'data-accent': 'amber', 'data-radius': 'none' } },
];

export function Theming() {
  return (
    <DocsLayout
      toc={[
        { id: 'attributes', label: 'Theme attributes' },
        { id: 'scoped', label: 'Scoped themes' },
        { id: 'react', label: 'ThemeProvider' },
        { id: 'brand', label: 'Your brand colour' },
        { id: 'components', label: 'Restyle a component' },
        { id: 'type', label: 'Type scale' },
      ]}
    >
      <article className="doc">
        <DocHeader
          eyebrow="Guides"
          title="Theming"
          lede="Seven attributes and a few custom properties re-theme every component. They work on <html> or on any element, and combine freely."
        />

        <DocSection id="attributes" title="Theme attributes">
          <div className="table-wrap">
            <table className="doc-table">
              <thead>
                <tr><th scope="col">Attribute</th><th scope="col">Values</th><th scope="col">What it changes</th></tr>
              </thead>
              <tbody>
                {AXES.map(([attr, values, what]) => (
                  <tr key={attr}>
                    <th scope="row"><code>{attr}</code></th>
                    <td>{values}</td>
                    <td>{what}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            Try them together in the <RouterLink to="/#customise">theming playground</RouterLink> on the home page; it writes out the
            attributes for you.
          </p>
        </DocSection>

        <DocSection id="scoped" title="Scoped themes">
          <p>Attributes apply to the element and everything inside it, so one page can mix themes: a dark sidebar, a compact table, a promotional card in another accent.</p>
          <div className="scope-grid">
            {SCOPES.map((scope) => (
              <div key={scope.label} className="scope-card" {...scope.attrs}>
                <span className="scope-label">{scope.label}</span>
                <div className="scope-row">
                  <Button size="sm">Save</Button>
                  <Button size="sm" variant="secondary">Cancel</Button>
                </div>
                <Switch label="Notifications" defaultChecked />
                <Badge tone="accent">Pro plan</Badge>
              </div>
            ))}
          </div>
          <CodeSnippet code={'<aside data-theme="dark" data-accent="rose" data-radius="none">\n  …\n</aside>'} language="html" type="multi-line" label="Scoped theme" />
        </DocSection>

        <DocSection id="react" title="ThemeProvider (React)">
          <p><code>ThemeProvider</code> sets the attributes from props or state, shares them through <code>useTheme()</code> and can remember the theme in local storage. <code>ThemeToggle</code> switches light and dark.</p>
          <CodeSnippet
            code={`import { ThemeProvider, ThemeToggle } from 'pada-ds';\n\n<ThemeProvider target="root" defaultTheme="system" accent="emerald" density="compact" storageKey="theme">\n  <App />\n  <ThemeToggle />\n</ThemeProvider>`}
            language="tsx"
            type="multi-line"
            label="React"
          />
          <p>In Angular, <code>ds-theme-provider</code> does the same, and <code>button[dsThemeToggle]</code> switches the theme.</p>
        </DocSection>

        <DocSection id="brand" title="Your brand colour">
          <p>Pick one of the 22 accent palettes, or use <code>custom</code> with a hue (0–360). Pada builds a full OKLCH ramp from the hue, so hover, pressed, subtle and focus colours all follow.</p>
          <CodeSnippet code={':root {\n  --pada-accent-hue: 262;\n  --pada-accent-chroma: 1; /* lower is greyer; 1 is the default */\n}'} language="css" type="multi-line" label="global.css" />
          <CodeSnippet code={'<html data-accent="custom">'} language="html" type="single-line" label="index.html" />
        </DocSection>

        <DocSection id="components" title="Restyle a component">
          <p>Each component declares its own tokens (<code>--pada-button-*</code>, <code>--pada-dialog-*</code> …) at the top of its CSS. Reassign them on the component or any ancestor; never override internal selectors.</p>
          <CodeSnippet code={'.checkout {\n  --pada-button-radius: var(--pada-radius-full);\n  --pada-button-height: var(--pada-control-height-lg);\n}'} language="css" type="multi-line" label="checkout.css" />
          <p>Every component's docs page in Storybook lists the tokens it declares.</p>
        </DocSection>

        <DocSection id="type" title="Type scale">
          <p>Font sizes are derived from two knobs: the base size and the ratio between steps.</p>
          <CodeSnippet code={':root {\n  --pada-type-base: 14px; /* default 13px */\n  --pada-type-ratio: 1.25; /* default 1.2 */\n}'} language="css" type="multi-line" label="global.css" />
        </DocSection>
      </article>
    </DocsLayout>
  );
}

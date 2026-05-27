import DemoPage from '../DemoPage';
import { CodeSnippet } from '../../../components/CodeSnippet/CodeSnippet';

const SHADOWS = [
  { token: '--shadow-sm', label: 'sm', use: 'Subtle separation under inline elements (chips, tags).' },
  { token: '--shadow', label: 'base', use: 'Default lift for resting cards and toolbar surfaces.' },
  { token: '--shadow-md', label: 'md', use: 'Hover-elevated cards, dropdown panels.' },
  { token: '--shadow-lg', label: 'lg', use: 'Floating menus, popovers.' },
  { token: '--shadow-xl', label: 'xl', use: 'Modals, side drawers.' },
  { token: '--shadow-2xl', label: '2xl', use: 'Top-level overlays, marketing cards on light backgrounds.' },
  { token: '--shadow-inner', label: 'inner', use: 'Pressed states, recessed groups (e.g. inset inputs).' },
];

const USAGE_CODE = `import 'pada-ds/tokens.css';

.card {
  box-shadow: var(--shadow);
}

.card:hover {
  box-shadow: var(--shadow-md);
}

.modal {
  box-shadow: var(--shadow-2xl);
}`;

export default function ShadowsDemo() {
  return (
    <DemoPage
      title="Shadows"
      kind="Foundation"
      purpose={
        <p>
          Shadows are the design system's elevation language. They communicate hierarchy
          between surfaces (resting → hovered → floating → overlaid) without leaning on color
          or border weight. Use them sparingly and consistently; mixing two non-adjacent
          shadow levels on one screen breaks the visual order.
        </p>
      }
      design={
        <>
          <p>
            Seven elevation tokens cover the full range from a hairline tint up to a deep
            modal lift, plus an inset shadow for pressed states. Each token resolves to a
            CSS <code>box-shadow</code> value tuned for white surfaces.
          </p>
          <div
            className="demo-page__showcase"
            style={{ alignItems: 'flex-start', flexWrap: 'wrap', gap: 24 }}
          >
            {SHADOWS.map(({ token, label, use }) => (
              <div
                key={token}
                style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 200 }}
              >
                <div
                  style={{
                    backgroundColor: 'var(--color-end-white)',
                    borderRadius: 12,
                    boxShadow: `var(${token})`,
                    height: 96,
                    width: '100%',
                  }}
                />
                <code style={{ color: 'var(--color-stone-500)', fontSize: 11 }}>{token}</code>
                <span style={{ fontSize: 12 }}>{use}</span>
                <span
                  style={{
                    color: 'var(--color-stone-500)',
                    fontSize: 11,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </>
      }
      developer={
        <>
          <p>
            Shadows are exposed as CSS custom properties. Use them to define elevation states
            on your own components rather than authoring new shadow values inline.
          </p>
          <CodeSnippet code={USAGE_CODE} language="css" label="Using shadow tokens" />
        </>
      }
      accessibility={
        <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <li>Shadows are decorative — never use them as the only signifier of hierarchy or interactivity. Pair with borders, labels, or color when meaning is conveyed.</li>
          <li>Forced-colors mode (Windows High Contrast) drops shadows entirely; ensure your component remains usable when elevation is invisible.</li>
          <li>Shadow alpha is conservative (rgb 0/0/0 between 0.05 and 0.25) so contrast against the surface is preserved.</li>
        </ul>
      }
    />
  );
}

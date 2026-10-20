import DemoPage from '../DemoPage';
import { CodeSnippet } from '@pada/components/CodeSnippet/CodeSnippet';

const GRADIENTS = [
  { token: '--gradient-xs', label: 'xs', note: 'Faint surface wash for hero panels and empty states.' },
  { token: '--gradient-sm', label: 'sm', note: 'Subtle backdrops for cards and section dividers.' },
  { token: '--gradient-md', label: 'md', note: 'Default decorative band; pairs well with white text on the right end.' },
  { token: '--gradient-lg', label: 'lg', note: 'Brand surface — use for marketing or onboarding canvases.' },
  { token: '--gradient-xl', label: 'xl', note: 'High-saturation accent; reserve for hero / cover surfaces.' },
  { token: '--gradient-2xl', label: '2xl', note: 'Top brand intensity; sparingly on splashes and logos.' },
];

const USAGE_CODE = `import 'pada-ds/tokens.css';

.hero {
  background-image: var(--gradient-lg);
  color: var(--color-end-white);
}

.empty-state {
  background-image: var(--gradient-xs);
  border-radius: 16px;
}`;

export default function GradientsDemo() {
  return (
    <DemoPage
      title="Gradients"
      kind="Foundation"
      purpose={
        <p>
          Gradients add brand warmth to neutral surfaces without overwhelming the content.
          Pada ships a six-step purple-to-fuchsia gradient scale, all anchored at a 45° angle
          for visual consistency. Use them for hero panels, empty states, and brand surfaces —
          not for primary UI chrome.
        </p>
      }
      design={
        <>
          <p>
            Each gradient token resolves to a <code>linear-gradient(45deg, ...)</code>{' '}
            interpolating between the matching purple and fuchsia shades. Lower steps (xs–sm)
            are surface-friendly tints; higher steps (xl–2xl) are saturated brand surfaces.
          </p>
          <div
            className="demo-page__showcase"
            style={{ flexWrap: 'wrap', gap: 16 }}
          >
            {GRADIENTS.map(({ token, label, note }) => (
              <div
                key={token}
                style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 220 }}
              >
                <div
                  style={{
                    backgroundImage: `var(${token})`,
                    borderRadius: 12,
                    height: 120,
                  }}
                />
                <code style={{ color: 'var(--color-stone-500)', fontSize: 11 }}>{token}</code>
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
                <span style={{ fontSize: 12 }}>{note}</span>
              </div>
            ))}
          </div>
        </>
      }
      developer={
        <>
          <p>
            Reference gradients via the <code>background-image</code> property; they're not
            valid <code>background-color</code> values. Combine with a fallback solid color
            for better print and forced-colors fidelity.
          </p>
          <CodeSnippet code={USAGE_CODE} language="css" label="Using gradient tokens" />
        </>
      }
      accessibility={
        <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <li>Body text on saturated gradients (xl, 2xl) must use white or near-white to clear the AA 4.5:1 contrast minimum.</li>
          <li>On softer gradients (xs–md), pair with <code>--color-slate-900</code> text — never with mid-shade neutrals.</li>
          <li>Always provide a solid <code>background-color</code> fallback so the surface remains accessible if gradients are disabled (forced-colors mode, print).</li>
        </ul>
      }
    />
  );
}

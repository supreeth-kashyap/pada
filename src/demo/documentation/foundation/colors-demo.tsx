import DemoPage from '../DemoPage';
import { CodeSnippet } from '../../../components/CodeSnippet/CodeSnippet';

const FAMILIES = [
  'slate', 'gray', 'zinc', 'neutral', 'stone',
  'red', 'orange', 'amber', 'yellow', 'lime',
  'green', 'emerald', 'teal', 'cyan', 'sky',
  'blue', 'indigo', 'violet', 'purple', 'fuchsia',
  'pink', 'rose',
];

const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

const USAGE_CODE = `import 'pada-ds/tokens.css';

.button {
  background: var(--color-indigo-600);
  color: var(--color-end-white);
  border: 1px solid var(--color-indigo-700);
}

.alert {
  background: var(--color-red-50);
  color: var(--color-red-900);
  border-left: 3px solid var(--color-red-600);
}`;

export default function ColorsDemo() {
  return (
    <DemoPage
      title="Colors"
      kind="Foundation"
      purpose={
        <p>
          The Pada palette is a Tailwind-aligned scale of 22 hues, each available in 10 shades
          (50 → 900). It gives every component a consistent, accessible vocabulary for surfaces,
          text, borders, focus rings, and status colors. Reach for neutrals (slate, stone, gray)
          for chrome, indigo as the primary brand accent, and the semantic families (red, amber,
          green, sky) for status communication.
        </p>
      }
      design={
        <>
          <p>
            Each row below is a hue family. Lower shades (50–200) are surface tints; mid
            shades (300–500) are non-text accents and borders; high shades (600–900) carry the
            most contrast and are typical foreground colors. Pure white and black are also
            exposed via <code>--color-end-white</code> and <code>--color-end-black</code>.
          </p>
          <div className="demo-page__showcase" style={{ flexDirection: 'column', gap: 8 }}>
            {FAMILIES.map((family) => (
              <div key={family} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <code
                  style={{
                    color: 'var(--color-stone-500)',
                    fontSize: 11,
                    minWidth: 80,
                    textTransform: 'capitalize',
                  }}
                >
                  {family}
                </code>
                {SHADES.map((shade) => (
                  <div
                    key={shade}
                    title={`--color-${family}-${shade}`}
                    style={{
                      backgroundColor: `var(--color-${family}-${shade})`,
                      borderRadius: 4,
                      height: 32,
                      width: 32,
                      border: shade <= 100 ? '1px solid var(--color-stone-200)' : undefined,
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </>
      }
      developer={
        <>
          <p>
            All colors are exported as CSS custom properties. Reference them via{' '}
            <code>var(--color-{`{family}`}-{`{shade}`})</code> — never hard-code hex values.
          </p>
          <CodeSnippet code={USAGE_CODE} language="css" label="Using color tokens" />
        </>
      }
      accessibility={
        <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <li>Pair shades 600–900 with white surfaces (or the inverse) to clear the WCAG AA 4.5:1 text contrast threshold.</li>
          <li>For non-text UI (icons, borders, focus rings), shades 500+ on white reach the 3:1 minimum.</li>
          <li>Never communicate state with color alone — pair every status color with an icon, label, or text cue.</li>
          <li>The 50–200 tints are background-only; do not place body text directly on them.</li>
        </ul>
      }
    />
  );
}

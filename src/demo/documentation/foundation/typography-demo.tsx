import DemoPage from '../DemoPage';
import { CodeSnippet } from '../../../components/CodeSnippet/CodeSnippet';

// Type scale sourced from `src/styles/primitives.css` — keep in sync with the token file.
const TYPE_SCALE: Array<{ token: string; size: string; sample: string }> = [
  { token: '--font-size-9xl', size: '128px', sample: 'Aa' },
  { token: '--font-size-8xl', size: '96px', sample: 'Aa' },
  { token: '--font-size-7xl', size: '72px', sample: 'Aa' },
  { token: '--font-size-6xl', size: '60px', sample: 'Display' },
  { token: '--font-size-5xl', size: '48px', sample: 'Display' },
  { token: '--font-size-4xl', size: '36px', sample: 'Heading' },
  { token: '--font-size-3xl', size: '30px', sample: 'Heading' },
  { token: '--font-size-2xl', size: '24px', sample: 'Heading' },
  { token: '--font-size-xl', size: '19px', sample: 'Heading' },
  { token: '--font-size-lg', size: '15px', sample: 'Body large' },
  { token: '--font-size-base', size: '13px', sample: 'Body — the quick brown fox jumps over the lazy dog' },
  { token: '--font-size-sm', size: '11px', sample: 'Body small / caption' },
  { token: '--font-size-xs', size: '9px', sample: 'Micro / legal' },
];

const WEIGHTS = [
  { label: 'Regular', weight: 400 },
  { label: 'Medium', weight: 500 },
  { label: 'Semibold', weight: 600 },
  { label: 'Bold', weight: 700 },
];

const USAGE_CODE = `/* Pull the scale via the design tokens shipped in tokens.css */
import 'pada-ds/tokens.css';

.heading {
  font-family: var(--font-family-sans);
  font-size: var(--font-size-2xl); /* 24px */
  font-weight: 600;
  line-height: var(--line-height-sm);
  letter-spacing: var(--letter-spacing-sm);
}

.body {
  font-size: var(--font-size-base);  /* 13px */
  line-height: var(--line-height-base);
}`;

export default function TypographyDemo() {
  return (
    <DemoPage
      title="Typography"
      kind="Foundation"
      purpose={
        <p>
          Typography establishes the hierarchy, rhythm, and tone of every Pada interface.
          The scale is intentionally tight (13&nbsp;px base) and built around the SF&nbsp;Pro
          family so dense product UIs stay legible without feeling cluttered. Pair size,
          weight, and color to communicate importance; never use color alone.
        </p>
      }
      design={
        <>
          <p>
            The type scale spans 9&nbsp;px to 128&nbsp;px, exposed as CSS custom properties
            (<code>--font-size-xs</code> through <code>--font-size-9xl</code>). Use the
            display and heading sizes sparingly for marketing or page titles; <strong>base</strong>{' '}
            (13&nbsp;px) is the canonical body size for product surfaces. Pair these sizes
            with the four supported weights: Regular, Medium, Semibold, and Bold.
          </p>

          <div className="demo-page__showcase" style={{ flexDirection: 'column', gap: 12 }}>
            {TYPE_SCALE.map(({ token, size, sample }) => (
              <div
                key={token}
                style={{
                  alignItems: 'baseline',
                  display: 'grid',
                  gridTemplateColumns: '140px 60px 1fr',
                  gap: 16,
                  padding: '4px 0',
                }}
              >
                <code style={{ color: 'var(--pada-color-fg-muted)', fontSize: 11 }}>{token}</code>
                <span style={{ color: 'var(--pada-color-fg-muted)', fontSize: 11 }}>{size}</span>
                <span style={{ fontSize: size, lineHeight: 1.1, color: 'var(--pada-color-fg)' }}>
                  {sample}
                </span>
              </div>
            ))}
          </div>

          <p>
            <strong>Weights.</strong> The same body size rendered across the four supported
            weights:
          </p>
          <div className="demo-page__showcase" style={{ flexDirection: 'column', gap: 6 }}>
            {WEIGHTS.map(({ label, weight }) => (
              <div
                key={weight}
                style={{
                  alignItems: 'baseline',
                  display: 'grid',
                  gap: 16,
                  gridTemplateColumns: '140px 1fr',
                }}
              >
                <code style={{ color: 'var(--pada-color-fg-muted)', fontSize: 11 }}>
                  {label} / {weight}
                </code>
                <span style={{ fontSize: 15, fontWeight: weight, color: 'var(--pada-color-fg)' }}>
                  The quick brown fox jumps over the lazy dog.
                </span>
              </div>
            ))}
          </div>
        </>
      }
      developer={
        <>
          <p>
            Reference type sizes via the design tokens exported from <code>pada-ds/tokens.css</code>.
            Avoid hard-coding pixel sizes in your components — that's how the scale stays
            consistent across the design system and your app.
          </p>
          <CodeSnippet code={USAGE_CODE} language="css" label="Using typography tokens" />
        </>
      }
      accessibility={
        <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <li>Default body text sits at 13&nbsp;px with a 1.5 line height, comfortably exceeding the 1.5× minimum recommended for readability.</li>
          <li>The base color (<code>--color-slate-900</code> on a white surface) yields a contrast ratio above 16:1 — well above the WCAG&nbsp;AA threshold of 4.5:1.</li>
          <li>All sizes scale with the user's browser font-size preference because the scale is built on rem-equivalent values in the underlying token system.</li>
          <li>Avoid using font weight or color as the sole signifier of meaning — always pair with text, position, or an icon.</li>
        </ul>
      }
    />
  );
}

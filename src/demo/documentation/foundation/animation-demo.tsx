import DemoPage from '../DemoPage';
import { CodeSnippet } from '../../../components/CodeSnippet/CodeSnippet';

const DURATIONS = [
  { ms: 100, label: 'fast', use: 'Hover, tooltip reveal, pressable feedback.' },
  { ms: 200, label: 'standard', use: 'Default transition for color, border, opacity.' },
  { ms: 300, label: 'medium', use: 'Drawer slide-in, modal fade, accordion expand.' },
  { ms: 500, label: 'slow', use: 'Page transitions, large surface choreography.' },
];

const EASINGS = [
  { name: 'linear', value: 'linear', use: 'Loaders, indeterminate progress.' },
  { name: 'ease-out', value: 'cubic-bezier(0, 0, 0.2, 1)', use: 'Default for entering elements.' },
  { name: 'ease-in', value: 'cubic-bezier(0.4, 0, 1, 1)', use: 'Default for exiting elements.' },
  { name: 'ease-in-out', value: 'cubic-bezier(0.4, 0, 0.2, 1)', use: 'Two-way state changes (toggles, hovers).' },
];

const USAGE_CODE = `.button {
  transition:
    background-color 200ms cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

@media (prefers-reduced-motion: reduce) {
  .button {
    transition: none;
  }
}`;

export default function AnimationDemo() {
  return (
    <DemoPage
      title="Animation"
      kind="Foundation"
      purpose={
        <p>
          Motion conveys state change, reinforces hierarchy, and softens transitions between
          views. Pada uses short, ease-out durations for the vast majority of UI changes,
          reserving longer choreography for whole-surface transitions like drawers or modals.
          Animation is always purposeful — never decorative — and always respects the user's{' '}
          <code>prefers-reduced-motion</code> setting.
        </p>
      }
      design={
        <>
          <p>
            <strong>Durations.</strong> Four canonical durations cover the spectrum from
            micro-feedback to full-surface choreography:
          </p>
          <div className="demo-page__showcase" style={{ flexDirection: 'column', gap: 12 }}>
            {DURATIONS.map(({ ms, label, use }) => (
              <div
                key={ms}
                style={{
                  alignItems: 'center',
                  display: 'grid',
                  gap: 16,
                  gridTemplateColumns: '120px 80px 1fr',
                }}
              >
                <code style={{ color: 'var(--pada-color-fg-muted)', fontSize: 11 }}>{ms}ms</code>
                <span
                  style={{
                    color: 'var(--pada-color-fg-muted)',
                    fontSize: 11,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                  }}
                >
                  {label}
                </span>
                <span style={{ fontSize: 12 }}>{use}</span>
              </div>
            ))}
          </div>

          <p>
            <strong>Easings.</strong> Four easing curves keep motion legible. Use{' '}
            <code>ease-out</code> for entering elements (so they decelerate into rest),{' '}
            <code>ease-in</code> for elements leaving, and <code>ease-in-out</code> for
            symmetric changes.
          </p>
          <div className="demo-page__showcase" style={{ flexDirection: 'column', gap: 8 }}>
            {EASINGS.map(({ name, value, use }) => (
              <div
                key={name}
                style={{
                  alignItems: 'center',
                  display: 'grid',
                  gap: 16,
                  gridTemplateColumns: '120px 220px 1fr',
                }}
              >
                <code style={{ fontSize: 11 }}>{name}</code>
                <code style={{ color: 'var(--pada-color-fg-muted)', fontSize: 11 }}>{value}</code>
                <span style={{ fontSize: 12 }}>{use}</span>
              </div>
            ))}
          </div>
        </>
      }
      developer={
        <>
          <p>
            Compose <code>transition</code> with the canonical duration + easing pair. Always
            wrap motion-bearing styles in a <code>prefers-reduced-motion</code> guard so
            users who request reduced motion get an instant state change.
          </p>
          <CodeSnippet code={USAGE_CODE} language="css" label="Animation usage" />
        </>
      }
      accessibility={
        <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <li>Honor <code>prefers-reduced-motion: reduce</code> by removing or shortening every transition; never animate distance or rotation for users who opt out.</li>
          <li>Avoid animations longer than 500&nbsp;ms for routine UI; keep parallax and large-surface motion under 1&nbsp;s.</li>
          <li>Don't use motion as the only feedback mechanism; pair animations with state changes that screen readers can also detect (focus, ARIA announcements).</li>
          <li>Avoid flashing or strobing effects (more than 3 flashes per second) — they can trigger photosensitive seizures.</li>
        </ul>
      }
    />
  );
}

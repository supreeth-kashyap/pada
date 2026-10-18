import DemoPage from '../DemoPage';
import { CodeSnippet } from '../../../components/CodeSnippet/CodeSnippet';
import { Link } from '../../../components/Link';

const list = { margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 } as const;
const text = { margin: 0, color: 'var(--pada-color-fg)', maxWidth: 560, lineHeight: 1.6 } as const;

export default function LinkDemo() {
  return (
    <DemoPage
      title="Link"
      kind="Component"
      purpose={<p>Link navigates: to another page, a section, or another site. If it performs an action on the current page (save, open a dialog), use a Button even when it should look like text.</p>}
      design={
        <>
          <p>The accent tone stands out in running text; the neutral tone inherits the surrounding colour for dense lists and footers. External links get an icon.</p>
          <div className="demo-page__showcase" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 12 }}>
            <p style={text}>
              Read the <Link href="#">migration guide</Link> before upgrading, or browse the <Link href="https://github.com/supreeth-kashyap/pada" external>source on GitHub</Link>.
            </p>
            <p style={text}>
              <Link href="#" underline="always">
                Always underlined
              </Link>{' '}
              ·{' '}
              <Link href="#" tone="neutral">
                Neutral tone
              </Link>{' '}
              ·{' '}
              <Link href="#" tone="neutral" underline="always">
                Neutral, underlined
              </Link>
            </p>
          </div>
        </>
      }
      developer={
        <CodeSnippet
          code={`import { Link } from 'pada-ds';
import { Link as RouterLink } from 'react-router-dom';

<Link href="/docs/migration">migration guide</Link>
<Link href="https://github.com/…" external>source on GitHub</Link>

// Router links keep Pada's styling
<Link asChild>
  <RouterLink to="/settings">Settings</RouterLink>
</Link>`}
          language="tsx"
          label="Link usage"
        />
      }
      accessibility={
        <ul style={list}>
          <li>Renders a real <code>&lt;a href&gt;</code>, so it works with middle-click, “open in new tab” and screen reader link lists.</li>
          <li>Link text should make sense on its own: “migration guide”, not “click here”.</li>
          <li>External links add “(opens in a new tab)” for screen readers and <code>rel="noopener noreferrer"</code>.</li>
          <li>Inside body text, use <code>underline="always"</code> where colour is the only other cue.</li>
        </ul>
      }
    />
  );
}

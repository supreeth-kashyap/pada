import { useState } from 'react';
import DemoPage from '../DemoPage';
import { CodeSnippet } from '@pada/components/CodeSnippet/CodeSnippet';
import { Badge } from '@pada/components/Badge';
import { Button } from '@pada/components/Button';

const list = { margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 } as const;
const TONES = ['neutral', 'accent', 'info', 'success', 'warning', 'danger'] as const;
const row = { flexDirection: 'row', flexWrap: 'wrap', gap: 8, alignItems: 'center' } as const;

export default function BadgeDemo() {
  const [count, setCount] = useState(8);
  return (
    <DemoPage
      title="Badge"
      kind="Component"
      purpose={<p>Badge is a short, non-interactive label for a status or a count: “Beta”, “Overdue”, “12 unread”. For labels people can remove or click, use Tags.</p>}
      design={
        <>
          <p>Six tones in three variants: subtle (tinted, the default), solid and outline. A leading dot marks live status.</p>
          {(['subtle', 'solid', 'outline'] as const).map((variant) => (
            <div key={variant} className="demo-page__showcase" style={row}>
              {TONES.map((tone) => (
                <Badge key={tone} tone={tone} variant={variant}>
                  {tone[0].toUpperCase() + tone.slice(1)}
                </Badge>
              ))}
            </div>
          ))}
          <p>Counts cap at <code>max</code> (99 by default) and bump briefly when they change.</p>
          <div className="demo-page__showcase" style={row}>
            <Badge tone="success" dot>
              Live
            </Badge>
            <Badge tone="danger" variant="solid" count={count} />
            <Badge tone="accent" count={128} />
            <Badge size="sm" count={3} />
            <Button size="sm" variant="secondary" onClick={() => setCount((value) => value + 1)}>
              Add one
            </Button>
          </div>
        </>
      }
      developer={
        <CodeSnippet
          code={`import { Badge } from 'pada-ds';

<Badge tone="accent">Beta</Badge>
<Badge tone="success" dot>Live</Badge>
<Badge tone="danger" variant="solid" count={unread} aria-label={\`\${unread} unread\`} />`}
          language="tsx"
          label="Badge usage"
        />
      }
      accessibility={
        <ul style={list}>
          <li>A badge is plain text. A bare count (“12”) has no context, so give it an <code>aria-label</code> such as “12 unread”, or put the context in nearby text.</li>
          <li>Tones pass 4.5:1 text contrast in light and dark themes. Don’t rely on colour alone: the word carries the meaning.</li>
          <li>The count bump is skipped under reduced motion.</li>
        </ul>
      }
    />
  );
}

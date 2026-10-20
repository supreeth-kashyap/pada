import DemoPage from '../DemoPage';
import { CodeSnippet } from '@pada/components/CodeSnippet/CodeSnippet';
import { Separator } from '@pada/components/Separator';
import { Stack } from '@pada/components/Stack';
import { Link } from '@pada/components/Link';

const list = { margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 } as const;
const text = { margin: 0, color: 'var(--pada-color-fg)' } as const;

export default function SeparatorDemo() {
  return (
    <DemoPage
      title="Separator"
      kind="Component"
      purpose={<p>Separator draws a thin line between groups of content: sections of a card, items in a toolbar, links in a footer. Prefer spacing first; reach for a line when spacing alone doesn’t group things clearly.</p>}
      design={
        <>
          <p>Horizontal lines fill the width; vertical lines fill the height of a row. Both use the subtle border colour.</p>
          <div className="demo-page__showcase" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 16, maxWidth: 420 }}>
            <Stack gap={3}>
              <p style={text}>Account</p>
              <Separator />
              <p style={text}>Notifications</p>
              <Separator />
              <p style={text}>Billing</p>
            </Stack>
            <Stack direction="row" gap={3} align="center" style={{ height: 20 }}>
              <Link href="#" tone="neutral">
                Docs
              </Link>
              <Separator orientation="vertical" />
              <Link href="#" tone="neutral">
                Changelog
              </Link>
              <Separator orientation="vertical" />
              <Link href="#" tone="neutral">
                Status
              </Link>
            </Stack>
          </div>
        </>
      }
      developer={
        <CodeSnippet
          code={`import { Separator } from 'pada-ds';

<Separator />
<Separator orientation="vertical" />

// A meaningful boundary between sections
<Separator decorative={false} />`}
          language="tsx"
          label="Separator usage"
        />
      }
      accessibility={
        <ul style={list}>
          <li>Decorative by default and hidden from assistive technology.</li>
          <li>With <code>decorative={'{false}'}</code> it renders <code>role="separator"</code> with its orientation, so screen readers mark the boundary.</li>
        </ul>
      }
    />
  );
}

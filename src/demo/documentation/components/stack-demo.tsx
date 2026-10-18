import DemoPage from '../DemoPage';
import { CodeSnippet } from '../../../components/CodeSnippet/CodeSnippet';
import { Stack } from '../../../components/Stack';
import { Button } from '../../../components/Button';
import { Badge } from '../../../components/Badge';

const list = { margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 } as const;
const box = {
  padding: '8px 12px',
  borderRadius: 'var(--pada-radius-md)',
  background: 'var(--pada-color-accent-subtle)',
  color: 'var(--pada-color-accent-fg)',
  fontSize: 'var(--pada-font-size-sm)',
} as const;
const frame = { border: '1px dashed var(--pada-color-border)', borderRadius: 'var(--pada-radius-md)', padding: 12 } as const;

export default function StackDemo() {
  return (
    <DemoPage
      title="Stack"
      kind="Component"
      purpose={<p>Stack lays out children in a row or column with a consistent gap. Gaps are spacing steps, so they follow the density setting. Use it for the small arrangements every screen needs: a button row, a form, a title with a badge. For two-dimensional layouts, use Grid.</p>}
      design={
        <>
          <p>
            <code>gap</code> counts 4 px steps at default density. <code>align</code> and <code>justify</code> map to the flex properties; <code>wrap</code> lets rows flow onto new lines.
          </p>
          <div className="demo-page__showcase" style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 24, alignItems: 'flex-start' }}>
            {[1, 2, 4].map((gap) => (
              <div key={gap} style={frame}>
                <Stack gap={gap as 1 | 2 | 4}>
                  <span style={box}>gap={gap}</span>
                  <span style={box}>Item</span>
                  <span style={box}>Item</span>
                </Stack>
              </div>
            ))}
            <div style={{ ...frame, width: 360 }}>
              <Stack direction="row" justify="between" align="center">
                <Stack direction="row" gap={2} align="center">
                  <strong style={{ color: 'var(--pada-color-fg)' }}>Website redesign</strong>
                  <Badge tone="success" dot>
                    Active
                  </Badge>
                </Stack>
                <Stack direction="row" gap={2}>
                  <Button size="sm" variant="secondary">
                    Share
                  </Button>
                  <Button size="sm">Open</Button>
                </Stack>
              </Stack>
            </div>
            <div style={{ ...frame, width: 260 }}>
              <Stack direction="row" gap={2} wrap as="ul" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {['design', 'tokens', 'react', 'angular', 'a11y', 'motion', 'headless'].map((tag) => (
                  <li key={tag}>
                    <Badge variant="outline">{tag}</Badge>
                  </li>
                ))}
              </Stack>
            </div>
          </div>
        </>
      }
      developer={
        <CodeSnippet
          code={`import { Stack } from 'pada-ds';

<Stack gap={3}>…</Stack>

<Stack direction="row" justify="between" align="center">
  <h2>Website redesign</h2>
  <Stack direction="row" gap={2}>
    <Button variant="secondary">Share</Button>
    <Button>Open</Button>
  </Stack>
</Stack>

<Stack as="ul" direction="row" gap={2} wrap>…</Stack>`}
          language="tsx"
          label="Stack usage"
        />
      }
      accessibility={
        <ul style={list}>
          <li>Stack only adds layout. Use <code>as</code> to keep the right semantics, such as a list of items or a <code>nav</code>.</li>
          <li>Visual order follows DOM order, so focus and reading order stay in step with what people see.</li>
        </ul>
      }
    />
  );
}

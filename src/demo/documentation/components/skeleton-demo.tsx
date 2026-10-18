import { useState } from 'react';
import DemoPage from '../DemoPage';
import { CodeSnippet } from '../../../components/CodeSnippet/CodeSnippet';
import { Skeleton } from '../../../components/Skeleton';
import { Avatar } from '../../../components/Avatar';
import { Stack } from '../../../components/Stack';
import { Switch } from '../../../components/Switch';

const list = { margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 } as const;
const card = {
  width: 320,
  padding: 16,
  border: '1px solid var(--pada-color-border)',
  borderRadius: 'var(--pada-radius-lg)',
  background: 'var(--pada-color-surface)',
} as const;

export default function SkeletonDemo() {
  const [loading, setLoading] = useState(true);
  return (
    <DemoPage
      title="Skeleton"
      kind="Component"
      purpose={<p>Skeleton holds the shape of content while it loads, so the page doesn’t jump when the data arrives. Use it when you know the layout of the result; otherwise use a Spinner.</p>}
      design={
        <>
          <p>Three shapes (text, rect and circle) that shimmer gently. Text lines fill their container and the last of several lines is shorter.</p>
          <div className="demo-page__showcase" style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 32, alignItems: 'flex-start' }}>
            <Switch label="Loading" checked={loading} onChange={(event) => setLoading(event.target.checked)} />
            <div style={card} aria-busy={loading}>
              <Stack gap={3}>
                <Stack direction="row" gap={3} align="center">
                  {loading ? <Skeleton shape="circle" height={40} /> : <Avatar name="Ada Lovelace" size="lg" />}
                  <div style={{ flex: 1 }}>
                    {loading ? (
                      <Skeleton width="60%" />
                    ) : (
                      <strong style={{ color: 'var(--pada-color-fg)' }}>Ada Lovelace</strong>
                    )}
                  </div>
                </Stack>
                {loading ? (
                  <Skeleton lines={3} />
                ) : (
                  <p style={{ margin: 0, color: 'var(--pada-color-fg-muted)' }}>
                    Wrote the first published algorithm for Babbage’s Analytical Engine and saw that it could do more than arithmetic.
                  </p>
                )}
                {loading ? <Skeleton shape="rect" height={120} /> : <div style={{ height: 120, borderRadius: 'var(--pada-radius-md)', background: 'var(--pada-color-accent-subtle)' }} />}
              </Stack>
            </div>
          </div>
        </>
      }
      developer={
        <CodeSnippet
          code={`import { Skeleton } from 'pada-ds';

<section aria-busy={loading}>
  {loading ? <Skeleton shape="circle" height={40} /> : <Avatar name={user.name} />}
  {loading ? <Skeleton lines={3} /> : <p>{user.bio}</p>}
</section>`}
          language="tsx"
          label="Skeleton usage"
        />
      }
      accessibility={
        <ul style={list}>
          <li>Skeletons are hidden from assistive technology. Mark the loading region with <code>aria-busy</code> so screen readers wait for the real content.</li>
          <li>The shimmer stops under reduced motion; the shapes stay.</li>
        </ul>
      }
    />
  );
}

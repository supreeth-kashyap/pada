import { useState } from 'react';
import DemoPage from '../DemoPage';
import { CodeSnippet } from '../../../components/CodeSnippet/CodeSnippet';
import { Button } from '../../../components/Button';
import { Stat } from '../../../components/Stat';

const list = { margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 } as const;
const card = { padding: 20, border: '1px solid var(--pada-color-border)', borderRadius: 'var(--pada-radius-xl)', background: 'var(--pada-color-surface)', minWidth: 200 } as const;

function Sparkline({ points }: { points: number[] }) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const d = points.map((point, index) => `${index === 0 ? 'M' : 'L'}${(index / (points.length - 1)) * 100},${28 - ((point - min) / (max - min || 1)) * 24}`).join(' ');
  return (
    <svg viewBox="0 0 100 30" width="100%" height="30" preserveAspectRatio="none" aria-hidden="true">
      <path d={d} fill="none" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export default function StatDemo() {
  const [revenue, setRevenue] = useState(128400);
  const [users, setUsers] = useState(3842);
  const refresh = () => {
    setRevenue((value) => Math.round(value * (0.9 + Math.random() * 0.25)));
    setUsers((value) => Math.round(value * (0.95 + Math.random() * 0.12)));
  };
  return (
    <DemoPage
      title="Stat"
      kind="Component"
      purpose={<p>Stat presents a key figure (revenue, active users, error rate) with its change over a period, so people can read the state of something at a glance. Group several in a row for a dashboard header.</p>}
      design={
        <>
          <p>The value counts to its new number when it changes. The delta is green or red by whether the change is good: with <code>invertTrend</code>, a fall in errors or costs reads as good. A chart slot takes a sparkline.</p>
          <div className="demo-page__showcase" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
              <div style={card}>
                <Stat label="Revenue" value={revenue} formatOptions={{ style: 'currency', currency: 'USD', maximumFractionDigits: 0 }} delta={0.124} deltaFormatOptions={{ style: 'percent', maximumFractionDigits: 1 }} deltaLabel="vs last month" chart={<Sparkline points={[4, 6, 5, 8, 7, 10, 12]} />} />
              </div>
              <div style={card}>
                <Stat label="Active users" value={users} delta={-86} deltaLabel="vs last week" description="Signed in within 7 days" />
              </div>
              <div style={card}>
                <Stat label="Error rate" value={0.0042} formatOptions={{ style: 'percent', maximumFractionDigits: 2 }} delta={-0.0011} invertTrend deltaLabel="since deploy" size="sm" />
              </div>
            </div>
            <Button variant="secondary" size="sm" onClick={refresh}>Refresh numbers</Button>
          </div>
        </>
      }
      developer={
        <CodeSnippet
          code={`import { Stat } from 'pada-ds';

<Stat
  label="Revenue"
  value={revenue}
  formatOptions={{ style: 'currency', currency: 'USD', notation: 'compact' }}
  delta={0.124}
  deltaFormatOptions={{ style: 'percent' }}
  deltaLabel="vs last month"
  chart={<Sparkline data={series} />}
/>

// Lower is better
<Stat label="p95 latency" value={182} formatOptions={{ style: 'unit', unit: 'millisecond' }} delta={-24} invertTrend />`}
          language="tsx"
          label="Stat usage"
        />
      }
      accessibility={
        <ul style={list}>
          <li>Each stat is a group named by its label. Screen readers hear the final value, not the counting animation.</li>
          <li>The delta's direction is spoken ("up +12.4%"), not conveyed by colour or the arrow alone.</li>
          <li>The count-up is skipped under reduced motion.</li>
        </ul>
      }
    />
  );
}

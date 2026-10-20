import DemoPage from '../DemoPage';
import { CodeSnippet } from '@pada/components/CodeSnippet/CodeSnippet';
import { SegmentControl } from '@pada/components/SegmentControl';

export default function SegmentControlDemo() {
  return (
    <DemoPage
      title="Segment Control"
      kind="Component"
      purpose={<p>SegmentControl provides a pill-style switcher among 2–5 mutually exclusive view modes. Use it to toggle visualizations (list/grid), date ranges (day/week/month), or content scopes. For more options, switch to Tabs; for forms, use RadioGroup.</p>}
      design={<><p>SegmentControl renders a horizontal capsule with each segment as an equal-width option. The selected segment shows a contrasting surface.</p><div className="demo-page__showcase" style={{ flexDirection: 'row', gap: 16 }}><SegmentControl defaultValue="month" onChange={(value, option) => console.log('SegmentControl ->', value, option)} options={[{ value: 'day', label: 'Day' }, { value: 'week', label: 'Week' }, { value: 'month', label: 'Month' }]} /></div></>}
      developer={<><p>Import the <code>SegmentControl</code> from <code>pada-ds</code> and configure with the props shown below.</p><CodeSnippet code={`import { useState } from 'react';
import { SegmentControl } from 'pada-ds';

export function RangePicker() {
  // Controlled: keep the active value in state and update it from onChange.
  const [range, setRange] = useState('week');
  return (
    <SegmentControl
      value={range}
      onChange={(value, option) => {
        // \`value\` is the newly active value; \`option\` is the full
        // SegmentOption (label / icon / disabled / etc.) for convenience.
        console.log('clicked', option.label);
        setRange(value);
      }}
      options={[
        { value: 'day', label: 'Day' },
        { value: 'week', label: 'Week' },
        { value: 'month', label: 'Month' },
      ]}
    />
  );
}

// Or uncontrolled — the component tracks its own active segment:
// <SegmentControl defaultValue="week" onChange={(value) => save(value)} options={...} />`} language="tsx" label="SegmentControl usage" /></>}
      accessibility={<ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}><li>Implements the radio pattern with <code>role="radiogroup"</code> and <code>role="radio"</code> children.</li><li>Keyboard support: <kbd>←/→</kbd> moves selection; <kbd>Tab</kbd> moves into and out of the group.</li><li>Selected segment carries <code>aria-checked="true"</code> and ≥AA contrast against the unselected surface.</li></ul>}
    />
  );
}

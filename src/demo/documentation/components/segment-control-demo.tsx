import DemoPage from '../DemoPage';
import { CodeSnippet } from '../../../components/CodeSnippet/CodeSnippet';
import { SegmentControl } from '../../../components/SegmentControl';

export default function SegmentControlDemo() {
  return (
    <DemoPage
      title="Segment Control"
      kind="Component"
      purpose={<p>SegmentControl provides a pill-style switcher among 2–5 mutually exclusive view modes. Use it to toggle visualizations (list/grid), date ranges (day/week/month), or content scopes. For more options, switch to Tabs; for forms, use RadioGroup.</p>}
      design={<><p>SegmentControl renders a horizontal capsule with each segment as an equal-width option. The selected segment shows a contrasting surface.</p><div className="demo-page__showcase" style={{ flexDirection: 'row', gap: 16 }}><SegmentControl value="month" onChange={() => {}} options={[{ value: 'day', label: 'Day' }, { value: 'week', label: 'Week' }, { value: 'month', label: 'Month' }]} /></div></>}
      developer={<><p>Import the <code>SegmentControl</code> from <code>pada-ds</code> and configure with the props shown below.</p><CodeSnippet code={`import { SegmentControl } from 'pada-ds';

export function RangePicker() {
  return (
    <SegmentControl
      value="week"
      onChange={() => {}}
      options={[{ value: 'day', label: 'Day' }, { value: 'week', label: 'Week' }]}
    />
  );
}`} language="tsx" label="SegmentControl usage" /></>}
      accessibility={<ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}><li>Implements the radio pattern with <code>role="radiogroup"</code> and <code>role="radio"</code> children.</li><li>Keyboard support: <kbd>←/→</kbd> moves selection; <kbd>Tab</kbd> moves into and out of the group.</li><li>Selected segment carries <code>aria-checked="true"</code> and ≥AA contrast against the unselected surface.</li></ul>}
    />
  );
}

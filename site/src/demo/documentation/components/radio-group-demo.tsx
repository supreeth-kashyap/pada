import DemoPage from '../DemoPage';
import { CodeSnippet } from '@pada/components/CodeSnippet/CodeSnippet';
import { RadioGroup } from '@pada/components/RadioGroup';

export default function RadioGroupDemo() {
  return (
    <DemoPage
      title="Radio Group"
      kind="Component"
      purpose={<p>RadioGroup lets users pick one option from a small, mutually exclusive set. Use it in forms when all options should be visible at a glance (typically 2–5). For more options, prefer Select; for instant-effect toggles, use SegmentControl or Switch.</p>}
      design={<><p>RadioGroup renders each option as a labeled radio button stacked vertically. Helper text and error states are supported.</p><div className="demo-page__showcase" style={{ flexDirection: 'row', gap: 16 }}><RadioGroup name="plan" value="pro" onChange={() => {}} options={[{ value: 'free', label: 'Free' }, { value: 'pro', label: 'Pro' }, { value: 'team', label: 'Team' }]} /></div></>}
      developer={<><p>Import the <code>RadioGroup</code> from <code>pada-ds</code> and configure with the props shown below.</p><CodeSnippet code={`import { RadioGroup } from 'pada-ds';

export function PlanPicker() {
  return (
    <RadioGroup
      name="plan"
      value="pro"
      onChange={() => {}}
      options={[{ value: 'free', label: 'Free' }, { value: 'pro', label: 'Pro' }]}
    />
  );
}`} language="tsx" label="RadioGroup usage" /></>}
      accessibility={<ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}><li>Group is wrapped in a <code>role="radiogroup"</code> with an accessible label.</li><li>Each option is a native <code>&lt;input type="radio"&gt;</code> so keyboard navigation (arrow keys) works out of the box.</li><li>Errors are announced via <code>aria-invalid</code> on the group and a linked message via <code>aria-describedby</code>.</li></ul>}
    />
  );
}

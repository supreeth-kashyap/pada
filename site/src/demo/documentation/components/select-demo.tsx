import DemoPage from '../DemoPage';
import { CodeSnippet } from '@pada/components/CodeSnippet/CodeSnippet';
import { Select } from '@pada/components/Select/Select';

export default function SelectDemo() {
  return (
    <DemoPage
      title="Select"
      kind="Component"
      purpose={<p>Select is a closed dropdown for picking one option from a known list. Use it when 5–20 options exist and the user needs to scan, not type. For longer lists with typeahead, prefer ComboBox; for very few options, prefer SegmentControl or RadioGroup.</p>}
      design={<><p>Select renders a button-styled trigger that opens a menu of options on click. It supports labels, descriptions, errors, and disabled options.</p><div className="demo-page__showcase" style={{ flexDirection: 'row', gap: 16 }}><div style={{ width: 280 }}><Select label="Choose a plan" defaultValue="pro" onChange={(value, option) => console.log('Select ->', value, option)} options={[{ value: 'free', label: 'Free' }, { value: 'pro', label: 'Pro' }, { value: 'team', label: 'Team' }]} /></div></div></>}
      developer={<><p>Import the <code>Select</code> from <code>pada-ds</code> and configure with the props shown below.</p><CodeSnippet code={`import { useState } from 'react';
import { Select } from 'pada-ds';

export function PlanSelect() {
  // Controlled: keep the value in state and update it from onChange.
  const [plan, setPlan] = useState('pro');
  return (
    <Select
      label="Plan"
      value={plan}
      onChange={(value, option) => {
        // \`value\` is the picked value; \`option\` is the full SelectOption.
        console.log('picked', option.label);
        setPlan(value);
      }}
      options={[
        { value: 'free', label: 'Free' },
        { value: 'pro', label: 'Pro' },
        { value: 'team', label: 'Team' },
      ]}
    />
  );
}

// Or uncontrolled — the trigger updates itself from the click:
// <Select label="Plan" defaultValue="pro" onChange={(v) => save(v)} options={...} />`} language="tsx" label="Select usage" /></>}
      accessibility={<ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}><li>Implements the WAI-ARIA listbox pattern with <code>role="listbox"</code> and <code>role="option"</code> items.</li><li>Keyboard support: <kbd>↓</kbd>/<kbd>↑</kbd> to move, <kbd>Enter</kbd> to select, <kbd>Esc</kbd> to dismiss, type-ahead to jump.</li><li>Disabled options are skipped from arrow-key navigation.</li></ul>}
    />
  );
}

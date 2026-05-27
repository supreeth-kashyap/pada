import DemoPage from '../DemoPage';
import { CodeSnippet } from '../../../components/CodeSnippet/CodeSnippet';
import { Select } from '../../../components/Select/Select';

export default function SelectDemo() {
  return (
    <DemoPage
      title="Select"
      kind="Component"
      purpose={<p>Select is a closed dropdown for picking one option from a known list. Use it when 5–20 options exist and the user needs to scan, not type. For longer lists with typeahead, prefer ComboBox; for very few options, prefer SegmentControl or RadioGroup.</p>}
      design={<><p>Select renders a button-styled trigger that opens a menu of options on click. It supports labels, descriptions, errors, and disabled options.</p><div className="demo-page__showcase" style={{ flexDirection: 'row', gap: 16 }}><div style={{ width: 280 }}><Select label="Choose a plan" options={[{ value: 'free', label: 'Free' }, { value: 'pro', label: 'Pro' }, { value: 'team', label: 'Team' }]} value="pro" onChange={() => {}} /></div></div></>}
      developer={<><p>Import the <code>Select</code> from <code>pada-ds</code> and configure with the props shown below.</p><CodeSnippet code={`import { Select } from 'pada-ds';

export function PlanSelect() {
  return (
    <Select
      label="Plan"
      options={[{ value: 'free', label: 'Free' }, { value: 'pro', label: 'Pro' }]}
      value="pro"
      onChange={() => {}}
    />
  );
}`} language="tsx" label="Select usage" /></>}
      accessibility={<ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}><li>Implements the WAI-ARIA listbox pattern with <code>role="listbox"</code> and <code>role="option"</code> items.</li><li>Keyboard support: <kbd>↓</kbd>/<kbd>↑</kbd> to move, <kbd>Enter</kbd> to select, <kbd>Esc</kbd> to dismiss, type-ahead to jump.</li><li>Disabled options are skipped from arrow-key navigation.</li></ul>}
    />
  );
}

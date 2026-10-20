import DemoPage from '../DemoPage';
import { CodeSnippet } from '@pada/components/CodeSnippet/CodeSnippet';
import { ComboBox } from '@pada/components/ComboBox';

export default function ComboBoxDemo() {
  return (
    <DemoPage
      title="Combo Box"
      kind="Component"
      purpose={<p>ComboBox combines a text input with a filterable dropdown. Use it when the user needs to pick from a long list — picking a customer, project, or label — and benefits from typeahead. Avoid it for short option sets (use Select) or freeform text (use InputText).</p>}
      design={<><p>A ComboBox shows a text-input trigger; typing filters the menu of <code>ComboBoxMenuItem</code> children. Menu items can include icons, descriptions, and disabled states.</p><div className="demo-page__showcase" style={{ flexDirection: 'row', gap: 16 }}><div style={{ width: 280 }}><ComboBox items={[{ id: 'acme', label: 'Acme Corp' }, { id: 'globex', label: 'Globex' }, { id: 'initech', label: 'Initech' }]} /></div></div></>}
      developer={<><p>Import the <code>ComboBox</code> from <code>pada-ds</code> and configure with the props shown below.</p><CodeSnippet code={`import { ComboBox } from 'pada-ds';

const projects = [
  { id: 'acme', label: 'Acme Corp' },
  { id: 'globex', label: 'Globex' },
];

export function ProjectPicker() {
  return <ComboBox items={projects} />;
}`} language="tsx" label="ComboBox usage" /></>}
      accessibility={<ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}><li>Implements the WAI-ARIA combobox pattern with <code>role="combobox"</code> and a linked <code>listbox</code>.</li><li>Keyboard support: <kbd>↓</kbd>/<kbd>↑</kbd> moves through options, <kbd>Enter</kbd> selects, <kbd>Esc</kbd> closes.</li><li>The currently active option is announced via <code>aria-activedescendant</code>.</li><li>Disabled options are skipped from arrow-key navigation.</li></ul>}
    />
  );
}

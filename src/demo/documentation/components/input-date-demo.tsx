import DemoPage from '../DemoPage';
import { CodeSnippet } from '../../../components/CodeSnippet/CodeSnippet';
import { InputDate } from '../../../components/InputDate';

export default function InputDateDemo() {
  return (
    <DemoPage
      title="Input Date"
      kind="Component"
      purpose={<p>InputDate is a typed date entry field — a text input formatted for dates, with built-in validation and an optional calendar trigger. Use it when typing a known date is faster than picking from a calendar (booking flows, expense reports). Pair with DatePicker when both interactions are useful.</p>}
      design={<><p>InputDate provides a controlled text input with masked formatting, label, optional helper text, and an error state. It can be combined with a calendar dropdown for two-way entry.</p><div className="demo-page__showcase" style={{ flexDirection: 'row', gap: 16 }}><div style={{ width: 240 }}><InputDate label="Date of birth" /></div></div></>}
      developer={<><p>Import the <code>InputDate</code> from <code>pada-ds</code> and configure with the props shown below.</p><CodeSnippet code={`import { InputDate } from 'pada-ds';

export function DateField() {
  return <InputDate label="Date of birth" />;
}`} language="tsx" label="InputDate usage" /></>}
      accessibility={<ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}><li>Native <code>&lt;input&gt;</code> with <code>type="text"</code> and an explicit <code>aria-describedby</code> hint for the expected format.</li><li>Errors are announced via <code>aria-invalid</code> and a linked error message.</li><li>Keyboard arrow keys can step segments up/down within the masked field.</li></ul>}
    />
  );
}

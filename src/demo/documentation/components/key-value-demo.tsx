import DemoPage from '../DemoPage';
import { CodeSnippet } from '../../../components/CodeSnippet/CodeSnippet';
import { KeyValue } from '../../../components/KeyValue';

export default function KeyValueDemo() {
  return (
    <DemoPage
      title="Key Value"
      kind="Component"
      purpose={<p>KeyValue presents a label/value pair in a consistent typographic rhythm. Use it for read-only details — record metadata, billing summaries, audit logs — where dense pairs of facts need to be scanned. Group multiple KeyValues for a definition list feel.</p>}
      design={<><p>Each KeyValue places the label above (or beside) the value, with consistent stone-toned label typography and high-contrast value text.</p><div className="demo-page__showcase" style={{ flexDirection: 'column', gap: 16 }}><KeyValue label="Status">Active</KeyValue><KeyValue label="Created">May 27, 2026</KeyValue><KeyValue label="Owner">Supreeth Kashyap</KeyValue></div></>}
      developer={<><p>Import the <code>KeyValue</code> from <code>pada-ds</code> and configure with the props shown below.</p><CodeSnippet code={`import { KeyValue } from 'pada-ds';

export function RecordSummary() {
  return (
    <>
      <KeyValue label="Status">Active</KeyValue>
      <KeyValue label="Owner">Supreeth</KeyValue>
    </>
  );
}`} language="tsx" label="KeyValue usage" /></>}
      accessibility={<ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}><li>Renders as a semantic <code>&lt;dl&gt;</code> / <code>&lt;dt&gt;</code> / <code>&lt;dd&gt;</code> structure when grouped, so screen readers announce the relationship.</li><li>Use sufficient color contrast between the label (stone tones) and value (slate-900) to clear AA.</li></ul>}
    />
  );
}

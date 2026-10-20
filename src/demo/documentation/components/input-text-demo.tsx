import DemoPage from '../DemoPage';
import { CodeSnippet } from '../../../components/CodeSnippet/CodeSnippet';
import { InputText } from '../../../components/InputText';

export default function InputTextDemo() {
  return (
    <DemoPage
      title="Input Text"
      kind="Component"
      purpose={<p>InputText is the canonical single-line text field. Use it for names, emails, search queries, and other freeform short text. For long-form content, prefer InputTextArea; for filtered selection, use ComboBox or Select.</p>}
      design={<><p>InputText supports leading/trailing icons, prefix/suffix slots, helper text, and an error state. Sizes follow the form-control rhythm (32&nbsp;px tall by default).</p><div className="demo-page__showcase" style={{ flexDirection: 'row', gap: 16 }}><div style={{ width: 280 }}><InputText label="Email" placeholder="you@example.com" /></div></div></>}
      developer={<><p>Import the <code>InputText</code> from <code>pada-ds</code> and configure with the props shown below.</p><CodeSnippet code={`import { InputText } from 'pada-ds';

export function EmailField() {
  return <InputText label="Email" type="email" required />;
}`} language="tsx" label="InputText usage" /></>}
      accessibility={<ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}><li>Always provide a label via the <code>label</code> prop or wire your own control with <code>Field</code>.</li><li>Error states use <code>aria-invalid</code> + <code>aria-describedby</code> so screen readers announce the message.</li><li>Placeholder text is supplemental, never used as the sole label.</li></ul>}
    />
  );
}

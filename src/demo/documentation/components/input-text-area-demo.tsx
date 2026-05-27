import DemoPage from '../DemoPage';
import { CodeSnippet } from '../../../components/CodeSnippet/CodeSnippet';
import { InputTextArea } from '../../../components/InputTextArea';

export default function InputTextAreaDemo() {
  return (
    <DemoPage
      title="Input Text Area"
      kind="Component"
      purpose={<p>InputTextArea is the multi-line counterpart to InputText, used for free-form long text — descriptions, comments, JSON snippets. Use it whenever the expected content may exceed a single line; it auto-grows up to a configurable limit.</p>}
      design={<><p>Supports min/max rows, character counter, helper text, and error state. The component renders a real <code>&lt;textarea&gt;</code> for native browser behavior.</p><div className="demo-page__showcase" style={{ flexDirection: 'row', gap: 16 }}><div style={{ width: 320 }}><InputTextArea label="Comment" placeholder="Tell us what you think..." rows={4} /></div></div></>}
      developer={<><p>Import the <code>InputTextArea</code> from <code>pada-ds</code> and configure with the props shown below.</p><CodeSnippet code={`import { InputTextArea } from 'pada-ds';

export function FeedbackField() {
  return <InputTextArea label="Feedback" rows={4} maxLength={500} />;
}`} language="tsx" label="InputTextArea usage" /></>}
      accessibility={<ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}><li>Native <code>&lt;textarea&gt;</code> so keyboard navigation, IME, and screen readers all behave as expected.</li><li>When using a character counter, link it to the control with <code>aria-describedby</code> so the count is announced.</li><li>Resize handle is preserved by default; only override when the surrounding layout cannot accommodate growth.</li></ul>}
    />
  );
}

import DemoPage from '../DemoPage';
import { CodeSnippet } from '@pada/components/CodeSnippet/CodeSnippet';
import { FormLabel } from '@pada/components/FormLabel';

export default function FormLabelDemo() {
  return (
    <DemoPage
      title="Form Label"
      kind="Component"
      purpose={<p><strong>Deprecated since 2.0, removed in 3.0.</strong> Use <strong>Field</strong> (<code>Field.Label</code> inside <code>Field.Root</code>) instead, which also wires the control’s description and error. FormLabel is the canonical label primitive for any form control. It pairs a title with an optional description, optional required indicator, and an error slot. Use it as the wrapper around inputs to guarantee consistent spacing and accessible association.</p>}
      design={<><p>FormLabel renders a real <code>&lt;label&gt;</code> linked to its control via <code>htmlFor</code>. Use <code>required</code> to display an asterisk indicator and <code>optional</code> to display a muted “(optional)” tag.</p><div className="demo-page__showcase" style={{ flexDirection: 'column', gap: 16 }}><div style={{ width: 280 }}><FormLabel htmlFor="demo-email" required>Email address</FormLabel><input id="demo-email" type="email" style={{ marginTop: 4, width: '100%', padding: '6px 8px', borderRadius: 6, border: '1px solid var(--pada-color-border-strong)' }} /></div></div></>}
      developer={<><p>Import the <code>FormLabel</code> from <code>pada-ds</code> and configure with the props shown below.</p><CodeSnippet code={`import { FormLabel, InputText } from 'pada-ds';

export function EmailField() {
  return (
    <>
      <FormLabel htmlFor="email" required>Email</FormLabel>
      <InputText id="email" type="email" />
    </>
  );
}`} language="tsx" label="FormLabel usage" /></>}
      accessibility={<ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}><li>Renders a real <code>&lt;label&gt;</code> with <code>htmlFor</code> linking to its control, so clicking the label focuses the input.</li><li>Required state is exposed both visually (asterisk) and via <code>aria-required</code> on the wrapped control.</li><li>Error messages are linked to the control via <code>aria-describedby</code> for screen-reader users.</li></ul>}
    />
  );
}

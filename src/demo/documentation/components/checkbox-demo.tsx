import DemoPage from '../DemoPage';
import { CodeSnippet } from '../../../components/CodeSnippet/CodeSnippet';
import { Checkbox } from '../../../components/Checkbox';

export default function CheckboxDemo() {
  return (
    <DemoPage
      title="Checkbox"
      kind="Component"
      purpose={<p>Checkbox lets users select zero or more options from a set, or toggle a single boolean. Use checkboxes when each option is independent — switch to a Switch for instant-effect settings, or RadioGroup when only one value can be selected at a time.</p>}
      design={<><p>Checkbox supports unchecked, checked, indeterminate, and disabled states. Provide a label via the input pattern or a wrapping <code>FormLabel</code>.</p><div className="demo-page__showcase" style={{ flexDirection: 'column', gap: 16 }}><label style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Checkbox /> Unchecked</label><label style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Checkbox defaultChecked /> Checked</label><label style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Checkbox disabled /> Disabled</label></div></>}
      developer={<><p>Import the <code>Checkbox</code> from <code>pada-ds</code> and configure with the props shown below.</p><CodeSnippet code={`import { Checkbox } from 'pada-ds';

export function TermsAccept() {
  return (
    <label>
      <Checkbox name="terms" /> I agree to the terms
    </label>
  );
}`} language="tsx" label="Checkbox usage" /></>}
      accessibility={<ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}><li>Renders as a native <code>&lt;input type="checkbox"&gt;</code>, so keyboard activation with <kbd>Space</kbd> works natively.</li><li>Always associate a visible label, either by wrapping the input with <code>&lt;label&gt;</code> or via <code>htmlFor</code>.</li><li>Indeterminate state is exposed via <code>aria-checked="mixed"</code> for screen readers.</li><li>Focus ring uses <code>:focus-visible</code> with at least 3:1 contrast against the surface.</li></ul>}
    />
  );
}

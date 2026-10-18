import { useState } from 'react';
import DemoPage from '../DemoPage';
import { CodeSnippet } from '../../../components/CodeSnippet/CodeSnippet';
import { Field } from '../../../components/Field';
import { Stack } from '../../../components/Stack';

const list = { margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 } as const;
const textarea = {
  font: 'inherit',
  minHeight: 80,
  padding: 'var(--pada-space-2) var(--pada-space-3)',
  border: '1px solid var(--pada-color-border)',
  borderRadius: 'var(--pada-radius-md)',
  background: 'var(--pada-color-surface)',
  color: 'var(--pada-color-fg)',
  resize: 'vertical',
} as const;

export default function FieldDemo() {
  const [email, setEmail] = useState('ada@');
  const invalid = email.length > 0 && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  return (
    <DemoPage
      title="Field"
      kind="Component"
      purpose={<p>Field is the building block for any form control: a label, the control, help text and an error message, wired together for assistive technology. Use it to lay out a plain input, or to give your own control (a textarea, a native select, a third-party picker) the same label, description and error behaviour.</p>}
      design={
        <>
          <p>The label sits above the control and the description is muted. When the field is invalid, the error appears under the description in the danger colour and the control’s border turns red.</p>
          <div className="demo-page__showcase" style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 32, alignItems: 'flex-start' }}>
            <Stack gap={4} style={{ width: 300 }}>
              <Field.Root required invalid={invalid}>
                <Field.Label>Work email</Field.Label>
                <Field.Control type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" />
                <Field.Description>We’ll send the invite here.</Field.Description>
                <Field.Error>Enter an email address like ada@example.com.</Field.Error>
              </Field.Root>
              <Field.Root disabled>
                <Field.Label>Workspace URL</Field.Label>
                <Field.Control defaultValue="acme.pada.app" />
                <Field.Description>Contact support to change it.</Field.Description>
              </Field.Root>
            </Stack>
            <Stack gap={4} style={{ width: 300 }}>
              <Field.Root>
                <Field.Label>About you</Field.Label>
                <Field.Control asChild>
                  <textarea style={textarea} placeholder="A sentence or two" />
                </Field.Control>
                <Field.Description>Shown on your profile.</Field.Description>
              </Field.Root>
            </Stack>
          </div>
        </>
      }
      developer={
        <CodeSnippet
          code={`import { Field } from 'pada-ds';

<Field.Root required invalid={!!error}>
  <Field.Label>Work email</Field.Label>
  <Field.Control type="email" value={email} onChange={onChange} />
  <Field.Description>We’ll send the invite here.</Field.Description>
  <Field.Error>{error}</Field.Error>
</Field.Root>

// Your own control gets the same wiring
<Field.Root>
  <Field.Label>About you</Field.Label>
  <Field.Control asChild><textarea /></Field.Control>
</Field.Root>`}
          language="tsx"
          label="Field usage"
        />
      }
      accessibility={
        <ul style={list}>
          <li>The label is a real <code>&lt;label for&gt;</code>; the description and error are linked through <code>aria-describedby</code>.</li>
          <li><code>invalid</code> sets <code>aria-invalid</code> on the control, and the error is only rendered (and announced) while the field is invalid.</li>
          <li><code>required</code> sets <code>required</code> on the control and adds a visual asterisk hidden from screen readers, which announce “required” themselves.</li>
          <li>Validate on blur or submit, not on every keystroke, so people aren’t told they’re wrong while still typing.</li>
        </ul>
      }
    />
  );
}

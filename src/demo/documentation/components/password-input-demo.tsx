import DemoPage from '../DemoPage';
import { CodeSnippet } from '../../../components/CodeSnippet/CodeSnippet';
import { PasswordInput } from '../../../components/PasswordInput';

const list = { margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 } as const;

export default function PasswordInputDemo() {
  return (
    <DemoPage
      title="Password Input"
      kind="Component"
      purpose={<p>PasswordInput is a password field with a button to show what was typed, which cuts sign-in typos, and an optional strength meter for new passwords.</p>}
      design={
        <div className="demo-page__showcase" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 20, maxWidth: 360 }}>
          <PasswordInput label="Password" defaultValue="hunter2" />
          <PasswordInput label="New password" autoComplete="new-password" strength description="At least 12 characters, mixing letters, numbers and symbols." />
          <PasswordInput label="Confirm password" autoComplete="new-password" error="The passwords don't match." defaultValue="hunter3" />
        </div>
      }
      developer={
        <CodeSnippet
          code={`import { PasswordInput, estimatePasswordStrength } from 'pada-ds';

<PasswordInput label="Password" name="password" required />

// Sign-up: built-in estimate, or your own 0–4 score (zxcvbn, a server check…)
<PasswordInput label="New password" autoComplete="new-password" strength />
<PasswordInput label="New password" autoComplete="new-password" strength={zxcvbn(value).score} />`}
          language="tsx"
          label="PasswordInput usage"
        />
      }
      accessibility={
        <ul style={list}>
          <li>The toggle is a button named "Show password" with <code>aria-pressed</code>, so its state is announced.</li>
          <li>The strength meter is a <code>meter</code> named "Password strength" whose value is read as Weak, Fair, Good or Strong; colour is never the only signal.</li>
          <li>Defaults to <code>autocomplete="current-password"</code>; use <code>"new-password"</code> on sign-up so password managers can suggest one.</li>
        </ul>
      }
    />
  );
}

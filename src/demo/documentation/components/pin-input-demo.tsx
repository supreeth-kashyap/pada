import DemoPage from '../DemoPage';
import { CodeSnippet } from '../../../components/CodeSnippet/CodeSnippet';
import { PinInput } from '../../../components/PinInput';

const list = { margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 } as const;

export default function PinInputDemo() {
  return (
    <DemoPage
      title="Pin Input"
      kind="Component"
      purpose={<p>PinInput collects short codes one character per box: verification codes sent by text or email, PINs, and invite codes. Boxes make the expected length obvious and are easy to check at a glance.</p>}
      design={
        <div className="demo-page__showcase" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 24 }}>
          <PinInput label="Verification code" length={6} groupSize={3} description="We sent a code to •••• 4821." />
          <PinInput label="PIN" length={4} mask size="sm" />
          <PinInput label="Invite code" length={5} type="alphanumeric" defaultValue="P4D" error="That code has expired." />
        </div>
      }
      developer={
        <CodeSnippet
          code={`import { PinInput } from 'pada-ds';

<PinInput label="Verification code" length={6} name="code" onComplete={verify} />

// Headless
<PinInput.Root length={4} aria-label="PIN" mask>
  {[0, 1, 2, 3].map((index) => <PinInput.Input key={index} index={index} />)}
</PinInput.Root>`}
          language="tsx"
          label="PinInput usage"
        />
      }
      accessibility={
        <ul style={list}>
          <li>The boxes are a named group; each box is named "Character 2 of 6". The first box sets <code>autocomplete="one-time-code"</code> so phones can fill a code from a text message.</li>
          <li>Typing moves to the next box, <kbd>Backspace</kbd> goes back, the arrow keys and <kbd>Home</kbd> / <kbd>End</kbd> move between boxes, and pasting a full code fills them all.</li>
        </ul>
      }
    />
  );
}

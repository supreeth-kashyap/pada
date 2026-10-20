import { useState } from 'react';
import DemoPage from '../DemoPage';
import { CodeSnippet } from '@pada/components/CodeSnippet/CodeSnippet';
import { Toaster, toast, type ToasterPosition } from '@pada/components/Toast';
import { Button } from '@pada/components/Button';
import { Kbd } from '@pada/components/Kbd';
import { ToggleGroup } from '@pada/components/ToggleGroup';

const list = { margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 } as const;
const POSITIONS: ToasterPosition[] = ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'];

export default function ToastDemo() {
  const [position, setPosition] = useState<ToasterPosition>('bottom-right');
  return (
    <DemoPage
      title="Toast"
      kind="Component"
      purpose={<p>A toast briefly confirms the result of an action (“Invite sent”, “Copied”) without interrupting. It disappears on its own, so never put the only copy of important information or the only way to do something in a toast. Use an Alert for messages that must stay.</p>}
      design={
        <>
          <p>Toasts stack in a corner and fan out on hover or focus. Each one can carry a tone, a description and a single action. Swipe sideways to dismiss.</p>
          <div className="demo-page__showcase" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
            <ToggleGroup.Root type="single" size="sm" aria-label="Position" value={position} onValueChange={(value) => value && setPosition(value as ToasterPosition)}>
              {POSITIONS.map((name) => (
                <ToggleGroup.Item key={name} value={name}>
                  {name}
                </ToggleGroup.Item>
              ))}
            </ToggleGroup.Root>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              <Button variant="secondary" onClick={() => toast('Link copied')}>
                Neutral
              </Button>
              <Button variant="secondary" onClick={() => toast.success({ title: 'Invite sent', description: 'ada@example.com', action: { label: 'Undo', onClick: () => toast('Invite cancelled') } })}>
                Success with action
              </Button>
              <Button variant="secondary" onClick={() => toast.info({ title: 'New version available', description: 'Reload to update.' })}>
                Info
              </Button>
              <Button variant="secondary" onClick={() => toast.warning({ title: 'Storage almost full', description: '92% of 10 GB used.' })}>
                Warning
              </Button>
              <Button variant="secondary" onClick={() => toast.danger({ title: 'Upload failed', description: 'report.pdf is larger than 25 MB.', duration: 8000 })}>
                Danger
              </Button>
              <Button variant="ghost" onClick={() => toast.dismiss()}>
                Dismiss all
              </Button>
            </div>
            <p style={{ margin: 0 }}>
              Press <Kbd keys={['F8']} /> to move focus to the toasts and <Kbd keys={['Esc']} /> to dismiss the focused one.
            </p>
          </div>
          <Toaster position={position} />
        </>
      }
      developer={
        <CodeSnippet
          code={`import { Toaster, toast } from 'pada-ds';

// Once, near the root of the app (inside ThemeProvider)
<Toaster position="bottom-right" />

// Anywhere
toast('Link copied');
toast.success({
  title: 'Invite sent',
  description: 'ada@example.com',
  action: { label: 'Undo', onClick: undo },
});
const id = toast.info({ title: 'Uploading…', duration: Infinity });
toast.dismiss(id);`}
          language="tsx"
          label="Toast usage"
        />
      }
      accessibility={
        <ul style={list}>
          <li>Toasts live in a labelled region (“Notifications (F8)”). Toasts are announced politely; danger toasts assertively.</li>
          <li>Timers pause while the stack is hovered or focused and while the window is in the background, so people have time to read and act.</li>
          <li>F8 moves focus to the newest toast; Tab moves through actions; Escape dismisses. Swipe is never the only way to dismiss.</li>
          <li>Actions should be undoable elsewhere too, because a toast can time out before someone reaches it.</li>
        </ul>
      }
    />
  );
}

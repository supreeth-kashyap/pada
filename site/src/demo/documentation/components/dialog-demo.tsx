import { useState } from 'react';
import DemoPage from '../DemoPage';
import { CodeSnippet } from '@pada/components/CodeSnippet/CodeSnippet';
import { Dialog, type DialogSize } from '@pada/components/Dialog';
import { Button } from '@pada/components/Button';
import { Field } from '@pada/components/Field';
import { Stack } from '@pada/components/Stack';

const list = { margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 } as const;
const SIZES: DialogSize[] = ['sm', 'md', 'lg', 'xl', 'full'];

export default function DialogDemo() {
  const [name, setName] = useState('Ada Lovelace');
  return (
    <DemoPage
      title="Dialog"
      kind="Component"
      purpose={<p>Dialog opens a focused task on top of the page (editing a record, choosing settings, previewing a file) and blocks the page until it is done or dismissed. Keep dialogs short. To confirm a destructive action, use Alert Dialog; for side panels, use Drawer.</p>}
      design={
        <>
          <p>A header, scrolling body and footer. The panel scales and fades in from its trigger and back out on close. Width presets run from <code>sm</code> to <code>full</code>.</p>
          <div className="demo-page__showcase" style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            <Dialog.Root>
              <Dialog.Trigger asChild>
                <Button>Edit profile</Button>
              </Dialog.Trigger>
              <Dialog.Content>
                <Dialog.Header>
                  <Dialog.Title>Edit profile</Dialog.Title>
                  <Dialog.Description>This is how others see you across the workspace.</Dialog.Description>
                </Dialog.Header>
                <Dialog.Body>
                  <Stack gap={3}>
                    <Field.Root>
                      <Field.Label>Name</Field.Label>
                      <Field.Control value={name} onChange={(event) => setName(event.target.value)} />
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>Role</Field.Label>
                      <Field.Control defaultValue="Engineering" />
                      <Field.Description>Shown under your name in comments.</Field.Description>
                    </Field.Root>
                  </Stack>
                </Dialog.Body>
                <Dialog.Footer>
                  <Dialog.Close asChild>
                    <Button variant="secondary">Cancel</Button>
                  </Dialog.Close>
                  <Dialog.Close asChild>
                    <Button>Save</Button>
                  </Dialog.Close>
                </Dialog.Footer>
                <Dialog.CloseButton />
              </Dialog.Content>
            </Dialog.Root>
            {SIZES.map((size) => (
              <Dialog.Root key={size}>
                <Dialog.Trigger asChild>
                  <Button variant="secondary">{size}</Button>
                </Dialog.Trigger>
                <Dialog.Content size={size}>
                  <Dialog.Header>
                    <Dialog.Title>Size “{size}”</Dialog.Title>
                  </Dialog.Header>
                  <Dialog.Body>Long content scrolls inside the body while the header and footer stay put.</Dialog.Body>
                  <Dialog.CloseButton />
                </Dialog.Content>
              </Dialog.Root>
            ))}
          </div>
        </>
      }
      developer={
        <CodeSnippet
          code={`import { Dialog, Button } from 'pada-ds';

<Dialog.Root open={open} onOpenChange={setOpen}>
  <Dialog.Trigger asChild>
    <Button>Edit profile</Button>
  </Dialog.Trigger>
  <Dialog.Content size="md">
    <Dialog.Header>
      <Dialog.Title>Edit profile</Dialog.Title>
      <Dialog.Description>This is how others see you.</Dialog.Description>
    </Dialog.Header>
    <Dialog.Body>…</Dialog.Body>
    <Dialog.Footer>
      <Dialog.Close asChild><Button variant="secondary">Cancel</Button></Dialog.Close>
      <Button onClick={save}>Save</Button>
    </Dialog.Footer>
    <Dialog.CloseButton />
  </Dialog.Content>
</Dialog.Root>

// Unstyled behaviour only
import { Dialog } from 'pada-ds/headless';`}
          language="tsx"
          label="Dialog usage"
        />
      }
      accessibility={
        <ul style={list}>
          <li>Follows the WAI-ARIA dialog (modal) pattern: <code>role="dialog"</code>, <code>aria-modal</code>, named by the Title and described by the Description.</li>
          <li>Focus moves to the first focusable element (or one marked <code>data-autofocus</code>) on open, stays inside while open, and returns to the trigger on close.</li>
          <li>Escape and a click on the backdrop close it. The rest of the page is hidden from assistive technology and page scroll is locked.</li>
          <li>Animations are skipped under reduced motion.</li>
        </ul>
      }
    />
  );
}

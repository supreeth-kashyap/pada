import DemoPage from '../DemoPage';
import { CodeSnippet } from '../../../components/CodeSnippet/CodeSnippet';
import { ModalDemoPreview } from './_overlay-previews';

export default function ModalDemo() {
  return (
    <DemoPage
      title="Modal"
      kind="Component"
      purpose={<p><strong>Deprecated since 2.0, removed in 3.0.</strong> Use <strong>Dialog</strong> instead; Modal is now a thin wrapper over it. Modal interrupts the user with a focused task — a confirmation, a short form, or critical information. Use modals only when context cannot be preserved any other way; over-use breaks flow. Prefer SideDrawer for longer tasks and inline confirmation for low-stakes actions.</p>}
      design={<><p>Modal traps focus while open, dims the page behind, and dismisses on overlay click or <kbd>Esc</kbd>. The body slot accepts arbitrary content; standard footer patterns include primary + secondary buttons.</p><ModalDemoPreview /></>}
      developer={<><p>Import the <code>Modal</code> from <code>pada-ds</code> and configure with the props shown below.</p><CodeSnippet code={`import { useState } from 'react';
import { Modal, Button } from 'pada-ds';

export function DeleteConfirm() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Delete</Button>
      <Modal open={open} onOpenChange={setOpen} title="Delete record?">
        This cannot be undone.
      </Modal>
    </>
  );
}`} language="tsx" label="Modal usage" /></>}
      accessibility={<ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}><li>Uses <code>role="dialog"</code> with <code>aria-modal="true"</code> and an <code>aria-labelledby</code> pointing to the title.</li><li>Focus is trapped inside the modal while open and returned to the trigger on close.</li><li><kbd>Esc</kbd> closes the modal; clicking the backdrop dismisses by default but can be disabled.</li><li>Background content is marked <code>inert</code> while the modal is open so it cannot be focused or read.</li></ul>}
    />
  );
}

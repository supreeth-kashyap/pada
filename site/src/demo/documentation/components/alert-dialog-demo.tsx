import DemoPage from '../DemoPage';
import { CodeSnippet } from '@pada/components/CodeSnippet/CodeSnippet';
import { AlertDialog } from '@pada/components/AlertDialog';
import { Button } from '@pada/components/Button';
import { Toaster, toast } from '@pada/components/Toast';

const list = { margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 } as const;

export default function AlertDialogDemo() {
  return (
    <DemoPage
      title="Alert Dialog"
      kind="Component"
      purpose={<p>Alert Dialog interrupts to confirm an action that is destructive or hard to undo: deleting a project, discarding unsaved changes, revoking access. It asks one question and offers two answers. If the action can be undone, prefer doing it straight away with an Undo toast.</p>}
      design={
        <>
          <p>A compact dialog with a title, a description that states the consequence, and a footer with Cancel and the action. Clicking the backdrop does not close it.</p>
          <div className="demo-page__showcase" style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            <AlertDialog.Root>
              <AlertDialog.Trigger asChild>
                <Button variant="destructive" leftIcon="delete">
                  Delete project
                </Button>
              </AlertDialog.Trigger>
              <AlertDialog.Content>
                <AlertDialog.Header>
                  <AlertDialog.Title>Delete “Website redesign”?</AlertDialog.Title>
                  <AlertDialog.Description>The project, its 48 documents and their history will be removed for everyone. This can’t be undone.</AlertDialog.Description>
                </AlertDialog.Header>
                <AlertDialog.Footer>
                  <AlertDialog.Cancel>Keep project</AlertDialog.Cancel>
                  <AlertDialog.Action variant="destructive" onClick={() => toast.danger({ title: 'Project deleted' })}>
                    Delete project
                  </AlertDialog.Action>
                </AlertDialog.Footer>
              </AlertDialog.Content>
            </AlertDialog.Root>
            <AlertDialog.Root>
              <AlertDialog.Trigger asChild>
                <Button variant="secondary">Leave page</Button>
              </AlertDialog.Trigger>
              <AlertDialog.Content>
                <AlertDialog.Header>
                  <AlertDialog.Title>Discard unsaved changes?</AlertDialog.Title>
                  <AlertDialog.Description>You edited 3 fields since your last save.</AlertDialog.Description>
                </AlertDialog.Header>
                <AlertDialog.Footer>
                  <AlertDialog.Cancel>Keep editing</AlertDialog.Cancel>
                  <AlertDialog.Action onClick={() => toast('Changes discarded')}>Discard</AlertDialog.Action>
                </AlertDialog.Footer>
              </AlertDialog.Content>
            </AlertDialog.Root>
          </div>
          <Toaster />
        </>
      }
      developer={
        <CodeSnippet
          code={`import { AlertDialog, Button } from 'pada-ds';

<AlertDialog.Root>
  <AlertDialog.Trigger asChild>
    <Button variant="destructive">Delete project</Button>
  </AlertDialog.Trigger>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Delete “Website redesign”?</AlertDialog.Title>
      <AlertDialog.Description>This can’t be undone.</AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>Keep project</AlertDialog.Cancel>
      <AlertDialog.Action variant="destructive" onClick={remove}>Delete project</AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>`}
          language="tsx"
          label="Alert dialog usage"
        />
      }
      accessibility={
        <ul style={list}>
          <li>Uses <code>role="alertdialog"</code>, named by the Title and described by the Description, so the consequence is read out when it opens.</li>
          <li>Focus starts on Cancel, the safe choice, so pressing Enter by reflex never destroys anything.</li>
          <li>Escape cancels. A click outside does nothing, so the choice is always deliberate.</li>
          <li>Name the action button with the verb (“Delete project”), not “OK” or “Yes”.</li>
        </ul>
      }
    />
  );
}

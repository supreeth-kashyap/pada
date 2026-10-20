import DemoPage from '../DemoPage';
import { CodeSnippet } from '@pada/components/CodeSnippet/CodeSnippet';
import { SideDrawerDemoPreview } from './_overlay-previews';

export default function SideDrawerDemo() {
  return (
    <DemoPage
      title="Side Drawer"
      kind="Component"
      purpose={<p><strong>Deprecated since 2.0, removed in 3.0.</strong> Use <strong>Drawer</strong> instead; SideDrawer is now a thin wrapper over it. SideDrawer slides a panel in from the edge of the screen for secondary tasks — record details, settings, multi-step flows. Use it when the task is too long for a Modal but should not navigate away from the current page.</p>}
      design={<><p>SideDrawer supports four sizes (<code>sm</code>–<code>xl</code>) and slides in from the right. It traps focus while open and dismisses on overlay click or <kbd>Esc</kbd>.</p><SideDrawerDemoPreview /></>}
      developer={<><p>Import the <code>SideDrawer</code> from <code>pada-ds</code> and configure with the props shown below.</p><CodeSnippet code={`import { useState } from 'react';
import { SideDrawer, Button } from 'pada-ds';

export function SettingsDrawer() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Settings</Button>
      <SideDrawer open={open} onOpenChange={setOpen} size="md">
        <h2>Settings</h2>
      </SideDrawer>
    </>
  );
}`} language="tsx" label="SideDrawer usage" /></>}
      accessibility={<ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}><li>Uses <code>role="dialog"</code> with <code>aria-modal="true"</code> and a labelled heading.</li><li>Focus traps inside while open and returns to the trigger on close.</li><li>Background content is marked <code>inert</code> so it cannot be reached by keyboard or screen reader.</li></ul>}
    />
  );
}

import DemoPage from '../DemoPage';
import { CodeSnippet } from '@pada/components/CodeSnippet/CodeSnippet';
import { PopoverDemoPreview } from './_overlay-previews';

export default function PopoverDemo() {
  return (
    <DemoPage
      title="Popover"
      kind="Component"
      purpose={<p>Popover surfaces extra content — a menu, form, or detail card — anchored to a trigger. Use it for actions that need a small extension to the trigger but don\u2019t merit a full modal. Avoid using popovers for critical or confirming flows; reach for Modal instead.</p>}
      design={<><p>Popover supports four positions (top, right, bottom, left), a default and active visual variant, and dismisses on outside click or <kbd>Esc</kbd>.</p><PopoverDemoPreview /></>}
      developer={<><p>Import the <code>Popover</code> from <code>pada-ds</code> and configure with the props shown below.</p><CodeSnippet code={`import { useState } from 'react';
import { Popover, Button } from 'pada-ds';

export function HelpPopover() {
  const [open, setOpen] = useState(false);
  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      trigger={<Button variant="ghost">?</Button>}
      title="Quick tip"
    >
      This field accepts an email or username.
    </Popover>
  );
}`} language="tsx" label="Popover usage" /></>}
      accessibility={<ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}><li>Trigger exposes <code>aria-haspopup</code> and <code>aria-expanded</code>; the surface itself uses <code>role="dialog"</code> when content is interactive.</li><li>Focus moves into the popover on open and returns to the trigger on close.</li><li><kbd>Esc</kbd> dismisses; outside-click dismisses by default.</li></ul>}
    />
  );
}

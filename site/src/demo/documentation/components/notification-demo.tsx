import DemoPage from '../DemoPage';
import { CodeSnippet } from '@pada/components/CodeSnippet/CodeSnippet';
import { Notification } from '@pada/components/Notification';

export default function NotificationDemo() {
  return (
    <DemoPage
      title="Notification"
      kind="Component"
      purpose={<p><strong>Deprecated since 2.0, removed in 3.0.</strong> Use <strong>Toast</strong> (<code>Toaster</code> and <code>toast()</code>) instead: queued, stacked, swipe to dismiss. Notification surfaces transient feedback — success, error, info, or warning — typically after the user takes an action (saved, deleted, copied). Use it for short, time-bound messages that auto-dismiss; for persistent system messages, use Banner instead.</p>}
      design={<><p>Notification renders a toast with a title, optional subtitle, and optional visual. Toasts are positioned in one of six corners and slide in from the matching edge.</p><div className="demo-page__showcase" style={{ flexDirection: 'column', gap: 16 }}><div style={{ display: 'flex', flexDirection: 'column', gap: 12, position: 'relative', minHeight: 160 }}><Notification open onOpenChange={() => {}} title="Saved" subtitle="Your changes are live." position="top-right" /></div></div></>}
      developer={<><p>Import the <code>Notification</code> from <code>pada-ds</code> and configure with the props shown below.</p><CodeSnippet code={`import { useState } from 'react';
import { Notification } from 'pada-ds';

export function SaveToast() {
  const [open, setOpen] = useState(true);
  return (
    <Notification
      open={open}
      onOpenChange={setOpen}
      title="Saved"
      subtitle="Your changes are live."
    />
  );
}`} language="tsx" label="Notification usage" /></>}
      accessibility={<ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}><li>Each notification is announced via <code>role="status"</code> (info/success) or <code>role="alert"</code> (warning/error).</li><li>A close button with an explicit <code>aria-label</code> is always available for keyboard users.</li><li>Auto-dismiss timers are paused on hover/focus so users can read longer messages.</li></ul>}
    />
  );
}

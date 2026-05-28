import DemoPage from '../DemoPage';
import { CodeSnippet } from '../../../components/CodeSnippet/CodeSnippet';
import { Switch } from '../../../components/Switch';

export default function SwitchDemo() {
  return (
    <DemoPage
      title="Switch"
      kind="Component"
      purpose={<p>Switch toggles a single setting with immediate effect — turning notifications on, enabling dark mode, or flipping a feature flag. Use it for instant-effect booleans; for confirmed-on-submit booleans, prefer Checkbox.</p>}
      design={<><p>Switch renders a horizontal track with a sliding thumb. The "on" state uses an indigo surface; the "off" state uses a stone surface. Disabled and focus states are explicit.</p><div className="demo-page__showcase" style={{ flexDirection: 'column', gap: 16 }}><div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, max-content)', columnGap: 32, rowGap: 16, alignItems: 'center' }}><Switch label="Off — default" onChange={(e) => console.log('Switch off->on?', e.currentTarget.checked)} /><Switch defaultChecked label="On — default" onChange={(e) => console.log('Switch checked?', e.currentTarget.checked)} /><Switch disabled label="Off — disabled" /><Switch defaultChecked disabled label="On — disabled" /><Switch loading label="Off — loading" /><Switch defaultChecked loading label="On — loading" /><Switch autoFocus label="Off — focus (tab here)" /><Switch defaultChecked label="On — (focus via Tab)" /></div></div></>}
      developer={<><p>Import the <code>Switch</code> from <code>pada-ds</code> and configure with the props shown below.</p><CodeSnippet code={`import { useState } from 'react';
import { Switch } from 'pada-ds';

export function NotificationToggle() {
  // Uncontrolled — the Switch tracks its own checked state and fires onChange.
  return (
    <Switch
      label="Email notifications"
      onChange={(event) => console.log('checked?', event.currentTarget.checked)}
    />
  );
}

export function AsyncToggle() {
  // Controlled + loading state while persisting to a server.
  const [enabled, setEnabled] = useState(false);
  const [saving, setSaving] = useState(false);
  return (
    <Switch
      label="Two-factor auth"
      checked={enabled}
      loading={saving}
      onChange={async (event) => {
        const next = event.currentTarget.checked;
        setSaving(true);
        await fetch('/api/2fa', { method: 'PUT', body: JSON.stringify({ enabled: next }) });
        setEnabled(next);
        setSaving(false);
      }}
    />
  );
}`} language="tsx" label="Switch usage" /></>}
      accessibility={<ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}><li>Renders as a native <code>&lt;input type="checkbox"&gt;</code> with <code>role="switch"</code> so screen readers announce on/off rather than checked/unchecked.</li><li>Keyboard support: <kbd>Space</kbd> toggles; <kbd>Tab</kbd> moves into/out.</li><li>Always pair with a visible label describing the setting.</li></ul>}
    />
  );
}

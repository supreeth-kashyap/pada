import DemoPage from '../DemoPage';
import { CodeSnippet } from '../../../components/CodeSnippet/CodeSnippet';
import { Switch } from '../../../components/Switch';

export default function SwitchDemo() {
  return (
    <DemoPage
      title="Switch"
      kind="Component"
      purpose={<p>Switch toggles a single setting with immediate effect — turning notifications on, enabling dark mode, or flipping a feature flag. Use it for instant-effect booleans; for confirmed-on-submit booleans, prefer Checkbox.</p>}
      design={<><p>Switch renders a horizontal track with a sliding thumb. The "on" state uses an indigo surface; the "off" state uses a stone surface. Disabled and focus states are explicit.</p><div className="demo-page__showcase" style={{ flexDirection: 'column', gap: 16 }}><label style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Switch /> Off</label><label style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Switch defaultChecked /> On</label><label style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Switch disabled /> Disabled</label></div></>}
      developer={<><p>Import the <code>Switch</code> from <code>pada-ds</code> and configure with the props shown below.</p><CodeSnippet code={`import { Switch } from 'pada-ds';

export function NotificationToggle() {
  return (
    <label>
      <Switch /> Email notifications
    </label>
  );
}`} language="tsx" label="Switch usage" /></>}
      accessibility={<ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}><li>Renders as a native <code>&lt;input type="checkbox"&gt;</code> with <code>role="switch"</code> so screen readers announce on/off rather than checked/unchecked.</li><li>Keyboard support: <kbd>Space</kbd> toggles; <kbd>Tab</kbd> moves into/out.</li><li>Always pair with a visible label describing the setting.</li></ul>}
    />
  );
}

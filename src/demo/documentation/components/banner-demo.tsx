import DemoPage from '../DemoPage';
import { CodeSnippet } from '../../../components/CodeSnippet/CodeSnippet';
import { Banner } from '../../../components/Banner';

export default function BannerDemo() {
  return (
    <DemoPage
      title="Banner"
      kind="Component"
      purpose={<p>Banner displays a persistent, page-level message — system status, important warnings, or required actions that affect the entire workspace. Use it sparingly; one banner at a time keeps the message in focus. Banners are not for transient feedback (use Notification for that).</p>}
      design={<><p>Banner shows a title, optional subtitle, optional leading visual, and an optional call-to-action button. Place it at the top of the surface it applies to.</p><div className="demo-page__showcase" style={{ flexDirection: 'column', gap: 16 }}><div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}><Banner title="A new version is available." subtitle="Upgrade now to get the latest features." /><Banner title="Settings saved successfully." /><Banner title="Trial ends in 3 days." subtitle="Pick a plan to keep your workspace active." /></div></div></>}
      developer={<><p>Import the <code>Banner</code> from <code>pada-ds</code> and configure with the props shown below.</p><CodeSnippet code={`import { Banner } from 'pada-ds';

export function MaintenanceNotice() {
  return (
    <Banner
      title="Scheduled maintenance"
      subtitle="The workspace will be unavailable from 2am to 3am UTC."
    />
  );
}`} language="tsx" label="Banner usage" /></>}
      accessibility={<ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}><li>Each severity meets AA 4.5:1 text contrast against its tinted surface.</li><li>Banners use <code>role="status"</code> for non-critical messages and <code>role="alert"</code> for errors so screen readers announce changes.</li><li>When a banner is dismissible, focus returns to a logical neighbor after dismissal.</li></ul>}
    />
  );
}

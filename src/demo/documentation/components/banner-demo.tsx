import DemoPage from '../DemoPage';
import { CodeSnippet } from '../../../components/CodeSnippet/CodeSnippet';
import { Banner } from '../../../components/Banner';
import { Button } from '../../../components/Button';

export default function BannerDemo() {
  return (
    <DemoPage
      title="Banner"
      kind="Component"
      purpose={<p>Banner displays a persistent, page-level message — system status, important warnings, or required actions that affect the entire workspace. Use it sparingly; one banner at a time keeps the message in focus. Banners are not for transient feedback (use Notification for that).</p>}
      design={<><p>Banner is composed of an optional leading visual (icon or image, wrapped in a 12&nbsp;px-radius stone-100 frame), a title with optional subtitle, and an optional trailing call-to-action button. Container padding is 16&nbsp;×&nbsp;24&nbsp;px with a 24&nbsp;px gap and a 16&nbsp;px outer radius.</p><div className="demo-page__showcase" style={{ flexDirection: 'column', gap: 16 }}><div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}><Banner visualIcon="campaign" title="Auctor in at id eget diam bibendum egestas sapien sed sit ridiculus." subtitle="Purus fusce sit porta facilisis sagittis enim pellentesque vitae ac bibendum diam fames non nisi platea sapien id viverra nulla auctor nulla id amet etiam scelerisque et nec venenatis volutpat." button={<Button variant="primary" leftIcon="accessibility">Button</Button>} /><Banner visualIcon="download" title="A new version is available." subtitle="Upgrade now to get the latest features." button={<Button variant="primary">Update</Button>} /><Banner visualImage="/favicon.svg" visualAlt="Integration logo" title="Connect your data source." subtitle="Link Airtable, Notion, or your warehouse to start syncing records." /><Banner title="Settings saved successfully." subtitle="Your workspace preferences will apply on the next session." /></div></div></>}
      developer={<><p>Import the <code>Banner</code> from <code>pada-ds</code> and configure with the props shown below.</p><CodeSnippet code={`import { Banner, Button } from 'pada-ds';

export function MaintenanceNotice() {
  return (
    <Banner
      visualIcon="campaign"
      title="Scheduled maintenance"
      subtitle="The workspace will be unavailable from 2am to 3am UTC."
      button={<Button variant="primary">Acknowledge</Button>}
    />
  );
}

// Image-based visual (e.g. an integration logo)
export function IntegrationNotice() {
  return (
    <Banner
      visualImage="/logos/airtable.svg"
      visualAlt="Airtable"
      title="Connect Airtable"
      subtitle="Sync records to and from your Airtable bases."
    />
  );
}`} language="tsx" label="Banner usage" /></>}
      accessibility={<ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}><li>Title and subtitle both clear AA 4.5:1 contrast against the white container.</li><li>Banner uses <code>role="status"</code> for non-critical messages and <code>role="alert"</code> for errors so screen readers announce changes.</li><li>When <code>visualImage</code> is decorative, pass an empty <code>visualAlt=""</code>; when meaningful (e.g. a brand logo) pass the brand name so screen readers can announce it.</li><li>The trailing button is a real <code>&lt;button&gt;</code> from the design system, so focus, keyboard activation, and disabled states behave normally.</li></ul>}
    />
  );
}

import DemoPage from '../DemoPage';
import { CodeSnippet } from '../../../components/CodeSnippet/CodeSnippet';
import { BrandLogo } from '../../../components/Logo';

export default function LogoDemo() {
  return (
    <DemoPage
      title="Brand Logo"
      kind="Component"
      purpose={<p>BrandLogo (formerly <code>Logo</code>, which still works) renders a third-party brand or integration mark from the bundled SVG catalog. Use it in integration pickers, marketplace tiles, account-linking flows, and audit logs that reference external products.</p>}
      design={<><p>BrandLogo supports six sizes (<code>xs</code>–<code>2xl</code>) and an optional <code>background</code> surface. Pass the canonical <code>name</code> (e.g. <code>airtable</code>, <code>adobe_sign</code>) — BrandLogo resolves it against the bundled SVG/PNG catalog at runtime.</p><div className="demo-page__showcase" style={{ flexDirection: 'row', gap: 16 }}><BrandLogo name="airtable" size="xs" /><BrandLogo name="airtable" size="sm" /><BrandLogo name="airtable" size="md" /><BrandLogo name="airtable" size="lg" /><BrandLogo name="airtable" size="xl" /></div></>}
      developer={<><p>Import <code>BrandLogo</code> from <code>pada-ds</code> and configure with the props shown below.</p><CodeSnippet code={`import { BrandLogo } from 'pada-ds';

export function IntegrationTile() {
  return <BrandLogo name="airtable" size="md" tooltip="Airtable" />;
}`} language="tsx" label="BrandLogo usage" /></>}
      accessibility={<ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}><li>When wrapped in a link, provides a discernible name like "Pada — home" via <code>aria-label</code>.</li><li>Mark image renders with empty <code>alt=""</code> when paired with the wordmark, so screen readers announce the brand once.</li><li>Size scales preserve a 3:1 contrast minimum on all surface tints in the design system.</li></ul>}
    />
  );
}

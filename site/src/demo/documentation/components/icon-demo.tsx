import DemoPage from '../DemoPage';
import { CodeSnippet } from '@pada/components/CodeSnippet/CodeSnippet';
import { Icon } from '@pada/components/Icon';

export default function IconDemo() {
  return (
    <DemoPage
      title="Icon"
      kind="Component"
      purpose={<p>Icon renders a Material Symbol from the canonical Pada icon set. Use icons to reinforce labels, save space in dense UIs, or signal status — never as the only carrier of meaning. The component fetches SVGs from the Material Symbols CDN at weight 200 / outlined.</p>}
      design={<><p>Icon supports two paint variants: <code>stroke</code> (default, outline) and <code>fill</code> (solid silhouette). The two are mutually exclusive at the asset level so an icon never renders with both. Color inherits from <code>currentColor</code>.</p><div className="demo-page__showcase" style={{ flexDirection: 'row', gap: 16 }}><Icon name="dashboard" /><Icon name="inbox" /><Icon name="settings" /><Icon name="logout" /><Icon name="favorite" variant="fill" /></div></>}
      developer={<><p>Import the <code>Icon</code> from <code>pada-ds</code> and configure with the props shown below.</p><CodeSnippet code={`import { Icon } from 'pada-ds';

export function FavoriteIcon() {
  return <Icon name="favorite" variant="fill" size={20} color="var(--color-rose-600)" />;
}`} language="tsx" label="Icon usage" /></>}
      accessibility={<ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}><li>Decorative icons render with <code>aria-hidden="true"</code> by default — pair them with a visible text label.</li><li>For icon-only triggers (icon button, icon link), provide an <code>aria-label</code> or visually hidden text.</li><li>Icons inherit <code>color</code> from their parent so contrast scales with the surrounding text style.</li></ul>}
    />
  );
}

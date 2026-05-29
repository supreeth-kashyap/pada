import DemoPage from '../DemoPage';
import { CodeSnippet } from '../../../components/CodeSnippet/CodeSnippet';
import { Tags } from '../../../components/Tags';
import { Icon } from '../../../components/Icon';

export default function TagsDemo() {
  return (
    <DemoPage
      title="Tags"
      kind="Component"
      purpose={<p>Tags label entities with categorical metadata — labels, statuses, owners, environments. Use them in lists and tables where users need to scan many records at once. Keep the visual palette consistent within a context (e.g. always use the same color for "Production").</p>}
      design={<><p>Tags ship in six semantic variants (neutral, primary, secondary, success, danger, royal). Each uses a hue-50 bg, hue-100 border, and hue-700 text. They support an optional leading <code>icon</code> — pass either a Material symbol name or any React node such as an <code>&lt;Icon /&gt;</code>.</p><div className="demo-page__showcase" style={{ flexDirection: 'column', gap: 16 }}><div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, max-content)', gap: 12, alignItems: 'center' }}><Tags variant="neutral" icon={<Icon name="bookmark" size={12} />}>Neutral</Tags><Tags variant="neutral">Neutral (no icon)</Tags><Tags variant="primary" icon={<Icon name="info" size={12} />}>Primary</Tags><Tags variant="primary">Primary (no icon)</Tags><Tags variant="secondary" icon={<Icon name="schedule" size={12} />}>Secondary</Tags><Tags variant="secondary">Secondary (no icon)</Tags><Tags variant="success" icon={<Icon name="check_circle" size={12} />}>Success</Tags><Tags variant="success">Success (no icon)</Tags><Tags variant="danger" icon={<Icon name="error" size={12} />}>Danger</Tags><Tags variant="danger">Danger (no icon)</Tags><Tags variant="royal" icon={<Icon name="star" size={12} />}>Royal</Tags><Tags variant="royal">Royal (no icon)</Tags></div></div></>}
      developer={<><p>Import the <code>Tags</code> from <code>pada-ds</code> and configure with the props shown below.</p><CodeSnippet code={`import { Tags, Icon } from 'pada-ds';

// 1. Plain label — no icon, just text.
<Tags variant="success">Active</Tags>

// 2. Leading visual via the \`icon\` prop — pass any ReactNode.
//    Most commonly an \`<Icon />\` instance:
<Tags variant="danger" icon={<Icon name="error" size={12} />}>
  Failed
</Tags>

// 3. Shorthand: pass a Material-symbol name string and Tags renders
//    a properly-sized <Icon> for you.
<Tags variant="primary" icon="info">Heads up</Tags>`} language="tsx" label="Tags usage" /></>}
      accessibility={<ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}><li>Color is paired with a text label; never communicate status by color alone.</li><li>Each variant maintains AA contrast for the tag text against its tinted surface.</li><li>Tags are non-interactive by design — they are read-only metadata, not buttons.</li></ul>}
    />
  );
}

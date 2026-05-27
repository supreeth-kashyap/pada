import DemoPage from '../DemoPage';
import { CodeSnippet } from '../../../components/CodeSnippet/CodeSnippet';
import { Tags } from '../../../components/Tags';

export default function TagsDemo() {
  return (
    <DemoPage
      title="Tags"
      kind="Component"
      purpose={<p>Tags label entities with categorical metadata — labels, statuses, owners, environments. Use them in lists and tables where users need to scan many records at once. Keep the visual palette consistent within a context (e.g. always use the same color for "Production").</p>}
      design={<><p>Tags ship in 10 color variants and three sizes. They support an optional leading icon and an optional close button for filter contexts.</p><div className="demo-page__showcase" style={{ flexDirection: 'row', gap: 16 }}><Tags variant="primary">Primary</Tags><Tags variant="green">Active</Tags><Tags variant="yellow">Pending</Tags><Tags variant="red">Failed</Tags><Tags variant="gray">Archived</Tags></div></>}
      developer={<><p>Import the <code>Tags</code> from <code>pada-ds</code> and configure with the props shown below.</p><CodeSnippet code={`import { Tags } from 'pada-ds';

export function StatusTag({ status }) {
  return <Tags variant={status === 'active' ? 'green' : 'gray'}>{status}</Tags>;
}`} language="tsx" label="Tags usage" /></>}
      accessibility={<ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}><li>Color is paired with a text label; never communicate status by color alone.</li><li>When dismissible, the close button has an explicit <code>aria-label</code> like "Remove tag".</li><li>Each variant maintains AA contrast for the tag text against its tinted surface.</li></ul>}
    />
  );
}

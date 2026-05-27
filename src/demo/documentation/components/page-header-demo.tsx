import DemoPage from '../DemoPage';
import { CodeSnippet } from '../../../components/CodeSnippet/CodeSnippet';
import { PageHeader } from '../../../components/PageHeader';

export default function PageHeaderDemo() {
  return (
    <DemoPage
      title="Page Header"
      kind="Component"
      purpose={<p>PageHeader establishes the title, breadcrumbs, and primary actions of a page. Use it at the top of every full-page surface so users always know where they are and what they can do next.</p>}
      design={<><p>PageHeader anchors the top of every full-page surface with a breadcrumb trail, an optional command launcher, an optional AI assist trigger, and a profile slot.</p><div className="demo-page__showcase" style={{ flexDirection: 'row', gap: 16 }}><div style={{ width: '100%' }}><PageHeader breadcrumbs={[{ label: 'Workspace', href: '#' }, { label: 'Projects', href: '#' }, { label: 'Records' }]} commandLabel="Search" /></div></div></>}
      developer={<><p>Import the <code>PageHeader</code> from <code>pada-ds</code> and configure with the props shown below.</p><CodeSnippet code={`import { PageHeader } from 'pada-ds';

export function ProjectPage() {
  return (
    <PageHeader
      breadcrumbs={[{ label: 'Workspace', href: '/' }, { label: 'Projects' }]}
      commandLabel="Search"
      onCommandClick={() => {}}
    />
  );
}`} language="tsx" label="PageHeader usage" /></>}
      accessibility={<ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}><li>Title renders as an <code>&lt;h1&gt;</code> so it sets the page landmark for assistive tech.</li><li>Breadcrumbs are wrapped in a <code>&lt;nav aria-label="Breadcrumb"&gt;</code>; the current page uses <code>aria-current="page"</code>.</li><li>Action buttons keep tab order consistent (left-to-right or visual order).</li></ul>}
    />
  );
}

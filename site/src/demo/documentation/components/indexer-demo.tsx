import DemoPage from '../DemoPage';
import { CodeSnippet } from '@pada/components/CodeSnippet/CodeSnippet';
import { Indexer } from '@pada/components/Indexer';

export default function IndexerDemo() {
  return (
    <DemoPage
      title="Indexer"
      kind="Component"
      purpose={<p>Indexer provides a sticky, vertical list of section anchors for a long-scrolling page (also known as a "secondary nav"). Use it when a page contains discrete sections — like the documentation page itself — and users benefit from jumping between them without scrolling.</p>}
      design={<><p>Each entry is a clickable label with an active-state indicator (a 2&nbsp;px indigo bar on the leading edge). The active item is determined by the section currently in view.</p><div className="demo-page__showcase" style={{ flexDirection: 'row', gap: 16 }}><Indexer items={[{ id: 'purpose', label: 'Purpose' }, { id: 'design', label: 'Design' }, { id: 'developer', label: 'Developer' }, { id: 'a11y', label: 'Accessibility' }]} activeIndex={1} /></div></>}
      developer={<><p>Import the <code>Indexer</code> from <code>pada-ds</code> and configure with the props shown below.</p><CodeSnippet code={`import { Indexer } from 'pada-ds';

export function PageIndex() {
  return (
    <Indexer
      items={[
        { id: 'overview', label: 'Overview' },
        { id: 'usage', label: 'Usage' },
      ]}
    />
  );
}`} language="tsx" label="Indexer usage" /></>}
      accessibility={<ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}><li>Rendered as a <code>&lt;nav&gt;</code> with an accessible label like "Page sections".</li><li>Items are real anchors so keyboard users can <kbd>Tab</kbd> through them and screen readers announce the heading order.</li><li>The active item uses <code>aria-current="location"</code> so assistive tech announces which section is in view.</li></ul>}
    />
  );
}

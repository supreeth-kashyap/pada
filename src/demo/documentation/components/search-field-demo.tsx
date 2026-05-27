import DemoPage from '../DemoPage';
import { CodeSnippet } from '../../../components/CodeSnippet/CodeSnippet';
import { SearchField } from '../../../components/SearchField';

export default function SearchFieldDemo() {
  return (
    <DemoPage
      title="Search Field"
      kind="Component"
      purpose={<p>SearchField is a text input optimized for searching — a leading magnifying-glass icon, a clear-on-click affordance, and debounced change events. Use it as the primary entry point for finding items in a list, table, or page.</p>}
      design={<><p>SearchField wraps an input with a leading icon and a trailing clear button. It supports controlled and uncontrolled value modes and an optional <code>onSubmit</code>.</p><div className="demo-page__showcase" style={{ flexDirection: 'row', gap: 16 }}><div style={{ width: 320 }}><SearchField placeholder="Search records..." /></div></div></>}
      developer={<><p>Import the <code>SearchField</code> from <code>pada-ds</code> and configure with the props shown below.</p><CodeSnippet code={`import { SearchField } from 'pada-ds';

export function ListSearch() {
  return <SearchField placeholder="Search" onChange={(v) => console.log(v)} />;
}`} language="tsx" label="SearchField usage" /></>}
      accessibility={<ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}><li>Uses <code>type="search"</code> so browsers expose a native clear control on some platforms.</li><li>Provide an explicit label via <code>aria-label</code> when the icon is the only affordance.</li><li>Clear button has its own accessible name and is reachable by keyboard.</li></ul>}
    />
  );
}

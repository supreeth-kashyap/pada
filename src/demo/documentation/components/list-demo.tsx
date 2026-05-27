import DemoPage from '../DemoPage';
import { CodeSnippet } from '../../../components/CodeSnippet/CodeSnippet';
import { List, ListItem } from '../../../components/List';

export default function ListDemo() {
  return (
    <DemoPage
      title="List"
      kind="Component"
      purpose={<p>List renders a vertical stack of items — links, records, or actions — with consistent padding, dividers, and selection behavior. Use it for inboxes, navigation menus, search results, and anywhere a sequence of homogeneous items needs scannability.</p>}
      design={<><p>A List wraps one or more <code>ListItem</code> children. Each item supports leading icons, primary/secondary text, trailing content, and a selected state.</p><div className="demo-page__showcase" style={{ flexDirection: 'row', gap: 16 }}><div style={{ width: 320 }}><List><ListItem>First item</ListItem><ListItem>Second item</ListItem><ListItem>Third item</ListItem></List></div></div></>}
      developer={<><p>Import the <code>List</code> from <code>pada-ds</code> and configure with the props shown below.</p><CodeSnippet code={`import { List, ListItem } from 'pada-ds';

export function Inbox() {
  return (
    <List>
      <ListItem>Hello world</ListItem>
      <ListItem>Welcome to Pada</ListItem>
    </List>
  );
}`} language="tsx" label="List usage" /></>}
      accessibility={<ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}><li>Rendered as a <code>&lt;ul&gt;</code> / <code>&lt;li&gt;</code> structure so screen readers announce list semantics and length.</li><li>When items are interactive, each item is a real <code>&lt;button&gt;</code> or <code>&lt;a&gt;</code>.</li><li>Selected items expose <code>aria-selected</code> or <code>aria-current</code> as appropriate.</li></ul>}
    />
  );
}

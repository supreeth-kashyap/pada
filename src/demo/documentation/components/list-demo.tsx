import DemoPage from '../DemoPage';
import { CodeSnippet } from '../../../components/CodeSnippet/CodeSnippet';
import { List, ListItem } from '../../../components/List';

export default function ListDemo() {
  return (
    <DemoPage
      title="List"
      kind="Component"
      purpose={<p>List renders a vertical stack of items — links, records, or actions — with consistent padding, dividers, and selection behavior. Use it for inboxes, navigation menus, search results, and anywhere a sequence of homogeneous items needs scannability.</p>}
      design={<><p>A List wraps one or more <code>ListItem</code> children. Each item supports leading icons, primary/secondary text, trailing content, and a selected state.</p><div className="demo-page__showcase" style={{ flexDirection: 'row', gap: 16 }}><div style={{ width: 320 }}><List><ListItem>First item</ListItem><ListItem>Second item</ListItem><ListItem>Third item</ListItem></List></div></div><p>With <code>draggable</code>, items reorder by drag and drop or from the keyboard: focus a handle, press <kbd>Space</kbd> to lift the item, move it with <kbd>↑</kbd> / <kbd>↓</kbd>, and press <kbd>Space</kbd> to drop it. Neighbours slide out of the way.</p><div className="demo-page__showcase" style={{ flexDirection: 'row', gap: 16 }}><div style={{ width: 320 }}><List draggable label="Release checklist"><ListItem id="tokens">Ship tokens v2</ListItem><ListItem id="headless">Publish headless parts</ListItem><ListItem id="docs">Write the migration guide</ListItem><ListItem id="site">Launch the site</ListItem></List></div></div></>}
      developer={<><p>Import the <code>List</code> from <code>pada-ds</code> and configure with the props shown below.</p><CodeSnippet code={`import { List, ListItem } from 'pada-ds';

export function Inbox() {
  return (
    <List>
      <ListItem>Hello world</ListItem>
      <ListItem>Welcome to Pada</ListItem>
    </List>
  );
}

// Reorderable: give items ids and listen for the new order.
<List draggable label="Release checklist" onReorder={(ids) => save(ids)}>
  <ListItem id="tokens">Ship tokens v2</ListItem>
  <ListItem id="docs">Write the migration guide</ListItem>
</List>`} language="tsx" label="List usage" /></>}
      accessibility={<ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}><li>Exposes <code>role="list"</code> / <code>role="listitem"</code> (named with <code>label</code>) so screen readers announce list semantics and length.</li><li>In a draggable list each item has a handle button named "Move" plus the item text. <kbd>Space</kbd> or <kbd>Enter</kbd> lifts and drops (<code>aria-pressed</code> while lifted), the arrow keys and <kbd>Home</kbd> / <kbd>End</kbd> move it, and <kbd>Escape</kbd> puts it back. Each step is announced in a live region.</li><li>When items are interactive, each item is a real <code>&lt;button&gt;</code> or <code>&lt;a&gt;</code>.</li><li>Selected items expose <code>aria-selected</code> or <code>aria-current</code> as appropriate.</li></ul>}
    />
  );
}

import DemoPage from '../DemoPage';
import { CodeSnippet } from '../../../components/CodeSnippet/CodeSnippet';
import { Toolbar } from '../../../components/Toolbar';
import { Button } from '../../../components/Button';

export default function ToolbarDemo() {
  return (
    <DemoPage
      title="Toolbar"
      kind="Component"
      purpose={<p>Toolbar groups a small set of actions or controls into a single horizontal strip — typically near a list, table, or canvas. Use it for action affordances that apply to the surrounding content (filter, sort, bulk action, view switcher).</p>}
      design={<><p>Toolbar is a layout container that aligns its children with consistent spacing. Place buttons, inputs, dividers, and segment controls inside.</p><div className="demo-page__showcase" style={{ flexDirection: 'row', gap: 16 }}><div style={{ width: '100%' }}><Toolbar><Button>New</Button><Button variant="secondary">Filter</Button><Button variant="ghost">Sort</Button></Toolbar></div></div></>}
      developer={<><p>Import the <code>Toolbar</code> from <code>pada-ds</code> and configure with the props shown below.</p><CodeSnippet code={`import { Toolbar, Button } from 'pada-ds';

export function ListToolbar() {
  return (
    <Toolbar>
      <Button>New record</Button>
      <Button variant="ghost">Filter</Button>
    </Toolbar>
  );
}`} language="tsx" label="Toolbar usage" /></>}
      accessibility={<ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}><li>Wrapped in <code>role="toolbar"</code> with an accessible name.</li><li>Keyboard support follows the WAI-ARIA toolbar pattern: <kbd>Tab</kbd> enters/exits, <kbd>←/→</kbd> moves between controls.</li><li>Each control inside the toolbar retains its own focus indicator.</li></ul>}
    />
  );
}

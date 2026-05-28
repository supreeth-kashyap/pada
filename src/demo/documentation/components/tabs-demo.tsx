import DemoPage from '../DemoPage';
import { CodeSnippet } from '../../../components/CodeSnippet/CodeSnippet';
import { Tabs, TabPanel } from '../../../components/Tabs/Tabs';

export default function TabsDemo() {
  return (
    <DemoPage
      title="Tabs"
      kind="Component"
      purpose={<p>Tabs lets users switch among related content panes within a single page. Use them for parallel views of the same record (overview / activity / settings) — never to hide unrelated content. Keep the number of tabs small (3–5).</p>}
      design={<><p>Tabs renders a horizontal tablist with the active tab underlined. Panels mount only when active. Keyboard navigation cycles through tabs.</p><div className="demo-page__showcase" style={{ flexDirection: 'row', gap: 16 }}><div style={{ width: '100%' }}><Tabs label="Demo tabs" onChange={(index) => console.log('Tabs ->', index)}><TabPanel label="Overview"><div style={{ padding: 12 }}>Overview content</div></TabPanel><TabPanel label="Activity" notification><div style={{ padding: 12 }}>This tab has unread updates — note the red indicator dot on the tab label.</div></TabPanel><TabPanel label="Files"><div style={{ padding: 12 }}>Files content</div></TabPanel><TabPanel label="Settings"><div style={{ padding: 12 }}>Settings content</div></TabPanel></Tabs></div></div></>}
      developer={<><p>Import the <code>Tabs</code> from <code>pada-ds</code> and configure with the props shown below.</p><CodeSnippet code={`import { Tabs, TabPanel } from 'pada-ds';

export function RecordDetail({ hasUnreadActivity }: { hasUnreadActivity: boolean }) {
  return (
    <Tabs
      label="Record detail"
      // \`onChange\` fires with the newly active tab index whenever the
      // user clicks a tab or moves with the arrow keys.
      onChange={(index) => console.log('active tab', index)}
    >
      <TabPanel label="Overview">...</TabPanel>
      {/* \`notification\` shows a red dot on the label — use it to flag
          unread / new content inside the panel. */}
      <TabPanel label="Activity" notification={hasUnreadActivity}>...</TabPanel>
      <TabPanel label="Settings">...</TabPanel>
    </Tabs>
  );
}`} language="tsx" label="Tabs usage" /></>}
      accessibility={<ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}><li>Implements the WAI-ARIA tabs pattern: <code>role="tablist"</code>, <code>role="tab"</code>, <code>role="tabpanel"</code>.</li><li>Keyboard support: <kbd>←/→</kbd> moves between tabs, <kbd>Tab</kbd> moves into the panel.</li><li>Active tab carries <code>aria-selected="true"</code> and <code>tabindex="0"</code>; inactive tabs use <code>tabindex="-1"</code>.</li></ul>}
    />
  );
}

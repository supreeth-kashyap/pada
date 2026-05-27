import DemoPage from '../DemoPage';
import { CodeSnippet } from '../../../components/CodeSnippet/CodeSnippet';
import { Sidebar } from '../../../components/Sidebar';

export default function SidebarDemo() {
  return (
    <DemoPage
      title="Sidebar"
      kind="Component"
      purpose={<p>Sidebar is the primary navigation surface for product layouts. It shows brand identity, top-level workspaces, and grouped menu items. Use a single sidebar per layout and treat it as the most stable element on screen.</p>}
      design={<><p>Sidebar accepts data-driven sections and items, or compose <code>SidebarLogo</code>, <code>SidebarSection</code>, and <code>SidebarMenu</code> directly. Items support icons, badges, and selected state. The component scrolls internally and pins the logo header.</p><div className="demo-page__showcase" style={{ flexDirection: 'row', gap: 16 }}><div style={{ height: 280, width: 220, border: '1px solid var(--color-stone-200)', borderRadius: 12, overflow: 'hidden' }}><Sidebar data={{ sections: [{ id: 'main', items: [{ id: 'home', label: 'Home', selected: true }, { id: 'inbox', label: 'Inbox' }, { id: 'settings', label: 'Settings' }] }] }} /></div></div></>}
      developer={<><p>Import the <code>Sidebar</code> from <code>pada-ds</code> and configure with the props shown below.</p><CodeSnippet code={`import { Sidebar } from 'pada-ds';

export function AppShell() {
  return (
    <Sidebar
      data={{
        sections: [
          { id: 'main', items: [{ id: 'home', label: 'Home', href: '/' }] },
        ],
      }}
      activeId="home"
    />
  );
}`} language="tsx" label="Sidebar usage" /></>}
      accessibility={<ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}><li>Wrapped in a <code>&lt;nav&gt;</code> landmark with an accessible name.</li><li>Active item exposes <code>aria-current="page"</code> for assistive tech.</li><li>Internal scroll preserves keyboard tab order through every item.</li><li>Icons, when present, do not duplicate the visible label — they\u2019re marked decorative.</li></ul>}
    />
  );
}

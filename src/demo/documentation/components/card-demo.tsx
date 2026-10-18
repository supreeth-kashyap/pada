import DemoPage from '../DemoPage';
import { CodeSnippet } from '../../../components/CodeSnippet/CodeSnippet';
import { Card } from '../../../components/Card';

export default function CardDemo() {
  return (
    <DemoPage
      title="Card"
      kind="Component"
      purpose={<p>Card groups related content and actions into a contained surface. Use cards to chunk lists of entities (records, projects, dashboards) that the user can scan and act on. Avoid nesting cards or using them for ambient page chrome.</p>}
      design={<><p>Cards have a white surface with subtle shadow elevation, optional padding, and consistent corner radius. Compose them with headings, body text, and action buttons.</p><div className="demo-page__showcase" style={{ flexDirection: 'row', gap: 16 }}><div style={{ width: 280 }}><Card><div style={{ padding: 16 }}><h3 style={{ margin: 0, marginBottom: 8 }}>Card title</h3><p style={{ margin: 0, color: 'var(--pada-color-fg-muted)', fontSize: 13 }}>Cards group related information into a scannable surface.</p></div></Card></div></div></>}
      developer={<><p>Import the <code>Card</code> from <code>pada-ds</code> and configure with the props shown below.</p><CodeSnippet code={`import { Card } from 'pada-ds';

export function ProjectCard() {
  return (
    <Card>
      <h3>Acme rebrand</h3>
      <p>Started 3 days ago</p>
    </Card>
  );
}`} language="tsx" label="Card usage" /></>}
      accessibility={<ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}><li>Use a real heading element inside the card so screen readers can navigate by structure.</li><li>When the whole card is clickable, wrap it in an <code>&lt;a&gt;</code> or <code>&lt;button&gt;</code> rather than attaching <code>onClick</code> to the div.</li><li>Maintain at least AA contrast for any text or icon rendered on the card surface.</li></ul>}
    />
  );
}

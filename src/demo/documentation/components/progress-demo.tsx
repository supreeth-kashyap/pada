import DemoPage from '../DemoPage';
import { CodeSnippet } from '../../../components/CodeSnippet/CodeSnippet';
import { Progress } from '../../../components/Progress';

export default function ProgressDemo() {
  return (
    <DemoPage
      title="Progress"
      kind="Component"
      purpose={<p>Progress communicates the proportion completed of a known-length operation. Use determinate progress for uploads, batch jobs, or installation steps; for unknown durations, use Spinner instead, and Progress Circle where space is tight.</p>}
      design={<><p>Progress renders a horizontal bar from 0–100, with optional label and value. The track and bar use consistent stone-tone surfaces.</p><div className="demo-page__showcase" style={{ flexDirection: 'column', gap: 16 }}><div style={{ width: 320, display: 'flex', flexDirection: 'column', gap: 12 }}><Progress value={25} label="Uploading" /><Progress value={60} label="Processing" /><Progress value={100} label="Complete" /></div></div></>}
      developer={<><p>Import the <code>Progress</code> from <code>pada-ds</code> and configure with the props shown below.</p><CodeSnippet code={`import { Progress } from 'pada-ds';

export function UploadStatus({ pct }) {
  return <Progress value={pct} label="Uploading" />;
}`} language="tsx" label="Progress usage" /></>}
      accessibility={<ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}><li>Uses <code>role="progressbar"</code> with <code>aria-valuenow</code>, <code>aria-valuemin</code>, and <code>aria-valuemax</code>.</li><li>Provides a visible label or <code>aria-label</code> describing what is progressing.</li><li>Color contrast between track and fill clears the 3:1 non-text minimum.</li></ul>}
    />
  );
}

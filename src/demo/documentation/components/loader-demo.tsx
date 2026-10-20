import DemoPage from '../DemoPage';
import { CodeSnippet } from '../../../components/CodeSnippet/CodeSnippet';
import { Loader } from '../../../components/Loader';

export default function LoaderDemo() {
  return (
    <DemoPage
      title="Loader"
      kind="Component"
      purpose={<p><strong>Deprecated since 2.0, removed in 3.0.</strong> Use <strong>Spinner</strong> for inline loading, <strong>Progress Circle</strong> when progress is known, or <strong>Skeleton</strong> for placeholders. Loader signals that an asynchronous operation is in progress. Use it for short waits where displaying skeletons or progress would be overkill (e.g. button-level "saving..." state). For longer operations, prefer Progress for determinate work or skeletons for content placeholders.</p>}
      design={<><p>Loader renders a circular spinner in three sizes — <code>sm</code>, <code>md</code> (default), <code>lg</code> — and inherits its color from <code>currentColor</code> so it adapts to any surface.</p><div className="demo-page__showcase" style={{ flexDirection: 'row', gap: 16 }}><Loader size="sm" /><Loader size="md" /><Loader size="lg" /></div></>}
      developer={<><p>Import the <code>Loader</code> from <code>pada-ds</code> and configure with the props shown below.</p><CodeSnippet code={`import { Loader } from 'pada-ds';

export function SavingButton({ saving }) {
  return saving ? <Loader size="sm" /> : 'Save';
}`} language="tsx" label="Loader usage" /></>}
      accessibility={<ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}><li>Wraps the spinner in <code>role="status"</code> with a visually-hidden "Loading" label so screen readers announce activity.</li><li>Animation respects <code>prefers-reduced-motion: reduce</code> by slowing or pausing rotation.</li><li>Color contrast against the surface clears the 3:1 non-text minimum at all sizes.</li></ul>}
    />
  );
}

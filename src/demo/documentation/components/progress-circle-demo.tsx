import DemoPage from '../DemoPage';
import { CodeSnippet } from '../../../components/CodeSnippet/CodeSnippet';
import { ProgressCircle } from '../../../components/Progress';

const list = { margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 } as const;

export default function ProgressCircleDemo() {
  return (
    <DemoPage
      title="Progress Circle"
      kind="Component"
      purpose={<p>Progress Circle shows progress in a small space: a table cell, a file row or a button. Use Progress where there is room for a bar and a label.</p>}
      design={
        <>
          <p>A ring that fills clockwise from the top, or spins while there is no value. Three sizes; the large one can show the percentage inside.</p>
          <div className="demo-page__showcase" style={{ flexDirection: 'row', gap: 32, alignItems: 'center' }}>
            <ProgressCircle label="Uploading report.pdf" value={64} />
            <ProgressCircle label="Syncing" size="sm" />
            <ProgressCircle label="Storage used" value={72} size="lg" showValue />
            <ProgressCircle label="Uploaded" value={100} />
          </div>
        </>
      }
      developer={
        <CodeSnippet
          code={`import { ProgressCircle } from 'pada-ds';

<ProgressCircle label="Uploading report.pdf" value={64} />
<ProgressCircle label="Syncing" size="sm" />              // indeterminate
<ProgressCircle label="Storage used" value={72} size="lg" showValue />`}
          language="tsx"
          label="Progress Circle usage"
        />
      }
      accessibility={
        <ul style={list}>
          <li>Renders <code>role="progressbar"</code> named by the required <code>label</code>, with <code>aria-valuenow</code> and a percentage <code>aria-valuetext</code>.</li>
          <li>While indeterminate, <code>aria-valuenow</code> is left out so screen readers announce it as busy.</li>
          <li>Under reduced motion the spinning arc pulses instead.</li>
        </ul>
      }
    />
  );
}

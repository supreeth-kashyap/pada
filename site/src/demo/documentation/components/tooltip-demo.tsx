import DemoPage from '../DemoPage';
import { CodeSnippet } from '@pada/components/CodeSnippet/CodeSnippet';
import { Tooltip } from '@pada/components/Tooltip';

export default function TooltipDemo() {
  return (
    <DemoPage
      title="Tooltip"
      kind="Component"
      purpose={<p>Tooltip reveals supplementary text on hover or focus — typically clarifying an icon-only button or a truncated value. Use them sparingly and never for content that the user must read to complete a task.</p>}
      design={<><p>Tooltip supports four placements (top/right/bottom/left) and is keyboard-accessible. It renders only when the trigger is hovered or focused.</p><div className="demo-page__showcase" style={{ flexDirection: 'row', gap: 16 }}><Tooltip content="Quick tip"><button style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid var(--pada-color-border-strong)', background: 'var(--pada-color-surface)', color: 'var(--pada-color-fg)' }}>Hover me</button></Tooltip></div></>}
      developer={<><p>Import the <code>Tooltip</code> from <code>pada-ds</code> and configure with the props shown below.</p><CodeSnippet code={`import { Tooltip } from 'pada-ds';

export function ArchiveButton() {
  return (
    <Tooltip content="Archive this record">
      <button>Archive</button>
    </Tooltip>
  );
}`} language="tsx" label="Tooltip usage" /></>}
      accessibility={<ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}><li>Trigger and tooltip are linked via <code>aria-describedby</code> so screen readers announce the description.</li><li>Tooltip appears on both hover and focus, and stays open while focus or hover persists.</li><li>Never put critical or interactive content inside a tooltip — only short, supplementary text.</li></ul>}
    />
  );
}

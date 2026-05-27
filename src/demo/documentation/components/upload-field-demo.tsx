import DemoPage from '../DemoPage';
import { CodeSnippet } from '../../../components/CodeSnippet/CodeSnippet';
import { UploadField } from '../../../components/UploadField';

export default function UploadFieldDemo() {
  return (
    <DemoPage
      title="Upload Field"
      kind="Component"
      purpose={<p>UploadField lets users add files via drag-and-drop or a click-to-browse picker. Use it for attachment flows, profile photos, and document submission. The component handles validation (size, type) and per-file progress reporting.</p>}
      design={<><p>UploadField shows a dashed drop zone, a file picker button, and a list of uploaded files with progress and error states. Limits (<code>maxSize</code>, <code>maxFiles</code>) are enforced before upload.</p><div className="demo-page__showcase" style={{ flexDirection: 'row', gap: 16 }}><div style={{ width: '100%' }}><UploadField label="Attachments" description="PDF or PNG up to 5 MB" accept="application/pdf,image/png" maxSize={5 * 1024 * 1024} /></div></div></>}
      developer={<><p>Import the <code>UploadField</code> from <code>pada-ds</code> and configure with the props shown below.</p><CodeSnippet code={`import { UploadField } from 'pada-ds';

export function Attachments() {
  return (
    <UploadField
      label="Attachments"
      multiple
      accept="application/pdf"
      onUpload={async (files) => {/* ... */}}
    />
  );
}`} language="tsx" label="UploadField usage" /></>}
      accessibility={<ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}><li>The drop zone is a real <code>&lt;button&gt;</code> with an explicit <code>aria-label</code>; keyboard <kbd>Enter</kbd> opens the file picker.</li><li>Per-file progress is announced via <code>role="status"</code>; errors via <code>role="alert"</code>.</li><li>File list items expose remove buttons with descriptive <code>aria-label</code>s.</li><li>When disabled, the drop zone is removed from the tab order and reads as disabled.</li></ul>}
    />
  );
}

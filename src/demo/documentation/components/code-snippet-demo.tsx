import DemoPage from '../DemoPage';
import { CodeSnippet } from '../../../components/CodeSnippet/CodeSnippet';
import { CodeSnippet as CS } from '../../../components/CodeSnippet/CodeSnippet';

export default function CodeSnippetDemo() {
  return (
    <DemoPage
      title="Code Snippet"
      kind="Component"
      purpose={<p>CodeSnippet renders syntax-highlighted source code with a one-click copy affordance. Use it inside docs, examples, error details, and onboarding steps where users may need to paste a command or template into their own environment.</p>}
      design={<><p>CodeSnippet supports three layout types — <code>multi-line</code> (default), <code>single-line</code>, and <code>micro</code> — and a wide range of languages (TypeScript, JavaScript, JSON, YAML, Bash, Python).</p><div className="demo-page__showcase" style={{ flexDirection: 'column', gap: 16 }}><div style={{ width: '100%' }}><CS code={'npm install pada-ds'} language="bash" type="single-line" /></div></div></>}
      developer={<><p>Import the <code>CodeSnippet</code> from <code>pada-ds</code> and configure with the props shown below.</p><CodeSnippet code={`import { CodeSnippet } from 'pada-ds';

export function Example() {
  return (
    <CodeSnippet
      code={'console.log("hello world");'}
      language="javascript"
      label="Quickstart"
    />
  );
}`} language="tsx" label="CodeSnippet usage" /></>}
      accessibility={<ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}><li>The Copy button is a real <code>&lt;button&gt;</code> with a visible label and an accessible name.</li><li>The code region uses <code>aria-label</code> indicating the language, so screen readers can announce context.</li><li>Copy success is announced via a transient label change ("Copied"), and re-announced for screen-reader users.</li></ul>}
    />
  );
}

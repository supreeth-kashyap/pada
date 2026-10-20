import DemoPage from '../DemoPage';
import { CodeSnippet } from '@pada/components/CodeSnippet/CodeSnippet';
import { Spinner } from '@pada/components/Spinner';
import { Button } from '@pada/components/Button';

const list = { margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 } as const;

export default function SpinnerDemo() {
  return (
    <DemoPage
      title="Spinner"
      kind="Component"
      purpose={<p>Spinner shows that something is loading when you can’t say how long it will take. Keep it small and close to what is loading. When the layout of the result is known, a Skeleton feels faster; where progress is known, use Progress Circle.</p>}
      design={
        <>
          <p>Three sizes that inherit the current text colour. Buttons have a built-in loading state that uses the same spinner.</p>
          <div className="demo-page__showcase" style={{ flexDirection: 'row', gap: 32, alignItems: 'center' }}>
            <Spinner size="sm" />
            <Spinner />
            <Spinner size="lg" />
            <span style={{ color: 'var(--pada-color-accent-fg)', display: 'inline-flex', gap: 8, alignItems: 'center' }}>
              <Spinner size="sm" label={null} /> Syncing…
            </span>
            <Button loading>Saving</Button>
          </div>
        </>
      }
      developer={
        <CodeSnippet
          code={`import { Spinner, Button } from 'pada-ds';

<Spinner />                         // announced as "Loading"
<Spinner size="sm" label="Syncing" />
<Button loading>Save</Button>       // uses Spinner and aria-busy`}
          language="tsx"
          label="Spinner usage"
        />
      }
      accessibility={
        <ul style={list}>
          <li>Renders <code>role="status"</code> with a visually hidden label (“Loading” by default), so screen readers announce it politely.</li>
          <li>Pass <code>label={'{null}'}</code> when the spinner sits inside something already marked busy, such as a loading button, to avoid announcing it twice.</li>
          <li>Under reduced motion the spinner pulses slowly instead of rotating.</li>
        </ul>
      }
    />
  );
}

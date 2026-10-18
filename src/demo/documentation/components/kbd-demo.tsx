import DemoPage from '../DemoPage';
import { CodeSnippet } from '../../../components/CodeSnippet/CodeSnippet';
import { Kbd } from '../../../components/Kbd';

const list = { margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 } as const;
const text = { margin: 0, color: 'var(--pada-color-fg)' } as const;

export default function KbdDemo() {
  return (
    <DemoPage
      title="Kbd"
      kind="Component"
      purpose={<p>Kbd shows a key or a shortcut in text: in help, tooltips, menus and empty states. It is display only and doesn’t create the shortcut.</p>}
      design={
        <>
          <p>Keys look like small keycaps and scale with the surrounding text. Combinations render as separate keys.</p>
          <div className="demo-page__showcase" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 12 }}>
            <p style={text}>
              Press <Kbd keys={['⌘', 'K']} /> to open the command palette.
            </p>
            <p style={text}>
              Save with <Kbd keys={['Ctrl', 'S']} />, or <Kbd>Esc</Kbd> to cancel.
            </p>
            <p style={text}>
              Move with <Kbd>↑</Kbd> <Kbd>↓</Kbd>, then <Kbd>Enter</Kbd>.
            </p>
            <p style={{ ...text, fontSize: 'var(--pada-font-size-sm)' }}>
              Smaller text: <Kbd keys={['⇧', '⌘', 'P']} />
            </p>
          </div>
        </>
      }
      developer={
        <CodeSnippet
          code={`import { Kbd } from 'pada-ds';

<p>Press <Kbd keys={['⌘', 'K']} /> to search.</p>
<Kbd>Esc</Kbd>`}
          language="tsx"
          label="Kbd usage"
        />
      }
      accessibility={
        <ul style={list}>
          <li>Renders native <code>&lt;kbd&gt;</code> elements.</li>
          <li>Symbols such as ⌘ and ⇧ are read inconsistently by screen readers. Add the words nearby (“Command K”) or an <code>aria-label</code> on the surrounding text where it matters.</li>
          <li>Show the shortcut for the person’s platform: ⌘ on macOS, Ctrl elsewhere.</li>
        </ul>
      }
    />
  );
}

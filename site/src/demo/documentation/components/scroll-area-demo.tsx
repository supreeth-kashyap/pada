import DemoPage from '../DemoPage';
import { CodeSnippet } from '@pada/components/CodeSnippet/CodeSnippet';
import { ScrollArea } from '@pada/components/ScrollArea';

const list = { margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 } as const;
const box = { width: 280, border: '1px solid var(--pada-color-border)', borderRadius: 'var(--pada-radius-xl)', background: 'var(--pada-color-surface)' } as const;
const tags = ['tokens', 'headless', 'dialog', 'popover', 'menu', 'tabs', 'tree', 'calendar', 'toast', 'combobox', 'accordion', 'theme'];

export default function ScrollAreaDemo() {
  return (
    <DemoPage
      title="Scroll Area"
      kind="Component"
      purpose={<p>ScrollArea is a region that scrolls on its own: a long list in a panel, a log, a row of chips. It keeps native scrolling (touch, wheel, keyboard, find-in-page) and only themes the scrollbar and fades the edges where more content is hidden.</p>}
      design={
        <>
          <p>The scrollbar is slim and appears while you hover or scroll (<code>scrollbar="always"</code> keeps it). Edges fade only on the side that has more to show.</p>
          <div className="demo-page__showcase" style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 32, alignItems: 'flex-start' }}>
            <div style={box}>
              <ScrollArea aria-label="Release notes" maxHeight={220}>
                <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {Array.from({ length: 14 }, (_, index) => (
                    <p key={index} style={{ margin: 0 }}>
                      {index + 1}. Every component reads its colours, spacing and motion from tokens.
                    </p>
                  ))}
                </div>
              </ScrollArea>
            </div>
            <div style={box}>
              <ScrollArea aria-label="Tags" orientation="horizontal">
                <div style={{ display: 'flex', gap: 8, padding: 12, width: 'max-content' }}>
                  {tags.map((tag) => (
                    <span key={tag} style={{ padding: '4px 10px', borderRadius: 999, background: 'var(--pada-color-neutral-subtle)' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </>
      }
      developer={
        <CodeSnippet
          code={`import { ScrollArea } from 'pada-ds';

<ScrollArea aria-label="Activity" maxHeight={320}>
  <ActivityList />
</ScrollArea>

<ScrollArea aria-label="Filters" orientation="horizontal" fade={false}>
  <ChipRow />
</ScrollArea>`}
          language="tsx"
          label="ScrollArea usage"
        />
      }
      accessibility={
        <ul style={list}>
          <li>Scrolling is native, so the arrow keys, Page Up/Down, Space and screen-reader navigation all work.</li>
          <li>When its content overflows, the area becomes focusable (and a named region when it has an <code>aria-label</code>) so keyboard users can scroll it; it shows a focus ring inside its edge.</li>
        </ul>
      }
    />
  );
}

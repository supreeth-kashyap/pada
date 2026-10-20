import { useState } from 'react';
import DemoPage from '../DemoPage';
import { CodeSnippet } from '@pada/components/CodeSnippet/CodeSnippet';
import { Resizable } from '@pada/components/Resizable';

const list = { margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 } as const;
const frame = {
  height: 280,
  width: '100%',
  border: '1px solid var(--pada-color-border)',
  borderRadius: 'var(--pada-radius-lg)',
  background: 'var(--pada-color-surface)',
  overflow: 'hidden',
} as const;
const pane = (tint: string) =>
  ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    padding: 16,
    boxSizing: 'border-box',
    background: tint,
    color: 'var(--pada-color-fg)',
    fontSize: 'var(--pada-font-size-sm)',
  }) as const;

export default function ResizableDemo() {
  const [sizes, setSizes] = useState<number[]>([25, 50, 25]);
  return (
    <DemoPage
      title="Resizable"
      kind="Component"
      purpose={<p>Resizable splits an area into panels that people can resize: a file list beside an editor, a preview under a form, an inspector on the side. Use it when people need to trade space between views as they work. Save the sizes with <code>onSizesCommit</code> to remember the layout.</p>}
      design={
        <>
          <p>A thin line marks the boundary and thickens in the accent colour on hover, focus and drag. A grip helps people find it. Panels can be collapsed.</p>
          <div className="demo-page__showcase" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
            <div style={frame}>
              <Resizable.Root sizes={sizes} onSizesChange={setSizes}>
                <Resizable.Panel minSize={15} maxSize={40} collapsible>
                  <div style={pane('var(--pada-color-surface-sunken)')}>
                    <strong>Files</strong>
                    <span style={{ color: 'var(--pada-color-fg-muted)' }}>{Math.round(sizes[0])}% · collapsible</span>
                  </div>
                </Resizable.Panel>
                <Resizable.Handle withGrip aria-label="Resize file list" />
                <Resizable.Panel minSize={30}>
                  <Resizable.Root orientation="vertical">
                    <Resizable.Panel defaultSize={65} minSize={20}>
                      <div style={pane('var(--pada-color-surface)')}>
                        <strong>Editor</strong>
                        <span style={{ color: 'var(--pada-color-fg-muted)' }}>{Math.round(sizes[1])}% wide</span>
                      </div>
                    </Resizable.Panel>
                    <Resizable.Handle aria-label="Resize terminal" />
                    <Resizable.Panel minSize={15}>
                      <div style={pane('var(--pada-color-surface-sunken)')}>
                        <strong>Terminal</strong>
                      </div>
                    </Resizable.Panel>
                  </Resizable.Root>
                </Resizable.Panel>
                <Resizable.Handle withGrip aria-label="Resize inspector" />
                <Resizable.Panel minSize={15}>
                  <div style={pane('var(--pada-color-surface-sunken)')}>
                    <strong>Inspector</strong>
                    <span style={{ color: 'var(--pada-color-fg-muted)' }}>{Math.round(sizes[2])}%</span>
                  </div>
                </Resizable.Panel>
              </Resizable.Root>
            </div>
          </div>
        </>
      }
      developer={
        <CodeSnippet
          code={`import { Resizable } from 'pada-ds';

<Resizable.Root onSizesCommit={(sizes) => localStorage.setItem('layout', JSON.stringify(sizes))}>
  <Resizable.Panel defaultSize={25} minSize={15} maxSize={40} collapsible>Files</Resizable.Panel>
  <Resizable.Handle withGrip aria-label="Resize file list" />
  <Resizable.Panel minSize={30}>
    <Resizable.Root orientation="vertical">
      <Resizable.Panel defaultSize={65}>Editor</Resizable.Panel>
      <Resizable.Handle aria-label="Resize terminal" />
      <Resizable.Panel>Terminal</Resizable.Panel>
    </Resizable.Root>
  </Resizable.Panel>
</Resizable.Root>

// Behaviour only
import { Resizable } from 'pada-ds/headless';`}
          language="tsx"
          label="Resizable usage"
        />
      }
      accessibility={
        <ul style={list}>
          <li>Each handle follows the WAI-ARIA window splitter pattern: a focusable <code>separator</code> whose value is the size of the panel before it (<code>aria-valuenow</code>, <code>-min</code>, <code>-max</code>), and which controls that panel.</li>
          <li>Arrow keys resize by 10% (<code>keyboardStep</code>), Home and End jump to the limits, and Enter collapses or restores a collapsible panel. Double-click does the same with a pointer.</li>
          <li>Name each handle after what it resizes (“Resize file list”); the default name is “Resize”.</li>
          <li>Sizes are percentages of the group, so the layout holds when the window resizes.</li>
        </ul>
      }
    />
  );
}

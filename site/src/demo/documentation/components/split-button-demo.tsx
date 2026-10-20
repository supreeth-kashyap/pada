import DemoPage from '../DemoPage';
import { CodeSnippet } from '@pada/components/CodeSnippet/CodeSnippet';
import { Button } from '@pada/components/Button';
import { DropdownMenu } from '@pada/components/DropdownMenu';
import { SplitButton } from '@pada/components/SplitButton';

const list = { margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 } as const;

export default function SplitButtonDemo() {
  return (
    <DemoPage
      title="Split Button"
      kind="Component"
      purpose={<p>Split Button pairs a main action with a chevron that offers related ones, such as Save with “Save as draft”. Use it when one choice is clearly the default.</p>}
      design={
        <>
          <p>Primary and secondary variants in three sizes. The two halves are separate buttons, so the chevron is usually a dropdown menu trigger.</p>
          <div className="demo-page__showcase" style={{ flexDirection: 'column', gap: 24, alignItems: 'flex-start' }}>
            <SplitButton.Root label="Save options">
              <Button>Save</Button>
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <SplitButton.Splitter />
                </DropdownMenu.Trigger>
                <DropdownMenu.Content align="end">
                  <DropdownMenu.Item>Save as draft</DropdownMenu.Item>
                  <DropdownMenu.Item>Save and publish</DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            </SplitButton.Root>
            <SplitButton.Root variant="secondary" size="sm" label="Export options">
              <Button leftIcon="download">Export</Button>
              <SplitButton.Splitter label="Export options" />
            </SplitButton.Root>
          </div>
        </>
      }
      developer={
        <CodeSnippet
          code={`import { Button, DropdownMenu, SplitButton } from 'pada-ds';

<SplitButton.Root variant="primary" label="Save options">
  <Button onClick={save}>Save</Button>
  <DropdownMenu.Root>
    <DropdownMenu.Trigger asChild><SplitButton.Splitter /></DropdownMenu.Trigger>
    <DropdownMenu.Content align="end">…</DropdownMenu.Content>
  </DropdownMenu.Root>
</SplitButton.Root>

// 1.x, still supported (deprecated): <Button split onSplitClick={…}>Save</Button>`}
          language="tsx"
          label="Split Button usage"
        />
      }
      accessibility={
        <ul style={list}>
          <li>The pair is a <code>role="group"</code> named by <code>label</code>; each half is its own tab stop.</li>
          <li>The chevron is named “More options” by default; pass <code>label</code> to say what it offers.</li>
          <li>As a menu trigger it gets <code>aria-haspopup</code> and <code>aria-expanded</code> from Dropdown Menu.</li>
        </ul>
      }
    />
  );
}

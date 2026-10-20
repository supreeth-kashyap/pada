import { useState } from 'react';
import DemoPage from '../DemoPage';
import { CodeSnippet } from '@pada/components/CodeSnippet/CodeSnippet';
import { ContextMenu } from '@pada/components/ContextMenu';

const list = { margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 } as const;

function FileCard() {
  const [starred, setStarred] = useState(false);
  const [view, setView] = useState('grid');
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger
        tabIndex={0}
        aria-label="Q3 report.pdf, press Shift+F10 for actions"
        style={{ display: 'grid', placeItems: 'center', width: 280, height: 160, border: '1px dashed var(--pada-color-border-strong)', color: 'var(--pada-color-fg-muted)' }}
      >
        Right-click (or long-press) this file
      </ContextMenu.Trigger>
      <ContextMenu.Content aria-label="File actions">
        <ContextMenu.Item icon="edit_1" shortcut="F2">Rename</ContextMenu.Item>
        <ContextMenu.Item icon="copy" shortcut="⌘D">Duplicate</ContextMenu.Item>
        <ContextMenu.CheckboxItem checked={starred} onCheckedChange={setStarred}>Starred</ContextMenu.CheckboxItem>
        <ContextMenu.Sub>
          <ContextMenu.SubTrigger icon="folder">Move to</ContextMenu.SubTrigger>
          <ContextMenu.SubContent>
            <ContextMenu.Item>Archive</ContextMenu.Item>
            <ContextMenu.Item>Shared with me</ContextMenu.Item>
          </ContextMenu.SubContent>
        </ContextMenu.Sub>
        <ContextMenu.Separator />
        <ContextMenu.Label>View</ContextMenu.Label>
        <ContextMenu.RadioGroup value={view} onValueChange={setView}>
          <ContextMenu.RadioItem value="grid">Grid</ContextMenu.RadioItem>
          <ContextMenu.RadioItem value="list">List</ContextMenu.RadioItem>
        </ContextMenu.RadioGroup>
        <ContextMenu.Separator />
        <ContextMenu.Item icon="delete" tone="danger" shortcut="⌫">Delete</ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
}

export default function ContextMenuDemo() {
  return (
    <DemoPage
      title="Context Menu"
      kind="Component"
      purpose={<p>ContextMenu offers actions for the thing under the pointer (a file, a row, a canvas object) on right-click, so frequent actions stay one gesture away without cluttering the interface. Always offer the same actions somewhere visible too (a toolbar or a DropdownMenu): many people never right-click.</p>}
      design={
        <>
          <p>It is a DropdownMenu that opens at the pointer: the same items, shortcuts, checkbox and radio items, and submenus, and the same scale-in motion. The area is outlined while its menu is open.</p>
          <div className="demo-page__showcase" style={{ minHeight: 360, alignItems: 'flex-start' }}>
            <FileCard />
          </div>
        </>
      }
      developer={
        <CodeSnippet
          code={`import { ContextMenu } from 'pada-ds';

<ContextMenu.Root>
  <ContextMenu.Trigger>
    <FileCard file={file} />
  </ContextMenu.Trigger>
  <ContextMenu.Content aria-label="File actions">
    <ContextMenu.Item icon="edit_1" shortcut="F2" onSelect={rename}>Rename</ContextMenu.Item>
    <ContextMenu.Separator />
    <ContextMenu.Item tone="danger" onSelect={remove}>Delete</ContextMenu.Item>
  </ContextMenu.Content>
</ContextMenu.Root>`}
          language="tsx"
          label="ContextMenu usage"
        />
      }
      accessibility={
        <ul style={list}>
          <li>Opens on right-click at the pointer, on <kbd>Shift</kbd>+<kbd>F10</kbd> or the context-menu key at the focused element, and on a long press with touch. Make the trigger focusable (or put focusable content in it) so keyboard users can reach it.</li>
          <li>The menu follows the WAI-ARIA menu pattern, like DropdownMenu: focus starts on the first item, arrow keys and type-ahead move, <kbd>Escape</kbd> closes and returns focus. Name the menu with <code>aria-label</code>.</li>
          <li>Pass <code>disabled</code> to the trigger to let the browser's own menu show (for text selection, for example).</li>
        </ul>
      }
    />
  );
}

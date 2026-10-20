import { useState } from 'react';
import DemoPage from '../DemoPage';
import { CodeSnippet } from '@pada/components/CodeSnippet/CodeSnippet';
import { Menubar } from '@pada/components/Menubar';
import { Toaster, toast } from '@pada/components/Toast';

const list = { margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 } as const;

export default function MenubarDemo() {
  const [wrap, setWrap] = useState(true);
  const [minimap, setMinimap] = useState(false);
  const [zoom, setZoom] = useState('100');
  return (
    <DemoPage
      title="Menubar"
      kind="Component"
      purpose={<p>Menubar is the row of menus at the top of a desktop-style application (File, Edit, View) that groups many commands without taking space. Use it in dense tools such as editors and admin consoles; most product screens are better served by visible buttons and a single overflow menu.</p>}
      design={
        <>
          <p>Compact triggers in a framed bar. Menus use the Dropdown Menu items, including shortcuts, checkbox and radio items and submenus. Once one menu is open, moving across the bar opens the others.</p>
          <div className="demo-page__showcase" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 12, minHeight: 220 }}>
            <Menubar.Root aria-label="Editor">
              <Menubar.Menu value="file">
                <Menubar.Trigger>File</Menubar.Trigger>
                <Menubar.Content>
                  <Menubar.Item icon="add" shortcut="⌘N" onSelect={() => toast('New file')}>
                    New file
                  </Menubar.Item>
                  <Menubar.Item icon="folder" shortcut="⌘O" onSelect={() => toast('Open…')}>
                    Open…
                  </Menubar.Item>
                  <Menubar.Sub>
                    <Menubar.SubTrigger icon="time_1">Open recent</Menubar.SubTrigger>
                    <Menubar.SubContent>
                      <Menubar.Item>roadmap.md</Menubar.Item>
                      <Menubar.Item>tokens.json</Menubar.Item>
                      <Menubar.Item>Button.tsx</Menubar.Item>
                    </Menubar.SubContent>
                  </Menubar.Sub>
                  <Menubar.Separator />
                  <Menubar.Item icon="save" shortcut="⌘S" onSelect={() => toast.success('Saved')}>
                    Save
                  </Menubar.Item>
                  <Menubar.Item disabled>Save as…</Menubar.Item>
                </Menubar.Content>
              </Menubar.Menu>
              <Menubar.Menu value="edit">
                <Menubar.Trigger>Edit</Menubar.Trigger>
                <Menubar.Content>
                  <Menubar.Item shortcut="⌘Z">Undo</Menubar.Item>
                  <Menubar.Item shortcut="⇧⌘Z">Redo</Menubar.Item>
                  <Menubar.Separator />
                  <Menubar.Item icon="copy" shortcut="⌘C">
                    Copy
                  </Menubar.Item>
                  <Menubar.Item shortcut="⌘V">Paste</Menubar.Item>
                  <Menubar.Separator />
                  <Menubar.Item icon="search" shortcut="⌘F">
                    Find…
                  </Menubar.Item>
                </Menubar.Content>
              </Menubar.Menu>
              <Menubar.Menu value="view">
                <Menubar.Trigger>View</Menubar.Trigger>
                <Menubar.Content>
                  <Menubar.CheckboxItem checked={wrap} onCheckedChange={setWrap}>
                    Word wrap
                  </Menubar.CheckboxItem>
                  <Menubar.CheckboxItem checked={minimap} onCheckedChange={setMinimap}>
                    Minimap
                  </Menubar.CheckboxItem>
                  <Menubar.Separator />
                  <Menubar.Label>Zoom</Menubar.Label>
                  <Menubar.RadioGroup value={zoom} onValueChange={setZoom}>
                    <Menubar.RadioItem value="90">90%</Menubar.RadioItem>
                    <Menubar.RadioItem value="100">100%</Menubar.RadioItem>
                    <Menubar.RadioItem value="125">125%</Menubar.RadioItem>
                  </Menubar.RadioGroup>
                </Menubar.Content>
              </Menubar.Menu>
              <Menubar.Menu value="help">
                <Menubar.Trigger>Help</Menubar.Trigger>
                <Menubar.Content>
                  <Menubar.Item icon="help">Documentation</Menubar.Item>
                  <Menubar.Item>Keyboard shortcuts</Menubar.Item>
                </Menubar.Content>
              </Menubar.Menu>
            </Menubar.Root>
          </div>
          <Toaster />
        </>
      }
      developer={
        <CodeSnippet
          code={`import { Menubar } from 'pada-ds';

<Menubar.Root aria-label="Editor">
  <Menubar.Menu value="file">
    <Menubar.Trigger>File</Menubar.Trigger>
    <Menubar.Content>
      <Menubar.Item shortcut="⌘N" onSelect={newFile}>New file</Menubar.Item>
      <Menubar.Sub>
        <Menubar.SubTrigger>Open recent</Menubar.SubTrigger>
        <Menubar.SubContent>…</Menubar.SubContent>
      </Menubar.Sub>
    </Menubar.Content>
  </Menubar.Menu>
  <Menubar.Menu value="view">
    <Menubar.Trigger>View</Menubar.Trigger>
    <Menubar.Content>
      <Menubar.CheckboxItem checked={wrap} onCheckedChange={setWrap}>Word wrap</Menubar.CheckboxItem>
    </Menubar.Content>
  </Menubar.Menu>
</Menubar.Root>`}
          language="tsx"
          label="Menubar usage"
        />
      }
      accessibility={
        <ul style={list}>
          <li>Follows the WAI-ARIA menubar pattern: a <code>menubar</code> of <code>menuitem</code> triggers with <code>aria-haspopup</code> and <code>aria-expanded</code>. Name it with <code>aria-label</code>.</li>
          <li>The bar is one Tab stop. ArrowLeft and ArrowRight move between triggers (wrapping), Home and End jump to the ends, and Enter, Space or ArrowDown opens a menu on its first item (ArrowUp on its last).</li>
          <li>Inside an open menu, ArrowRight and ArrowLeft open the neighbouring menu, unless they open or close a submenu. Escape closes the menu and returns focus to its trigger; Tab closes it.</li>
          <li>Shortcut hints are display only; register the real shortcuts separately.</li>
        </ul>
      }
    />
  );
}

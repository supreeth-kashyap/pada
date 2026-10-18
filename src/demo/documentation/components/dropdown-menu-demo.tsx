import { useState } from 'react';
import DemoPage from '../DemoPage';
import { CodeSnippet } from '../../../components/CodeSnippet/CodeSnippet';
import { DropdownMenu } from '../../../components/DropdownMenu';
import { Button } from '../../../components/Button';
import { IconButton } from '../../../components/IconButton';

const list = { margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 } as const;

export default function DropdownMenuDemo() {
  const [pinned, setPinned] = useState(true);
  const [notify, setNotify] = useState(false);
  const [sort, setSort] = useState('updated');
  return (
    <DemoPage
      title="Dropdown Menu"
      kind="Component"
      purpose={<p>Dropdown Menu lists actions or options behind a button: row actions in a table, an overflow “more” menu, a sort order. Use it for commands. To pick a value in a form, use Select; for navigation links, use a list of links.</p>}
      design={
        <>
          <p>Items take an icon, a shortcut hint and a danger tone. Checkbox and radio items keep state; submenus open to the side. The panel grows from its trigger and flips to stay on screen.</p>
          <div className="demo-page__showcase" style={{ flexDirection: 'row', gap: 12 }}>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <Button variant="secondary" rightIcon="chevron_down">
                  Project
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <DropdownMenu.Label>Website redesign</DropdownMenu.Label>
                <DropdownMenu.Item icon="edit_1" shortcut="⌘E">
                  Rename
                </DropdownMenu.Item>
                <DropdownMenu.Item icon="copy" shortcut="⌘D">
                  Duplicate
                </DropdownMenu.Item>
                <DropdownMenu.Item icon="share_1">Share…</DropdownMenu.Item>
                <DropdownMenu.Separator />
                <DropdownMenu.CheckboxItem checked={pinned} onCheckedChange={setPinned}>
                  Pinned
                </DropdownMenu.CheckboxItem>
                <DropdownMenu.CheckboxItem checked={notify} onCheckedChange={setNotify}>
                  Notify me of changes
                </DropdownMenu.CheckboxItem>
                <DropdownMenu.Sub>
                  <DropdownMenu.SubTrigger icon="folder">Move to</DropdownMenu.SubTrigger>
                  <DropdownMenu.SubContent>
                    <DropdownMenu.Item>Marketing</DropdownMenu.Item>
                    <DropdownMenu.Item>Engineering</DropdownMenu.Item>
                    <DropdownMenu.Item disabled>Finance (no access)</DropdownMenu.Item>
                  </DropdownMenu.SubContent>
                </DropdownMenu.Sub>
                <DropdownMenu.Separator />
                <DropdownMenu.Item icon="delete" tone="danger">
                  Delete
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>

            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <Button variant="ghost" leftIcon="sort_descending">
                  Sort
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content align="start">
                <DropdownMenu.RadioGroup value={sort} onValueChange={setSort}>
                  <DropdownMenu.RadioItem value="updated">Last updated</DropdownMenu.RadioItem>
                  <DropdownMenu.RadioItem value="created">Date created</DropdownMenu.RadioItem>
                  <DropdownMenu.RadioItem value="name">Name</DropdownMenu.RadioItem>
                </DropdownMenu.RadioGroup>
              </DropdownMenu.Content>
            </DropdownMenu.Root>

            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <IconButton icon="menu_vertical" label="More actions" variant="ghost" />
              </DropdownMenu.Trigger>
              <DropdownMenu.Content align="end">
                <DropdownMenu.Item icon="download_2">Export CSV</DropdownMenu.Item>
                <DropdownMenu.Item icon="report">Print</DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </div>
        </>
      }
      developer={
        <CodeSnippet
          code={`import { DropdownMenu, Button } from 'pada-ds';

<DropdownMenu.Root>
  <DropdownMenu.Trigger asChild>
    <Button variant="secondary" rightIcon="chevron_down">Project</Button>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content>
    <DropdownMenu.Item icon="edit_1" shortcut="⌘E" onSelect={rename}>Rename</DropdownMenu.Item>
    <DropdownMenu.CheckboxItem checked={pinned} onCheckedChange={setPinned}>Pinned</DropdownMenu.CheckboxItem>
    <DropdownMenu.Sub>
      <DropdownMenu.SubTrigger>Move to</DropdownMenu.SubTrigger>
      <DropdownMenu.SubContent>…</DropdownMenu.SubContent>
    </DropdownMenu.Sub>
    <DropdownMenu.Separator />
    <DropdownMenu.Item tone="danger" onSelect={remove}>Delete</DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>`}
          language="tsx"
          label="Dropdown menu usage"
        />
      }
      accessibility={
        <ul style={list}>
          <li>Follows the WAI-ARIA menu button pattern: the trigger has <code>aria-haspopup="menu"</code> and <code>aria-expanded</code>; items are <code>menuitem</code>, <code>menuitemcheckbox</code> or <code>menuitemradio</code>.</li>
          <li>Enter, Space or ArrowDown opens the menu on the first item, ArrowUp on the last. Arrow keys move, Home and End jump, typing a letter jumps to the matching item.</li>
          <li>ArrowRight opens a submenu and ArrowLeft closes it. Escape closes the menu and returns focus to the trigger.</li>
          <li>Shortcut hints are display only; wire the real shortcuts separately.</li>
        </ul>
      }
    />
  );
}

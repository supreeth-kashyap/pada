import { useState } from 'react';
import DemoPage from '../DemoPage';
import { CodeSnippet } from '../../../components/CodeSnippet/CodeSnippet';
import { CommandPalette, type Command } from '../../../components/CommandPalette';
import { Button } from '../../../components/Button';
import { Kbd } from '../../../components/Kbd';
import { Toaster, toast } from '../../../components/Toast';

const list = { margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 } as const;

const COMMANDS: Command[] = [
  { id: 'new-project', label: 'New project', group: 'Projects', icon: 'add', shortcut: ['⌘', 'N'], onSelect: () => toast('New project') },
  { id: 'open-recent', label: 'Open recent', group: 'Projects', icon: 'time_1', description: 'Website redesign, Q3 audit…', onSelect: () => toast('Open recent') },
  { id: 'invite', label: 'Invite people', group: 'Team', icon: 'user_add', keywords: ['share', 'member'], onSelect: () => toast('Invite people') },
  { id: 'settings', label: 'Preferences', group: 'App', icon: 'cog', keywords: ['settings', 'options'], shortcut: ['⌘', ','], onSelect: () => toast('Preferences') },
  { id: 'help', label: 'Keyboard shortcuts', group: 'App', icon: 'help', onSelect: () => toast('Keyboard shortcuts') },
  { id: 'billing', label: 'Billing', group: 'App', icon: 'lock', description: 'Only owners can change billing', disabled: true, onSelect: () => {} },
];

export default function CommandPaletteDemo() {
  const [open, setOpen] = useState(false);
  return (
    <DemoPage
      title="Command Palette"
      kind="Component"
      purpose={<p>Command Palette gives keyboard users one place to find and run any action: jump to a page, create something, change a setting. It complements the visible UI; every command should also be reachable another way.</p>}
      design={
        <>
          <p>A search field over grouped results. Matching is fuzzy and ranked, and keywords find commands by other names (“settings” finds Preferences).</p>
          <div className="demo-page__showcase" style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
            <Button variant="secondary" leftIcon="search" onClick={() => setOpen(true)}>
              Search commands
            </Button>
            <span>
              or press <Kbd keys={['⌘', 'K']} /> / <Kbd keys={['Ctrl', 'K']} />
            </span>
          </div>
          <CommandPalette open={open} onOpenChange={setOpen} commands={COMMANDS} />
          <Toaster />
        </>
      }
      developer={
        <CodeSnippet
          code={`import { CommandPalette, type Command } from 'pada-ds';

const commands: Command[] = [
  { id: 'new', label: 'New project', group: 'Projects', icon: 'add', shortcut: ['⌘', 'N'], onSelect: create },
  { id: 'prefs', label: 'Preferences', group: 'App', keywords: ['settings'], onSelect: openPrefs },
];

// ⌘K / Ctrl+K toggles it; control it yourself with open/onOpenChange
<CommandPalette commands={commands} open={open} onOpenChange={setOpen} />`}
          language="tsx"
          label="Command palette usage"
        />
      }
      accessibility={
        <ul style={list}>
          <li>A modal dialog containing a combobox and a listbox. Focus stays in the search field; ArrowUp and ArrowDown move the active option (<code>aria-activedescendant</code>), Enter runs it.</li>
          <li>Disabled commands stay visible (<code>aria-disabled</code>) and are skipped by the arrow keys.</li>
          <li>Escape closes it and focus returns to where it was. Choose a hotkey that doesn’t clash with screen reader or browser shortcuts.</li>
        </ul>
      }
    />
  );
}

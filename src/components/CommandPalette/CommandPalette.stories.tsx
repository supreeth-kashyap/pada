import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Button } from '../Button';
import { Kbd } from '../Kbd';
import { CommandPalette, type Command } from './CommandPalette';

const commands: Command[] = [
  { id: 'new', label: 'New project', group: 'Projects', icon: 'add', shortcut: ['⌘', 'N'], onSelect: fn() },
  { id: 'open', label: 'Open project…', group: 'Projects', icon: 'folder', shortcut: ['⌘', 'O'], onSelect: fn() },
  { id: 'invite', label: 'Invite teammates', group: 'Team', icon: 'user_default', onSelect: fn() },
  { id: 'prefs', label: 'Preferences', group: 'App', keywords: ['cog'], icon: 'cog', onSelect: fn() },
  { id: 'theme', label: 'Toggle dark mode', group: 'App', description: 'Switch between light and dark', onSelect: fn() },
];

const meta = {
  title: 'Components/CommandPalette',
  component: CommandPalette,
  tags: ['autodocs'],
  args: { commands, placeholder: 'Type a command or search…' },
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <div style={{ display: 'grid', gap: 8, justifyItems: 'center' }}>
        <Button variant="secondary" onClick={() => setOpen(true)}>Open command palette</Button>
        <span style={{ color: 'var(--color-fg-muted)', fontSize: 13 }}>
          or press <Kbd keys={['⌘', 'K']} />
        </span>
        <CommandPalette {...args} open={open} onOpenChange={setOpen} />
      </div>
    );
  },
} satisfies Meta<typeof CommandPalette>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

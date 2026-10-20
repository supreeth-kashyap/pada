import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Menubar } from '.';

const meta = {
  title: 'Components/Menubar',
  component: Menubar.Root,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Menubar.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [wrap, setWrap] = useState(true);
    const [minimap, setMinimap] = useState(false);
    return (
      <Menubar.Root aria-label="Editor">
        <Menubar.Menu value="file">
          <Menubar.Trigger>File</Menubar.Trigger>
          <Menubar.Content>
            <Menubar.Item shortcut="⌘N" onSelect={fn()}>New file</Menubar.Item>
            <Menubar.Item shortcut="⌘O" onSelect={fn()}>Open…</Menubar.Item>
            <Menubar.Sub>
              <Menubar.SubTrigger>Open recent</Menubar.SubTrigger>
              <Menubar.SubContent>
                <Menubar.Item onSelect={fn()}>tokens.json</Menubar.Item>
                <Menubar.Item onSelect={fn()}>Button.tsx</Menubar.Item>
              </Menubar.SubContent>
            </Menubar.Sub>
            <Menubar.Separator />
            <Menubar.Item onSelect={fn()}>Close</Menubar.Item>
          </Menubar.Content>
        </Menubar.Menu>
        <Menubar.Menu value="edit">
          <Menubar.Trigger>Edit</Menubar.Trigger>
          <Menubar.Content>
            <Menubar.Item shortcut="⌘Z" onSelect={fn()}>Undo</Menubar.Item>
            <Menubar.Item shortcut="⇧⌘Z" onSelect={fn()}>Redo</Menubar.Item>
          </Menubar.Content>
        </Menubar.Menu>
        <Menubar.Menu value="view">
          <Menubar.Trigger>View</Menubar.Trigger>
          <Menubar.Content>
            <Menubar.CheckboxItem checked={wrap} onCheckedChange={setWrap}>Word wrap</Menubar.CheckboxItem>
            <Menubar.CheckboxItem checked={minimap} onCheckedChange={setMinimap}>Minimap</Menubar.CheckboxItem>
          </Menubar.Content>
        </Menubar.Menu>
      </Menubar.Root>
    );
  },
};

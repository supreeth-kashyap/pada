import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Button } from '../Button';
import { DropdownMenu } from '.';

const meta = {
  title: 'Components/DropdownMenu',
  component: DropdownMenu.Content,
  tags: ['autodocs'],
} satisfies Meta<typeof DropdownMenu.Content>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [pinned, setPinned] = useState(true);
    const [sort, setSort] = useState('updated');
    return (
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <Button variant="secondary" rightIcon="chevron_down">Project</Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item icon="edit_1" shortcut="⌘E" onSelect={fn()}>Rename</DropdownMenu.Item>
          <DropdownMenu.Item icon="copy" shortcut="⌘D" onSelect={fn()}>Duplicate</DropdownMenu.Item>
          <DropdownMenu.CheckboxItem checked={pinned} onCheckedChange={setPinned}>Pinned</DropdownMenu.CheckboxItem>
          <DropdownMenu.Separator />
          <DropdownMenu.Label>Sort by</DropdownMenu.Label>
          <DropdownMenu.RadioGroup value={sort} onValueChange={setSort}>
            <DropdownMenu.RadioItem value="updated">Last updated</DropdownMenu.RadioItem>
            <DropdownMenu.RadioItem value="name">Name</DropdownMenu.RadioItem>
          </DropdownMenu.RadioGroup>
          <DropdownMenu.Separator />
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger icon="folder">Move to</DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
              <DropdownMenu.Item onSelect={fn()}>Marketing</DropdownMenu.Item>
              <DropdownMenu.Item onSelect={fn()}>Engineering</DropdownMenu.Item>
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>
          <DropdownMenu.Separator />
          <DropdownMenu.Item tone="danger" icon="delete" onSelect={fn()}>Delete</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    );
  },
};

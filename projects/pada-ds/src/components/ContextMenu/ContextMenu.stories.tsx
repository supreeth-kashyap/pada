import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Placeholder } from '../../stories/Placeholder';
import { ContextMenu } from '.';

const meta = {
  title: 'Overlays/ContextMenu',
  component: ContextMenu.Root,
  tags: ['autodocs'],
} satisfies Meta<typeof ContextMenu.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ContextMenu.Root>
      <ContextMenu.Trigger>
        <Placeholder style={{ width: 320, height: 160 }}>Right-click here (or Shift+F10)</Placeholder>
      </ContextMenu.Trigger>
      <ContextMenu.Content aria-label="File actions">
        <ContextMenu.Item icon="edit_1" shortcut="F2" onSelect={fn()}>Rename</ContextMenu.Item>
        <ContextMenu.Item icon="copy" shortcut="⌘D" onSelect={fn()}>Duplicate</ContextMenu.Item>
        <ContextMenu.Separator />
        <ContextMenu.Item tone="danger" icon="delete" onSelect={fn()}>Delete</ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  ),
};

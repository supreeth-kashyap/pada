import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar, AvatarGroup } from './Avatar';

const meta = {
  title: 'Display/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  args: { name: 'Grace Hopper' },
  argTypes: {
    size: { control: 'inline-radio', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    shape: { control: 'inline-radio', options: ['circle', 'square'] },
    status: { control: 'select', options: [undefined, 'online', 'away', 'busy', 'offline'] },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Initials: Story = {};
export const WithStatus: Story = { args: { status: 'online' } };
export const Square: Story = { args: { name: 'Acme Inc', shape: 'square' } };

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <Avatar key={size} {...args} size={size} />
      ))}
    </div>
  ),
};

export const Statuses: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12 }}>
      {(['online', 'away', 'busy', 'offline'] as const).map((status) => (
        <Avatar key={status} {...args} status={status} />
      ))}
    </div>
  ),
};

export const Group: Story = {
  render: () => (
    <AvatarGroup label="Project members" max={4}>
      {['Ada Lovelace', 'Grace Hopper', 'Alan Turing', 'Katherine Johnson', 'Linus Torvalds', 'Margaret Hamilton'].map(
        (name) => <Avatar key={name} name={name} />,
      )}
    </AvatarGroup>
  ),
};

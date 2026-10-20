import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Avatar } from '../Avatar';
import { PageHeader } from './PageHeader';

const meta = {
  title: 'Components/PageHeader',
  component: PageHeader,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: {
    breadcrumbs: [{ label: 'Workspace', href: '#' }, { label: 'Projects', href: '#' }, { label: 'Website redesign' }],
    commandLabel: 'Search',
    commandShortcut: '⌘K',
    onCommandClick: fn(),
  },
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithAiAndProfile: Story = {
  args: { onAiClick: fn(), aiLabel: 'Ask AI', profileTrigger: <Avatar name="Grace Hopper" size="sm" /> },
};

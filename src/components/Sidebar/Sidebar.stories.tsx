import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Badge } from '../Badge';
import { Icon } from '../Icon';
import { Sidebar } from './Sidebar';

const meta = {
  title: 'Components/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: {
    activeId: 'projects',
    onItemClick: fn(),
    data: {
      title: 'Acme',
      sections: [
        {
          id: 'main',
          items: [
            { id: 'home', label: 'Home', icon: <Icon name="dashboard" size={16} /> },
            { id: 'projects', label: 'Projects', icon: <Icon name="folder" size={16} />, trailing: <Badge size="sm">12</Badge> },
            { id: 'reports', label: 'Reports', icon: <Icon name="reports" size={16} /> },
            { id: 'inbox', label: 'Inbox', icon: <Icon name="mail" size={16} /> },
          ],
        },
        {
          id: 'workspace',
          label: 'Workspace',
          items: [
            { id: 'team', label: 'Team', icon: <Icon name="team" size={16} /> },
            { id: 'cog', label: 'Settings', icon: <Icon name="cog" size={16} /> },
            { id: 'billing', label: 'Billing', icon: <Icon name="document" size={16} />, disabled: true },
          ],
        },
      ],
    },
  },
  decorators: [(Story) => <div style={{ height: '100vh', display: 'flex' }}><Story /></div>],
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

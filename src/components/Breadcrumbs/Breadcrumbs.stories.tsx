import type { Meta, StoryObj } from '@storybook/react-vite';
import { Breadcrumbs } from './Breadcrumbs';

const meta = {
  title: 'Components/Breadcrumbs',
  component: Breadcrumbs,
  tags: ['autodocs'],
  args: {
    items: [
      { label: 'Projects', href: '#projects' },
      { label: 'Website redesign', href: '#project' },
      { label: 'Settings' },
    ],
  },
} satisfies Meta<typeof Breadcrumbs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Collapsed: Story = {
  args: {
    maxItems: 3,
    items: [
      { label: 'Home', href: '#' },
      { label: 'Workspace', href: '#' },
      { label: 'Projects', href: '#' },
      { label: 'Website redesign', href: '#' },
      { label: 'Settings' },
    ],
  },
};

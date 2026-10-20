import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Button } from '../Button';
import { SearchField } from '../SearchField';
import { Toolbar } from './Toolbar';

const meta = {
  title: 'Navigation/Toolbar',
  component: Toolbar,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Toolbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Structured: Story = {
  args: {
    left: <SearchField placeholder="Search records" />,
    actions: [
      { id: 'export', children: 'Export', leftIcon: 'download_2', onClick: fn() },
      { id: 'share', children: 'Share', leftIcon: 'share_1', onClick: fn() },
    ],
    primaryAction: { id: 'new', children: 'New record', leftIcon: 'add', variant: 'primary', onClick: fn() },
  },
};

export const Children: Story = {
  args: {
    children: (
      <>
        <Button>New record</Button>
        <Button variant="ghost">Filter</Button>
      </>
    ),
  },
};

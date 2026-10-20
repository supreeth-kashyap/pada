import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button';
import { Switch } from '../Switch';
import { SideDrawer } from './SideDrawer';

const meta = {
  title: 'Legacy/SideDrawer',
  component: SideDrawer,
  tags: ['autodocs'],
  args: {
    open: false,
    onOpenChange: () => {},
    size: 'md',
    'aria-label': 'Settings',
    children: (
      <div style={{ display: 'grid', gap: 16, padding: 24 }}>
        <h2 style={{ margin: 0 }}>Settings</h2>
        <Switch label="Email notifications" defaultChecked />
        <Switch label="Weekly digest" />
      </div>
    ),
  },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg', 'xl'] } },
  render: (args) => {
    const [open, setOpen] = useState(args.open);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Settings</Button>
        <SideDrawer {...args} open={open} onOpenChange={setOpen} />
      </>
    );
  },
} satisfies Meta<typeof SideDrawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Large: Story = { args: { size: 'lg' } };

import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { Notification } from './Notification';

const meta = {
  title: 'Legacy/Notification',
  component: Notification,
  tags: ['autodocs'],
  args: { open: true, onOpenChange: () => {}, title: 'Saved', subtitle: 'Your changes are live.' },
  render: (args) => {
    const [open, setOpen] = useState(args.open);
    return (
      <>
        <Button variant="secondary" onClick={() => setOpen(true)}>Show notification</Button>
        <Notification {...args} open={open} onOpenChange={setOpen} />
      </>
    );
  },
} satisfies Meta<typeof Notification>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithVisual: Story = { args: { visual: <Icon name="tick_2" />, title: 'Invite sent', subtitle: 'Grace will get an email shortly.' } };

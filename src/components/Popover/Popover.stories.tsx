import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button';
import { Popover } from './Popover';

const meta = {
  title: 'Components/Popover',
  component: Popover,
  tags: ['autodocs'],
  args: {
    open: false,
    onOpenChange: () => {},
    title: 'Quick tip',
    position: 'bottom',
    showClose: true,
    children: 'This field accepts an email or a username.',
  },
  argTypes: {
    position: { control: 'inline-radio', options: ['top', 'bottom', 'left', 'right', 'auto'] },
    variant: { control: 'inline-radio', options: ['default', 'active'] },
  },
  decorators: [(Story) => <div style={{ padding: 120 }}><Story /></div>],
  render: (args) => {
    const [open, setOpen] = useState(args.open);
    return <Popover {...args} open={open} onOpenChange={setOpen} trigger={<Button variant="secondary">Show tip</Button>} />;
  },
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Top: Story = { args: { position: 'top' } };
export const Active: Story = { args: { variant: 'active' } };

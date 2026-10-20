import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button';
import { Modal } from './Modal';

const meta = {
  title: 'Components/Modal',
  component: Modal,
  tags: ['autodocs'],
  args: { open: false, onOpenChange: () => {}, title: 'Delete record?', children: 'This cannot be undone.' },
  render: (args) => {
    const [open, setOpen] = useState(args.open);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open modal</Button>
        <Modal {...args} open={open} onOpenChange={setOpen} />
      </>
    );
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Sized: Story = { args: { title: 'Release notes', width: 640, children: 'Pada 1.1 adds DataTable, Resizable, Sheet, Menubar and ColorPicker.' } };

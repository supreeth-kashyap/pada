import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Button } from '../Button';
import { Toaster, toast } from '.';

const meta = {
  title: 'Components/Toast',
  component: Toaster,
  tags: ['autodocs'],
  args: { position: 'bottom-right' },
  argTypes: {
    position: {
      control: 'select',
      options: ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'],
    },
  },
  render: (args) => (
    <>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Button variant="secondary" onClick={() => toast('Link copied')}>Default</Button>
        <Button variant="secondary" onClick={() => toast.success({ title: 'Invite sent', description: 'ada@example.com', action: { label: 'Undo', onClick: fn() } })}>
          Success with action
        </Button>
        <Button variant="secondary" onClick={() => toast.info({ title: 'Syncing', description: 'This may take a minute.' })}>Info</Button>
        <Button variant="secondary" onClick={() => toast.warning({ title: 'Storage almost full' })}>Warning</Button>
        <Button variant="secondary" onClick={() => toast.danger({ title: 'Upload failed', description: 'Check your connection.' })}>Danger</Button>
      </div>
      <Toaster {...args} />
    </>
  ),
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const TopCenter: Story = { args: { position: 'top-center' } };

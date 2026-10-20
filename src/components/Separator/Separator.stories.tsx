import type { Meta, StoryObj } from '@storybook/react-vite';
import { Separator } from './Separator';

const meta = {
  title: 'Components/Separator',
  component: Separator,
  tags: ['autodocs'],
  argTypes: { orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] } },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: (args) => (
    <div style={{ width: 320 }}>
      <p style={{ margin: '0 0 12px' }}>Account</p>
      <Separator {...args} />
      <p style={{ margin: '12px 0 0' }}>Billing</p>
    </div>
  ),
};

export const Vertical: Story = {
  args: { orientation: 'vertical' },
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, height: 24 }}>
      <span>Docs</span>
      <Separator {...args} />
      <span>Changelog</span>
      <Separator {...args} />
      <span>Support</span>
    </div>
  ),
};

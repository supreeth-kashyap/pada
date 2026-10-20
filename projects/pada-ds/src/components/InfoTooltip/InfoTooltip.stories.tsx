import type { Meta, StoryObj } from '@storybook/react-vite';
import { InfoTooltip } from './InfoTooltip';

const meta = {
  title: 'Display/InfoTooltip',
  component: InfoTooltip,
  tags: ['autodocs'],
  argTypes: { position: { control: 'inline-radio', options: ['top', 'bottom', 'left', 'right'] } },
  args: { label: 'Seats', text: 'Seats are billed monthly, per active member.', position: 'top' },
  render: (args) => (
    <span style={{ display: 'inline-flex', gap: 4, alignItems: 'center' }}>
      Seats <InfoTooltip {...args} />
    </span>
  ),
} satisfies Meta<typeof InfoTooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Bottom: Story = { args: { position: 'bottom' } };

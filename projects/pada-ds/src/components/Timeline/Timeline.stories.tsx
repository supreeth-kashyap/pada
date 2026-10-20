import type { Meta, StoryObj } from '@storybook/react-vite';
import { Timeline } from './Timeline';

const meta = {
  title: 'Data/Timeline',
  component: Timeline,
  tags: ['autodocs'],
  args: {
    'aria-label': 'Order history',
    items: [
      { id: '1', title: 'Order placed', time: new Date(2026, 9, 18, 9, 12), tone: 'accent' },
      { id: '2', title: 'Payment confirmed', time: new Date(2026, 9, 18, 9, 14), tone: 'success' },
      { id: '3', title: 'Shipped', time: new Date(2026, 9, 19, 16, 40), description: 'Tracking number 1Z999AA10123456784' },
      { id: '4', title: 'Out for delivery', pending: true },
    ],
  },
  argTypes: { density: { control: 'inline-radio', options: ['compact', 'comfortable'] } },
  decorators: [(Story) => <div style={{ width: 400 }}><Story /></div>],
} satisfies Meta<typeof Timeline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Compact: Story = { args: { density: 'compact' } };
export const Composed: Story = {
  render: () => (
    <Timeline aria-label="Activity" density="compact">
      <Timeline.Item title="Ada merged #482" time={new Date(2026, 9, 20, 10, 5)} tone="success" icon="tick_1" />
      <Timeline.Item title="Build failed" time={new Date(2026, 9, 20, 9, 41)} tone="danger" icon="alert_2">
        2 visual tests changed.
      </Timeline.Item>
      <Timeline.Item title="Grace requested review" time={new Date(2026, 9, 20, 9, 2)} tone="warning" />
    </Timeline>
  ),
};

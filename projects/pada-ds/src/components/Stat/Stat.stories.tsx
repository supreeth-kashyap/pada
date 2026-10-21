import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stat } from './Stat';

const meta = {
  title: 'Display/Stat',
  component: Stat,
  tags: ['autodocs'],
  args: {
    label: 'Revenue',
    value: 1284000,
    formatOptions: { style: 'currency', currency: 'USD', notation: 'compact' },
    delta: 0.124,
    deltaFormatOptions: { style: 'percent', maximumFractionDigits: 1 },
    deltaLabel: 'vs last month',
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    trend: { control: 'inline-radio', options: [undefined, 'up', 'down', 'neutral'] },
  },
} satisfies Meta<typeof Stat>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const LowerIsBetter: Story = {
  args: {
    label: 'p95 latency',
    value: 182,
    formatOptions: { style: 'unit', unit: 'millisecond' },
    delta: -24,
    deltaFormatOptions: undefined,
    deltaLabel: 'ms vs last week',
    invertTrend: true,
  },
};
export const WithDescription: Story = { args: { description: 'Recognised revenue, excluding refunds.', size: 'lg' } };
export const Row: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 200px)', gap: 24 }}>
      <Stat label="Active users" value={18432} delta={0.08} deltaFormatOptions={{ style: 'percent' }} />
      <Stat label="Churn" value={0.021} formatOptions={{ style: 'percent', maximumFractionDigits: 1 }} delta={0.004} deltaFormatOptions={{ style: 'percent', maximumFractionDigits: 1 }} invertTrend />
      <Stat label="Open tickets" value={37} delta={0} />
    </div>
  ),
};

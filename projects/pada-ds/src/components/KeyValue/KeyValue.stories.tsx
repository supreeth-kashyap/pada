import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from '../Badge';
import { KeyValue } from './KeyValue';

const meta = {
  title: 'Components/KeyValue',
  component: KeyValue,
  tags: ['autodocs'],
  args: { label: 'Owner', children: 'Grace Hopper' },
} satisfies Meta<typeof KeyValue>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithInfoTooltip: Story = { args: { label: 'Retention', children: '90 days', infoTooltip: 'Logs older than this are deleted.' } };
export const RecordSummary: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12, width: 320 }}>
      <KeyValue label="Status"><Badge tone="success">Active</Badge></KeyValue>
      <KeyValue label="Owner">Grace Hopper</KeyValue>
      <KeyValue label="Created">20 Oct 2026</KeyValue>
    </div>
  ),
};

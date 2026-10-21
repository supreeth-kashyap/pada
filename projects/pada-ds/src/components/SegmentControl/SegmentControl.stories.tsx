import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { SegmentControl } from './SegmentControl';

const meta = {
  title: 'Forms/SegmentControl',
  component: SegmentControl,
  tags: ['autodocs'],
  args: {
    defaultValue: 'week',
    onChange: fn(),
    options: [
      { value: 'day', label: 'Day' },
      { value: 'week', label: 'Week' },
      { value: 'month', label: 'Month' },
    ],
  },
} satisfies Meta<typeof SegmentControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithIcons: Story = {
  args: {
    defaultValue: 'list',
    options: [
      { value: 'list', label: 'List', icon: 'menu_2' },
      { value: 'board', label: 'Board', icon: 'dashboard' },
      { value: 'timeline', label: 'Timeline', icon: 'time_1', disabled: true },
    ],
  },
};
export const Disabled: Story = { args: { disabled: true } };

import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProgressCircle } from './ProgressCircle';

const meta = {
  title: 'Feedback/ProgressCircle',
  component: ProgressCircle,
  tags: ['autodocs'],
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
  args: { label: 'Uploading report.pdf', value: 64, max: 100, size: 'md', showValue: false },
} satisfies Meta<typeof ProgressCircle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Indeterminate: Story = { args: { label: 'Syncing', value: null, size: 'sm' } };
export const WithValue: Story = { args: { label: 'Storage used', value: 72, size: 'lg', showValue: true } };
export const Complete: Story = { args: { label: 'Uploaded', value: 100 } };

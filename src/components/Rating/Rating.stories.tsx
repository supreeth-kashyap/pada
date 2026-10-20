import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Rating } from './Rating';

const meta = {
  title: 'Components/Rating',
  component: Rating,
  tags: ['autodocs'],
  args: { label: 'Your rating', name: 'rating', defaultValue: 3, onValueChange: fn() },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
} satisfies Meta<typeof Rating>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const ReadOnly: Story = { args: { label: 'Average', value: 4.3, readOnly: true, showLabel: true } };
export const Clearable: Story = { args: { allowClear: true } };
export const Large: Story = { args: { size: 'lg' } };
export const Disabled: Story = { args: { disabled: true } };

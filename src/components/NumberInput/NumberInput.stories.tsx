import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { NumberInput } from './NumberInput';

const meta = {
  title: 'Components/NumberInput',
  component: NumberInput,
  tags: ['autodocs'],
  args: { label: 'Quantity', defaultValue: 1, min: 0, onValueChange: fn() },
  argTypes: {
    stepper: { control: 'inline-radio', options: ['stacked', 'split', 'none'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  decorators: [(Story) => <div style={{ width: 260 }}><Story /></div>],
} satisfies Meta<typeof NumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Split: Story = { args: { stepper: 'split' } };
export const Currency: Story = {
  args: { label: 'Budget', defaultValue: 1500, step: 50, largeStep: 500, formatOptions: { style: 'currency', currency: 'USD' } },
};
export const WithError: Story = { args: { error: 'Must be at least 1.', defaultValue: 0 } };

import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { InputDate } from './InputDate';

const meta = {
  title: 'Components/InputDate',
  component: InputDate,
  tags: ['autodocs'],
  args: { label: 'Date of birth', onChange: fn() },
  argTypes: {
    mode: { control: 'inline-radio', options: ['date', 'month', 'year'] },
    selection: { control: 'inline-radio', options: ['single', 'range'] },
  },
  decorators: [(Story) => <div style={{ width: 320, minHeight: 420 }}><Story /></div>],
} satisfies Meta<typeof InputDate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithValue: Story = { args: { value: new Date(1990, 4, 17) } };
export const Range: Story = { args: { label: 'Trip dates', selection: 'range' } };
export const WithError: Story = { args: { required: true, error: 'Pick a date.' } };
export const Disabled: Story = { args: { disabled: true } };

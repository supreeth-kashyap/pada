import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { DatePickerDropdown } from './DatePickerDropdown';

const meta = {
  title: 'Dates/DatePicker',
  component: DatePickerDropdown,
  tags: ['autodocs'],
  args: { onChange: fn() },
  argTypes: {
    mode: { control: 'inline-radio', options: ['date', 'month', 'year'] },
    selection: { control: 'inline-radio', options: ['single', 'range'] },
  },
} satisfies Meta<typeof DatePickerDropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = { args: { value: new Date(2026, 9, 20) } };
export const Range: Story = { args: { selection: 'range', value: [new Date(2026, 9, 12), new Date(2026, 9, 18)] } };
export const Month: Story = { args: { mode: 'month' } };
export const Year: Story = { args: { mode: 'year' } };

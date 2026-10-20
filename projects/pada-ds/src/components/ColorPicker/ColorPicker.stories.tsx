import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ColorPicker } from './ColorPicker';

const meta = {
  title: 'Forms/ColorPicker',
  component: ColorPicker,
  tags: ['autodocs'],
  args: { label: 'Label colour', defaultValue: '#4f46e5', onValueChange: fn() },
  argTypes: { format: { control: 'inline-radio', options: ['hex', 'oklch'] } },
} satisfies Meta<typeof ColorPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithSwatches: Story = {
  args: {
    swatches: [
      { value: '#4f46e5', label: 'Indigo' },
      { value: '#db2777', label: 'Pink' },
      { value: '#059669', label: 'Emerald' },
      { value: '#d97706', label: 'Amber' },
    ],
  },
};
export const Oklch: Story = { args: { label: 'Accent', format: 'oklch', defaultValue: 'oklch(62.8% 0.258 29.2)' } };
export const Disabled: Story = { args: { disabled: true } };

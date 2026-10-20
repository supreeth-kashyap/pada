import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { RangeSlider } from './RangeSlider';

const meta = {
  title: 'Components/RangeSlider',
  component: RangeSlider,
  tags: ['autodocs'],
  args: {
    label: 'Price',
    defaultValue: [200, 650],
    min: 0,
    max: 1000,
    step: 10,
    formatOptions: { style: 'currency', currency: 'USD', maximumFractionDigits: 0 },
    onValueChange: fn(),
    onValueCommit: fn(),
  },
  decorators: [(Story) => <div style={{ width: 360 }}><Story /></div>],
} satisfies Meta<typeof RangeSlider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithDescription: Story = { args: { description: 'Nightly rate before taxes.' } };
export const Disabled: Story = { args: { disabled: true } };

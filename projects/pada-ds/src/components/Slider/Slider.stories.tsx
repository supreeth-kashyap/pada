import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Slider } from './Slider';

const meta = {
  title: 'Components/Slider',
  component: Slider,
  tags: ['autodocs'],
  args: { label: 'Volume', min: 0, max: 100, defaultValue: 50, onValueChange: fn() },
  decorators: [(Story) => <div style={{ width: 320 }}><Story /></div>],
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithValue: Story = { args: { showValue: true } };
export const Stepped: Story = { args: { label: 'Rating', min: 1, max: 5, step: 1, defaultValue: 3, showValue: true } };
export const WithDescription: Story = { args: { description: 'Applies to all notifications.' } };
export const WithError: Story = { args: { error: 'Volume must be above 10.', defaultValue: 4 } };
export const Disabled: Story = { args: { disabled: true } };

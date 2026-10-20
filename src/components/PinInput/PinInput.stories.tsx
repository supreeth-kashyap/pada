import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { PinInput } from './PinInput';

const meta = {
  title: 'Components/PinInput',
  component: PinInput,
  tags: ['autodocs'],
  args: { label: 'Verification code', length: 6, name: 'code', onComplete: fn() },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
} satisfies Meta<typeof PinInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Grouped: Story = { args: { groupSize: 3 } };
export const Masked: Story = { args: { label: 'PIN', length: 4, mask: true } };
export const WithError: Story = { args: { error: 'That code has expired.' } };

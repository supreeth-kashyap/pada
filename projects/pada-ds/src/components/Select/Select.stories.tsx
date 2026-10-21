import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Select } from './Select';

const meta = {
  title: 'Forms/Select',
  component: Select,
  tags: ['autodocs'],
  args: {
    label: 'Plan',
    placeholder: 'Choose a plan',
    onChange: fn(),
    options: [
      { value: 'free', label: 'Free' },
      { value: 'pro', label: 'Pro' },
      { value: 'team', label: 'Team' },
      { value: 'enterprise', label: 'Enterprise', disabled: true },
    ],
  },
  decorators: [(Story) => <div style={{ width: 280, minHeight: 260 }}><Story /></div>],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithValue: Story = { args: { defaultValue: 'pro' } };
export const WithDescription: Story = { args: { description: 'You can change plans at any time.' } };
export const WithError: Story = { args: { error: 'Choose a plan to continue.' } };
export const Disabled: Story = { args: { disabled: true, defaultValue: 'team' } };

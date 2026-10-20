import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Pills } from './Pills';

const meta = {
  title: 'Components/Pills',
  component: Pills,
  tags: ['autodocs'],
  args: {
    defaultValue: 'all',
    onChange: fn(),
    options: [
      { value: 'all', label: 'All' },
      { value: 'mine', label: 'Mine' },
      { value: 'shared', label: 'Shared' },
      { value: 'archived', label: 'Archived', disabled: true },
    ],
  },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
} satisfies Meta<typeof Pills>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Small: Story = { args: { size: 'sm' } };
export const Disabled: Story = { args: { disabled: true } };

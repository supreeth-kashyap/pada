import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { IconButton } from './IconButton';

const meta = {
  title: 'Components/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  args: { icon: 'edit_1', label: 'Edit', onClick: fn() },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'ghost', 'destructive'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ghost: Story = {};
export const WithTooltip: Story = { args: { tooltip: true } };
export const Destructive: Story = { args: { icon: 'delete', label: 'Delete project', variant: 'destructive' } };

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 8 }}>
      {(['primary', 'secondary', 'ghost', 'destructive'] as const).map((variant) => (
        <IconButton key={variant} {...args} variant={variant} label={`${variant} edit`} />
      ))}
    </div>
  ),
};

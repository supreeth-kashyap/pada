import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon, iconNames } from '.';

const meta = {
  title: 'Display/Icon',
  component: Icon,
  tags: ['autodocs'],
  args: { name: 'star', size: 24 },
  argTypes: {
    name: { control: 'select', options: iconNames },
    variant: { control: 'inline-radio', options: ['stroke', 'fill'] },
    color: { control: 'color' },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Filled: Story = { args: { variant: 'fill', color: 'var(--color-accent-600)' } };

export const AllIcons: Story = {
  parameters: { layout: 'padded' },
  render: (args) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(112px, 1fr))', gap: 8 }}>
      {iconNames.map((name) => (
        <div key={name} style={{ display: 'grid', justifyItems: 'center', gap: 6, padding: 8, fontSize: 11, color: 'var(--color-fg-muted)' }}>
          <Icon {...args} name={name} />
          {name}
        </div>
      ))}
    </div>
  ),
};

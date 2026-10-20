import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tags } from './Tags';

const VARIANTS = ['neutral', 'primary', 'secondary', 'success', 'danger', 'royal'] as const;

const meta = {
  title: 'Components/Tags',
  component: Tags,
  tags: ['autodocs'],
  args: { children: 'Active', variant: 'success' },
  argTypes: { variant: { control: 'select', options: VARIANTS } },
} satisfies Meta<typeof Tags>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithIcon: Story = { args: { variant: 'primary', icon: 'info', children: 'Heads up' } };
export const Variants: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {VARIANTS.map((variant) => <Tags key={variant} {...args} variant={variant}>{variant}</Tags>)}
    </div>
  ),
};

import type { Meta, StoryObj } from '@storybook/react-vite';
import { Text, TextFamily, TextSize, TextWeight } from '.';

const meta = {
  title: 'Display/Text',
  component: Text,
  tags: ['autodocs'],
  args: { children: 'The quick brown fox jumps over the lazy dog', size: 'base' },
  argTypes: {
    size: { control: 'select', options: Object.values(TextSize) },
    weight: { control: 'select', options: Object.values(TextWeight) },
    family: { control: 'inline-radio', options: Object.values(TextFamily) },
    as: { control: 'select', options: ['span', 'p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'] },
    color: { control: 'color' },
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Heading: Story = { args: { as: 'h1', size: '2xl', weight: '700', children: 'Welcome' } };
export const Mono: Story = { args: { family: 'mono', size: 'sm', children: 'npm install pada-ds' } };
export const Scale: Story = {
  parameters: { layout: 'padded' },
  render: (args) => (
    <div style={{ display: 'grid', gap: 8 }}>
      {Object.values(TextSize).map((size) => (
        <Text key={size} {...args} size={size}>
          {size} — Pada
        </Text>
      ))}
    </div>
  ),
};

import type { Meta, StoryObj } from '@storybook/react-vite';
import { Heading } from './Heading';

const meta = {
  title: 'Display/Heading',
  component: Heading,
  tags: ['autodocs'],
  argTypes: {
    level: { control: 'select', options: [1, 2, 3, 4, 5, 6] },
    size: { control: 'select', options: [undefined, 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl'] },
    weight: { control: 'select', options: ['400', '500', '600', '700', '800'] },
  },
  args: { level: 2, weight: '600', children: 'Billing' },
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const CustomSize: Story = { args: { size: 'lg' } };
export const Levels: Story = {
  render: () => (
    <div>
      <Heading level={1}>Heading 1</Heading>
      <Heading level={2}>Heading 2</Heading>
      <Heading level={3}>Heading 3</Heading>
      <Heading level={4}>Heading 4</Heading>
      <Heading level={5}>Heading 5</Heading>
      <Heading level={6}>Heading 6</Heading>
    </div>
  ),
};

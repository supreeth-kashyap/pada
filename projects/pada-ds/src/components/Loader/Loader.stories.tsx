import type { Meta, StoryObj } from '@storybook/react-vite';
import { Loader } from './Loader';

const SIZES = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;

const meta = {
  title: 'Legacy/Loader',
  component: Loader,
  tags: ['autodocs'],
  args: { size: 'md' },
  argTypes: { size: { control: 'inline-radio', options: SIZES } },
} satisfies Meta<typeof Loader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      {SIZES.map((size) => <Loader key={size} size={size} />)}
    </div>
  ),
};

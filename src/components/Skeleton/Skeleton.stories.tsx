import type { Meta, StoryObj } from '@storybook/react-vite';
import { Skeleton } from './Skeleton';

const meta = {
  title: 'Components/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  args: { shape: 'text' },
  argTypes: { shape: { control: 'inline-radio', options: ['text', 'rect', 'circle'] } },
  decorators: [(Story) => <div style={{ width: 320 }}><Story /></div>],
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Text: Story = { args: { lines: 3 } };
export const Rect: Story = { args: { shape: 'rect', height: 120 } };
export const Circle: Story = { args: { shape: 'circle', height: 48, width: 48 } };
export const ProfileCard: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12 }} aria-busy>
      <Skeleton shape="circle" height={40} width={40} />
      <div style={{ flex: 1 }}>
        <Skeleton lines={3} />
      </div>
    </div>
  ),
};

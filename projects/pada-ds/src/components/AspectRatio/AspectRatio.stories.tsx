import type { Meta, StoryObj } from '@storybook/react-vite';
import { Placeholder } from '../../stories/Placeholder';
import { AspectRatio } from './AspectRatio';

const meta = {
  title: 'Layout/AspectRatio',
  component: AspectRatio,
  tags: ['autodocs'],
  args: { ratio: 16 / 9 },
  argTypes: { ratio: { control: { type: 'number', step: 0.05 } } },
  decorators: [(Story) => <div style={{ width: 360 }}><Story /></div>],
  render: (args) => (
    <AspectRatio {...args}>
      <Placeholder style={{ height: '100%' }}>{Number(args.ratio).toFixed(2)} : 1</Placeholder>
    </AspectRatio>
  ),
} satisfies Meta<typeof AspectRatio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Widescreen: Story = {};
export const Square: Story = { args: { ratio: 1 } };
export const Portrait: Story = { args: { ratio: 3 / 4 } };

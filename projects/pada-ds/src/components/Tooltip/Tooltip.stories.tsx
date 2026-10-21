import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button';
import { Tooltip } from './Tooltip';

const meta = {
  title: 'Overlays/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  args: { content: 'Archive this record', position: 'top', children: <Button variant="secondary">Archive</Button> },
  argTypes: { position: { control: 'inline-radio', options: ['top', 'bottom', 'left', 'right'] } },
  decorators: [(Story) => <div style={{ padding: 80 }}><Story /></div>],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Top: Story = {};
export const Right: Story = { args: { position: 'right' } };
export const Instant: Story = { args: { delayDuration: 0 } };

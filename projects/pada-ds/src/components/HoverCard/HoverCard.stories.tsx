import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar } from '../Avatar';
import { Link } from '../Link';
import { HoverCard } from './HoverCard';

const profile = (
  <div style={{ display: 'flex', gap: 12, maxWidth: 260 }}>
    <Avatar name="Grace Hopper" size="lg" />
    <div>
      <strong>Grace Hopper</strong>
      <p style={{ margin: '4px 0 0', color: 'var(--color-fg-muted)', fontSize: 13 }}>
        Compiler pioneer. Coined “debugging”.
      </p>
    </div>
  </div>
);

const meta = {
  title: 'Overlays/HoverCard',
  component: HoverCard,
  tags: ['autodocs'],
  args: { content: profile, side: 'top', arrow: true, children: <Link href="#">@grace</Link> },
  argTypes: {
    side: { control: 'inline-radio', options: ['top', 'right', 'bottom', 'left'] },
    align: { control: 'inline-radio', options: ['start', 'center', 'end'] },
  },
  decorators: [(Story) => <div style={{ padding: 120 }}><Story /></div>],
} satisfies Meta<typeof HoverCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Bottom: Story = { args: { side: 'bottom', arrow: false } };

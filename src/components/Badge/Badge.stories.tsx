import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge, type BadgeTone } from './Badge';

const TONES: BadgeTone[] = ['neutral', 'accent', 'success', 'warning', 'danger', 'info'];

const meta = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  args: { children: 'Beta' },
  argTypes: {
    tone: { control: 'select', options: TONES },
    variant: { control: 'inline-radio', options: ['subtle', 'solid', 'outline'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Count: Story = { args: { count: 120, tone: 'danger', variant: 'solid' } };
export const WithDot: Story = { args: { dot: true, tone: 'success', children: 'Online' } };

export const Tones: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 12 }}>
      {(['subtle', 'solid', 'outline'] as const).map((variant) => (
        <div key={variant} style={{ display: 'flex', gap: 8 }}>
          {TONES.map((tone) => (
            <Badge key={tone} {...args} tone={tone} variant={variant}>
              {tone}
            </Badge>
          ))}
        </div>
      ))}
    </div>
  ),
};

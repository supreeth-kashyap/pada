import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from '../Badge';
import { Card } from './Card';

const meta = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  args: {
    children: (
      <div style={{ width: 280 }}>
        <h3 style={{ margin: '0 0 4px' }}>Acme rebrand</h3>
        <p style={{ margin: 0, color: 'var(--color-fg-muted)' }}>Started 3 days ago</p>
      </div>
    ),
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithBadge: Story = {
  args: {
    children: (
      <div style={{ width: 280, display: 'grid', gap: 8 }}>
        <Badge tone="success" dot>Live</Badge>
        <h3 style={{ margin: 0 }}>Checkout v2</h3>
        <p style={{ margin: 0, color: 'var(--color-fg-muted)' }}>Rolled out to 100% of users.</p>
      </div>
    ),
  },
};

import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Indexer } from './Indexer';

const meta = {
  title: 'Components/Indexer',
  component: Indexer,
  tags: ['autodocs'],
  args: {
    items: [
      { id: 'overview', label: 'Overview' },
      { id: 'usage', label: 'Usage' },
      { id: 'props', label: 'Props' },
      { id: 'accessibility', label: 'Accessibility' },
    ],
    activeIndex: 1,
    onActiveChange: fn(),
  },
} satisfies Meta<typeof Indexer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

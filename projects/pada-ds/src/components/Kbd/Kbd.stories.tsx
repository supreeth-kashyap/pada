import type { Meta, StoryObj } from '@storybook/react-vite';
import { Kbd } from './Kbd';

const meta = {
  title: 'Components/Kbd',
  component: Kbd,
  tags: ['autodocs'],
} satisfies Meta<typeof Kbd>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SingleKey: Story = { args: { children: 'Esc' } };
export const Combination: Story = { args: { keys: ['⌘', 'K'] } };
export const InSentence: Story = {
  render: () => (
    <p style={{ margin: 0 }}>
      Press <Kbd keys={['⌘', 'K']} /> to search, or <Kbd>Esc</Kbd> to close.
    </p>
  ),
};

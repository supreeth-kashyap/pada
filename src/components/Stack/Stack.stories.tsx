import type { Meta, StoryObj } from '@storybook/react-vite';
import { Placeholder } from '../../stories/Placeholder';
import { Button } from '../Button';
import { Stack } from './Stack';

const meta = {
  title: 'Components/Stack',
  component: Stack,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { direction: 'column', gap: 3 },
  argTypes: {
    direction: { control: 'inline-radio', options: ['row', 'column'] },
    gap: { control: 'select', options: [0, 0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 16] },
    align: { control: 'inline-radio', options: ['start', 'center', 'end', 'stretch', 'baseline'] },
    justify: { control: 'inline-radio', options: ['start', 'center', 'end', 'between', 'around'] },
  },
  render: (args) => (
    <Stack {...args}>
      {['One', 'Two', 'Three'].map((label) => <Placeholder key={label}>{label}</Placeholder>)}
    </Stack>
  ),
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Column: Story = {};
export const Row: Story = { args: { direction: 'row', gap: 2 } };
export const HeaderLayout: Story = {
  render: () => (
    <Stack direction="row" justify="between" align="center">
      <h2 style={{ margin: 0 }}>Website redesign</h2>
      <Stack direction="row" gap={2}>
        <Button variant="secondary">Share</Button>
        <Button>Open</Button>
      </Stack>
    </Stack>
  ),
};

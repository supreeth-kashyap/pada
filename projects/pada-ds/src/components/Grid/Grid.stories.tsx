import type { Meta, StoryObj } from '@storybook/react-vite';
import { Placeholder } from '../../stories/Placeholder';
import { Grid } from './Grid';

const meta = {
  title: 'Layout/Grid',
  component: Grid,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { columns: 3, gap: 4 },
  argTypes: {
    gap: { control: 'select', options: [0, 0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 16] },
    align: { control: 'inline-radio', options: ['start', 'center', 'end', 'stretch'] },
  },
  render: (args) => (
    <Grid {...args}>
      {Array.from({ length: 6 }, (_, i) => <Placeholder key={i}>Item {i + 1}</Placeholder>)}
    </Grid>
  ),
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ThreeColumns: Story = {};
export const Responsive: Story = { args: { columns: undefined, minItemWidth: '160px' } };

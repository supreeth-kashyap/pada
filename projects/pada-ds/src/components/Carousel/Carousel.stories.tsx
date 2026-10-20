import type { Meta, StoryObj } from '@storybook/react-vite';
import { Placeholder } from '../../stories/Placeholder';
import { Carousel } from './Carousel';

const slides = ['Connect your data', 'Invite your team', 'Ship your first report'].map((title, index) => (
  <Placeholder key={title} style={{ height: 200 }}>
    Step {index + 1}: {title}
  </Placeholder>
));

const meta = {
  title: 'Display/Carousel',
  component: Carousel,
  tags: ['autodocs'],
  args: { label: 'Feature tour', children: slides },
  decorators: [(Story) => <div style={{ width: 480 }}><Story /></div>],
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const AutoPlay: Story = { args: { autoPlay: true, interval: 3000 } };
export const WithoutControls: Story = { args: { showDots: false, showNav: false } };

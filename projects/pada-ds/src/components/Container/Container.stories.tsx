import type { Meta, StoryObj } from '@storybook/react-vite';
import { Placeholder } from '../../stories/Placeholder';
import { Container } from './Container';

const meta = {
  title: 'Layout/Container',
  component: Container,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: { size: 'md' },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg', 'xl', '2xl', 'full'] } },
  render: (args) => (
    <Container {...args}>
      <Placeholder>Content is centred and capped at the “{args.size}” width</Placeholder>
    </Container>
  ),
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Medium: Story = {};
export const Small: Story = { args: { size: 'sm' } };
export const Full: Story = { args: { size: 'full' } };

import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button';
import { ButtonGroup } from './ButtonGroup';

const meta = {
  title: 'Components/ButtonGroup',
  component: ButtonGroup,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'ghost', 'destructive'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
  },
  args: { label: 'Text alignment', variant: 'secondary', size: 'sm', orientation: 'horizontal', attached: false },
  render: (args) => (
    <ButtonGroup {...args}>
      <Button>Left</Button>
      <Button>Center</Button>
      <Button>Right</Button>
    </ButtonGroup>
  ),
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Attached: Story = { args: { attached: true } };
export const Vertical: Story = { args: { orientation: 'vertical' } };

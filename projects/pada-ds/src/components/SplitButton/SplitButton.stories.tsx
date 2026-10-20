import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button';
import { DropdownMenu } from '../DropdownMenu';
import { SplitButton } from '.';

const meta = {
  title: 'Components/SplitButton',
  component: SplitButton.Root,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  args: { variant: 'primary', size: 'md', label: 'Save options' },
  render: (args) => (
    <SplitButton.Root {...args}>
      <Button>Save</Button>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <SplitButton.Splitter />
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="end">
          <DropdownMenu.Item>Save as draft</DropdownMenu.Item>
          <DropdownMenu.Item>Save and publish</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </SplitButton.Root>
  ),
} satisfies Meta<typeof SplitButton.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
export const Secondary: Story = { args: { variant: 'secondary' } };
export const Small: Story = { args: { size: 'sm' } };

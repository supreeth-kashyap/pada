import type { Meta, StoryObj } from '@storybook/react-vite';
import { ToggleGroup } from '.';

const meta = {
  title: 'Components/ToggleGroup',
  component: ToggleGroup.Item,
  args: { value: 'list' },
  tags: ['autodocs'],
} satisfies Meta<typeof ToggleGroup.Item>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {
  render: () => (
    <ToggleGroup.Root type="single" defaultValue="list" aria-label="View">
      <ToggleGroup.Item value="list" icon="menu_2">List</ToggleGroup.Item>
      <ToggleGroup.Item value="grid" icon="dashboard">Grid</ToggleGroup.Item>
      <ToggleGroup.Item value="timeline" icon="time_1">Timeline</ToggleGroup.Item>
    </ToggleGroup.Root>
  ),
};

export const Multiple: Story = {
  render: () => (
    <ToggleGroup.Root type="multiple" defaultValue={['bold']} aria-label="Text formatting">
      <ToggleGroup.Item value="bold" aria-label="Bold"><strong>B</strong></ToggleGroup.Item>
      <ToggleGroup.Item value="italic" aria-label="Italic"><em>I</em></ToggleGroup.Item>
      <ToggleGroup.Item value="underline" aria-label="Underline"><u>U</u></ToggleGroup.Item>
    </ToggleGroup.Root>
  ),
};

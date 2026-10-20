import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button';
import { Checkbox } from '../Checkbox';
import { Drawer } from '.';

const meta = {
  title: 'Overlays/Drawer',
  component: Drawer.Content,
  tags: ['autodocs'],
  args: { side: 'right', size: 'sm' },
  argTypes: {
    side: { control: 'inline-radio', options: ['left', 'right', 'top', 'bottom'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg', 'xl'] },
  },
  render: (args) => (
    <Drawer.Root>
      <Drawer.Trigger asChild>
        <Button variant="secondary">Filters</Button>
      </Drawer.Trigger>
      <Drawer.Content {...args}>
        <Drawer.Header>
          <Drawer.Title>Filters</Drawer.Title>
          <Drawer.Description>Narrow down the project list.</Drawer.Description>
        </Drawer.Header>
        <Drawer.Body>
          <div style={{ display: 'grid', gap: 12 }}>
            <Checkbox label="Active" defaultChecked />
            <Checkbox label="Archived" />
            <Checkbox label="Shared with me" />
          </div>
        </Drawer.Body>
        <Drawer.Footer>
          <Drawer.Close asChild><Button variant="secondary">Reset</Button></Drawer.Close>
          <Drawer.Close asChild><Button>Apply</Button></Drawer.Close>
        </Drawer.Footer>
        <Drawer.CloseButton />
      </Drawer.Content>
    </Drawer.Root>
  ),
} satisfies Meta<typeof Drawer.Content>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Right: Story = {};
export const Left: Story = { args: { side: 'left' } };
export const Bottom: Story = { args: { side: 'bottom' } };

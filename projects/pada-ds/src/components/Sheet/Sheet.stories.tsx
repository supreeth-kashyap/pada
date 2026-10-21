import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Button } from '../Button';
import { Checkbox } from '../Checkbox';
import { Sheet } from '.';

const meta = {
  title: 'Overlays/Sheet',
  component: Sheet.Content,
  tags: ['autodocs'],
  args: { snapPoints: [0.45, 0.9], onSnapChange: fn() },
  render: (args) => (
    <Sheet.Root>
      <Sheet.Trigger asChild>
        <Button>Filters</Button>
      </Sheet.Trigger>
      <Sheet.Content {...args}>
        <Sheet.Header>
          <Sheet.Title>Filters</Sheet.Title>
          <Sheet.Description>Drag the handle to resize or dismiss.</Sheet.Description>
        </Sheet.Header>
        <Sheet.Body>
          <div style={{ display: 'grid', gap: 12 }}>
            <Checkbox label="In stock" defaultChecked />
            <Checkbox label="Free shipping" />
            <Checkbox label="On sale" />
          </div>
        </Sheet.Body>
        <Sheet.Footer>
          <Sheet.Close asChild><Button>Show results</Button></Sheet.Close>
        </Sheet.Footer>
      </Sheet.Content>
    </Sheet.Root>
  ),
} satisfies Meta<typeof Sheet.Content>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const NotDismissible: Story = { args: { dismissible: false, snapPoints: [0.3, 0.8] } };

import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Button } from '../Button';
import { InputText } from '../InputText';
import { Dialog } from '.';

const meta = {
  title: 'Components/Dialog',
  component: Dialog.Content,
  tags: ['autodocs'],
  args: { size: 'md' },
  argTypes: { size: { control: 'inline-radio', options: ['auto', 'sm', 'md', 'lg', 'xl', 'full'] } },
  render: (args) => (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button>Edit profile</Button>
      </Dialog.Trigger>
      <Dialog.Content {...args}>
        <Dialog.Header>
          <Dialog.Title>Edit profile</Dialog.Title>
          <Dialog.Description>This is how others see you.</Dialog.Description>
        </Dialog.Header>
        <Dialog.Body>
          <div style={{ display: 'grid', gap: 12 }}>
            <InputText label="Name" defaultValue="Grace Hopper" />
            <InputText label="Title" defaultValue="Rear Admiral" />
          </div>
        </Dialog.Body>
        <Dialog.Footer>
          <Dialog.Close asChild><Button variant="secondary">Cancel</Button></Dialog.Close>
          <Button onClick={fn()}>Save</Button>
        </Dialog.Footer>
        <Dialog.CloseButton />
      </Dialog.Content>
    </Dialog.Root>
  ),
} satisfies Meta<typeof Dialog.Content>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Small: Story = { args: { size: 'sm' } };
export const Large: Story = { args: { size: 'lg' } };

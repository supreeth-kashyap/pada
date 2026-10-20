import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Button } from '../Button';
import { AlertDialog } from '.';

const meta = {
  title: 'Components/AlertDialog',
  component: AlertDialog.Content,
  tags: ['autodocs'],
} satisfies Meta<typeof AlertDialog.Content>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Destructive: Story = {
  render: () => (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <Button variant="destructive">Delete project</Button>
      </AlertDialog.Trigger>
      <AlertDialog.Content>
        <AlertDialog.Header>
          <AlertDialog.Title>Delete “Website redesign”?</AlertDialog.Title>
          <AlertDialog.Description>This can’t be undone. All files and comments will be removed.</AlertDialog.Description>
        </AlertDialog.Header>
        <AlertDialog.Footer>
          <AlertDialog.Cancel>Keep project</AlertDialog.Cancel>
          <AlertDialog.Action variant="destructive" onClick={fn()}>Delete project</AlertDialog.Action>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog.Root>
  ),
};

export const Confirm: Story = {
  render: () => (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <Button>Publish changes</Button>
      </AlertDialog.Trigger>
      <AlertDialog.Content>
        <AlertDialog.Header>
          <AlertDialog.Title>Publish to production?</AlertDialog.Title>
          <AlertDialog.Description>Visitors will see the new version immediately.</AlertDialog.Description>
        </AlertDialog.Header>
        <AlertDialog.Footer>
          <AlertDialog.Cancel>Not yet</AlertDialog.Cancel>
          <AlertDialog.Action onClick={fn()}>Publish</AlertDialog.Action>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog.Root>
  ),
};

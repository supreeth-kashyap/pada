import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Button } from '../Button';
import { Alert } from './Alert';

const meta = {
  title: 'Feedback/Alert',
  component: Alert,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    tone: 'info',
    title: 'Scheduled maintenance',
    children: 'The dashboard will be read-only on Sunday from 02:00 to 04:00 UTC.',
  },
  argTypes: {
    tone: { control: 'select', options: ['neutral', 'info', 'success', 'warning', 'danger'] },
    live: { control: 'inline-radio', options: [undefined, 'polite', 'assertive'] },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {};
export const Success: Story = { args: { tone: 'success', title: 'Changes saved', children: 'Your profile is up to date.' } };
export const Warning: Story = { args: { tone: 'warning', title: 'Storage almost full', children: 'You have used 92% of your quota.' } };
export const Danger: Story = { args: { tone: 'danger', title: 'Payment failed', children: 'Update your card to keep your plan.' } };

export const Dismissible: Story = { args: { onDismiss: fn() } };

export const WithActions: Story = {
  args: {
    tone: 'warning',
    title: 'Unsaved changes',
    children: 'Leave this page without saving?',
    actions: (
      <>
        <Button variant="secondary" size="sm">Stay</Button>
        <Button variant="destructive" size="sm">Discard</Button>
      </>
    ),
  },
};

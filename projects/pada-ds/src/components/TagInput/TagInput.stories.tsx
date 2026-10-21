import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { TagInput } from './TagInput';

const meta = {
  title: 'Forms/TagInput',
  component: TagInput,
  tags: ['autodocs'],
  args: { label: 'Topics', placeholder: 'Add a topic…', defaultValue: ['design', 'react'], onValueChange: fn() },
  decorators: [(Story) => <div style={{ width: 360 }}><Story /></div>],
} satisfies Meta<typeof TagInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const EmailValidation: Story = {
  args: {
    label: 'Invite by email',
    defaultValue: ['ada@example.com'],
    placeholder: 'name@company.com',
    description: 'Press Enter or comma to add.',
    validate: (tag: string) => (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(tag) ? null : `${tag} is not an email address.`),
    maxTags: 5,
  },
};
export const WithError: Story = { args: { error: 'Add at least three topics.' } };
export const Disabled: Story = { args: { disabled: true } };

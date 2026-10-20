import type { Meta, StoryObj } from '@storybook/react-vite';
import { PasswordInput } from './PasswordInput';

const meta = {
  title: 'Components/PasswordInput',
  component: PasswordInput,
  tags: ['autodocs'],
  args: { label: 'Password', name: 'password' },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
  decorators: [(Story) => <div style={{ width: 320 }}><Story /></div>],
} satisfies Meta<typeof PasswordInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithStrength: Story = { args: { label: 'New password', autoComplete: 'new-password', strength: true, defaultValue: 'correct horse' } };
export const Visible: Story = { args: { defaultVisible: true, defaultValue: 'hunter2' } };
export const WithError: Story = { args: { error: 'Use at least 12 characters.' } };

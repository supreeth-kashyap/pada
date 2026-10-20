import type { Meta, StoryObj } from '@storybook/react-vite';
import { InputTextArea } from './InputTextArea';

const meta = {
  title: 'Forms/InputTextArea',
  component: InputTextArea,
  tags: ['autodocs'],
  args: { label: 'Feedback', rows: 4, placeholder: 'Tell us what you think…' },
  decorators: [(Story) => <div style={{ width: 360 }}><Story /></div>],
} satisfies Meta<typeof InputTextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithDescription: Story = { args: { description: 'Up to 500 characters.', maxLength: 500 } };
export const Required: Story = { args: { required: true } };
export const WithError: Story = { args: { error: 'Feedback can’t be empty.' } };
export const Disabled: Story = { args: { disabled: true, defaultValue: 'Read-only feedback' } };

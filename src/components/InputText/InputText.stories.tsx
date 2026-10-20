import type { Meta, StoryObj } from '@storybook/react-vite';
import { InputText } from './InputText';

const meta = {
  title: 'Components/InputText',
  component: InputText,
  tags: ['autodocs'],
  args: { label: 'Email', placeholder: 'you@example.com' },
  decorators: [(Story) => <div style={{ width: 320 }}><Story /></div>],
} satisfies Meta<typeof InputText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithDescription: Story = { args: { description: 'We only use this for receipts.' } };
export const Required: Story = { args: { required: true } };
export const Optional: Story = { args: { optional: true } };
export const WithError: Story = { args: { defaultValue: 'not-an-email', error: 'Enter a valid email address.' } };
export const Disabled: Story = { args: { disabled: true, defaultValue: 'you@example.com' } };

import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormLabel } from './FormLabel';

const meta = {
  title: 'Legacy/FormLabel',
  component: FormLabel,
  tags: ['autodocs'],
  args: { children: 'Email', htmlFor: 'email' },
} satisfies Meta<typeof FormLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Required: Story = { args: { required: true } };
export const Optional: Story = { args: { optional: true } };

import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { RadioCardGroup } from './RadioCard';

const meta = {
  title: 'Forms/RadioCardGroup',
  component: RadioCardGroup,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    label: 'Plan',
    name: 'plan',
    defaultValue: 'pro',
    onValueChange: fn(),
    options: [
      { value: 'free', title: 'Free', description: 'For personal projects', meta: '$0' },
      { value: 'pro', title: 'Pro', description: 'For growing teams', meta: '$12 / seat' },
      { value: 'enterprise', title: 'Enterprise', description: 'SSO, audit logs and support', meta: 'Contact us', disabled: true },
    ],
  },
} satisfies Meta<typeof RadioCardGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const ThreeColumns: Story = { args: { columns: 3 } };
export const WithIcons: Story = {
  args: {
    label: 'Notify me by',
    defaultValue: 'mail',
    options: [
      { value: 'mail', title: 'Email', icon: 'mail', description: 'A daily digest' },
      { value: 'bell', title: 'In-app', icon: 'bell', description: 'As it happens' },
      { value: 'none', title: 'Never', icon: 'bell_silence', description: 'Check manually' },
    ],
    columns: 3,
  },
};

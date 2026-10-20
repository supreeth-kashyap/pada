import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Steps } from './Steps';

const meta = {
  title: 'Navigation/Steps',
  component: Steps,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    onStepChange: fn(),
    steps: [
      { title: 'Account', description: 'Your details', status: 'completed' },
      { title: 'Plan', description: 'Pick a tier', status: 'current' },
      { title: 'Confirm', description: 'Review and pay', status: 'upcoming' },
    ],
  },
} satisfies Meta<typeof Steps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Clickable: Story = {
  args: {
    currentStep: 2,
    steps: [
      { title: 'Connect', stepValue: 1, clickable: true },
      { title: 'Configure', stepValue: 2, clickable: true },
      { title: 'Launch', stepValue: 3, clickable: true },
    ],
  },
};

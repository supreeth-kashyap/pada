import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Calendar } from './Calendar';

const meta: Meta<typeof Calendar> = {
  title: 'Components/Calendar',
  component: Calendar,
  tags: ['autodocs'],
  args: { onValueChange: fn() },
};

export default meta;
type Story = StoryObj<typeof Calendar>;

export const Default: Story = { args: { defaultValue: new Date(2026, 9, 20) } };

export const Range: Story = {
  args: {
    mode: 'range',
    defaultValue: [new Date(2026, 9, 12), new Date(2026, 9, 16)],
    weekStartsOn: 1,
    locale: 'en-GB',
  },
};

export const UnavailableWeekends: Story = {
  args: {
    defaultMonth: new Date(2026, 9, 1),
    isDateUnavailable: (date: Date) => date.getDay() === 0 || date.getDay() === 6,
  },
};

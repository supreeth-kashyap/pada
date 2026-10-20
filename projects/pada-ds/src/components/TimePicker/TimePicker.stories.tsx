import type { Meta, StoryObj } from '@storybook/react-vite';
import { TimePicker } from './TimePicker';

const meta = {
  title: 'Components/TimePicker',
  component: TimePicker,
  tags: ['autodocs'],
  argTypes: {
    granularity: { control: 'inline-radio', options: ['minute', 'second'] },
    hourCycle: { control: 'inline-radio', options: [undefined, 12, 24] },
  },
  args: { label: 'Start time', description: 'In your local time zone.', defaultValue: '09:30', minuteStep: 1 },
} satisfies Meta<typeof TimePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const TwentyFourHour: Story = { args: { hourCycle: 24, label: 'Departure' } };
export const WithSeconds: Story = { args: { granularity: 'second', label: 'Alarm', defaultValue: '06:45:00' } };
export const QuarterHours: Story = { args: { minuteStep: 15, label: 'Meeting', description: 'Arrow keys step by 15 minutes.' } };
export const Error: Story = { args: { defaultValue: null, required: true, error: 'Pick a start time.' } };
export const Disabled: Story = { args: { disabled: true } };

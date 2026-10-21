import type { Meta, StoryObj } from '@storybook/react-vite';
import { DateRangePicker, type DateRangePreset } from './DateRangePicker';

const today = new Date(2026, 9, 20);
const addDays = (days: number) => new Date(today.getFullYear(), today.getMonth(), today.getDate() + days);
const isWeekend = (date: Date) => date.getDay() === 0 || date.getDay() === 6;

const presets: DateRangePreset[] = [
  { label: 'Last 7 days', range: [addDays(-6), today] },
  { label: 'Last 30 days', range: [addDays(-29), today] },
  { label: 'This month', range: [new Date(2026, 9, 1), new Date(2026, 9, 31)] },
  { label: 'Last quarter', range: [new Date(2026, 6, 1), new Date(2026, 8, 30)] },
];

const meta = {
  title: 'Dates/DateRangePicker',
  component: DateRangePicker,
  tags: ['autodocs'],
  argTypes: {
    weekStartsOn: { control: 'select', options: [0, 1, 6] },
    numberOfMonths: { control: 'select', options: [1, 2] },
    value: { control: false },
    minDate: { control: false },
    maxDate: { control: false },
  },
  args: { label: 'Stay', placeholder: 'Select dates', today, weekStartsOn: 0, numberOfMonths: 2, required: false, disabled: false },
  decorators: [(Story) => <div style={{ maxWidth: 360, paddingBottom: 420 }}><Story /></div>],
} satisfies Meta<typeof DateRangePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithValue: Story = { args: { defaultValue: [addDays(4), addDays(9)] } };
export const Presets: Story = { args: { label: 'Report period', presets, weekStartsOn: 1 } };
export const Weekdays: Story = { args: { label: 'Booking', minDate: today, isDateUnavailable: isWeekend, description: 'Weekdays only.' } };
export const OneMonth: Story = { args: { numberOfMonths: 1 } };
export const Error: Story = { args: { error: 'Pick the dates of your stay.' } };
export const Disabled: Story = { args: { disabled: true, defaultValue: [addDays(1), addDays(3)] } };

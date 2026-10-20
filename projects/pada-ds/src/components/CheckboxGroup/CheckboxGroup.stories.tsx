import type { Meta, StoryObj } from '@storybook/react-vite';
import { CheckboxGroup, type CheckboxGroupOption } from './CheckboxGroup';

const topics: CheckboxGroupOption[] = [
  { value: 'mentions', label: 'Mentions' },
  { value: 'comments', label: 'Comments on my documents' },
  { value: 'reviews', label: 'Review requests' },
  { value: 'digest', label: 'Weekly digest' },
];

const meta = {
  title: 'Forms/CheckboxGroup',
  component: CheckboxGroup,
  tags: ['autodocs'],
  argTypes: { orientation: { control: 'inline-radio', options: ['vertical', 'horizontal'] } },
  args: {
    label: 'Notify me about',
    description: 'We send at most one email a day.',
    options: topics,
    defaultValue: ['mentions'],
    selectAll: false,
    orientation: 'vertical',
    disabled: false,
  },
} satisfies Meta<typeof CheckboxGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const SelectAll: Story = { args: { selectAll: true, defaultValue: ['mentions', 'reviews'] } };
export const Horizontal: Story = { args: { orientation: 'horizontal', description: undefined } };
export const Error: Story = { args: { defaultValue: [], required: true, invalid: true, error: 'Pick at least one topic.' } };
export const Disabled: Story = { args: { disabled: true } };

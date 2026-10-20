import type { Meta, StoryObj } from '@storybook/react-vite';
import { Progress } from './Progress';

const meta = {
  title: 'Components/Progress',
  component: Progress,
  tags: ['autodocs'],
  args: { value: 64, label: 'Uploading' },
  argTypes: { value: { control: { type: 'range', min: 0, max: 100 } } },
  decorators: [(Story) => <div style={{ width: 320 }}><Story /></div>],
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Complete: Story = { args: { value: 100, label: 'Upload complete' } };
export const CustomMax: Story = { args: { value: 3, max: 8, label: 'Steps completed' } };

import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ComboBox } from './ComboBox';

const meta = {
  title: 'Components/ComboBox',
  component: ComboBox,
  tags: ['autodocs'],
  args: {
    onItemClick: fn(),
    items: [
      { id: 'acme', label: 'Acme Corp', iconName: 'corporate' },
      { id: 'globex', label: 'Globex', iconName: 'corporate', selected: true },
      { id: 'initech', label: 'Initech', iconName: 'corporate' },
      { id: 'umbrella', label: 'Umbrella (archived)', iconName: 'corporate', disabled: true },
    ],
  },
  decorators: [(Story) => <div style={{ width: 280 }}><Story /></div>],
} satisfies Meta<typeof ComboBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const MultiSelect: Story = { args: { multiSelect: true } };

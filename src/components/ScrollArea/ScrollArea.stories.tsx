import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from '../Badge';
import { ScrollArea } from './ScrollArea';

const activity = Array.from({ length: 30 }, (_, i) => (
  <p key={i} style={{ margin: 0, padding: '8px 0', borderBottom: '1px solid var(--color-border)' }}>
    Event #{30 - i} — deployment finished
  </p>
));

const meta = {
  title: 'Components/ScrollArea',
  component: ScrollArea,
  tags: ['autodocs'],
  args: { 'aria-label': 'Activity', maxHeight: 240, children: activity },
  argTypes: {
    orientation: { control: 'inline-radio', options: ['vertical', 'horizontal', 'both'] },
    scrollbar: { control: 'inline-radio', options: ['auto', 'always'] },
  },
  decorators: [(Story) => <div style={{ width: 320 }}><Story /></div>],
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Vertical: Story = {};
export const WithFade: Story = { args: { fade: true } };
export const Horizontal: Story = {
  args: {
    'aria-label': 'Filters',
    orientation: 'horizontal',
    maxHeight: undefined,
    children: (
      <div style={{ display: 'flex', gap: 8, padding: '4px 0', width: 'max-content' }}>
        {['Design', 'Engineering', 'Marketing', 'Sales', 'Support', 'Finance', 'Legal', 'Operations', 'Research'].map((t) => (
          <Badge key={t}>{t}</Badge>
        ))}
      </div>
    ),
  },
};

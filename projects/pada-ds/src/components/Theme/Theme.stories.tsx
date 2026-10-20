import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from '../Badge';
import { Button } from '../Button';
import { Card } from '../Card';
import { Switch } from '../Switch';
import { ThemeProvider, ThemeToggle } from '.';

const meta = {
  title: 'Foundation/ThemeProvider',
  component: ThemeToggle,
  tags: ['autodocs'],
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Toggle: Story = {};

const sample = (
  <Card>
    <div style={{ display: 'grid', gap: 12, width: 220 }}>
      <Badge tone="accent">Preview</Badge>
      <Switch label="Notifications" defaultChecked />
      <Button>Save</Button>
    </div>
  </Card>
);

/** `target="element"` scopes a theme to a subtree, so different themes can sit side by side. */
export const ScopedThemes: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
      <ThemeProvider target="element" theme="light" accent="indigo">{sample}</ThemeProvider>
      <ThemeProvider target="element" theme="dark" accent="emerald">{sample}</ThemeProvider>
      <ThemeProvider target="element" theme="light" accent="rose" radius="xl" density="spacious">{sample}</ThemeProvider>
    </div>
  ),
};

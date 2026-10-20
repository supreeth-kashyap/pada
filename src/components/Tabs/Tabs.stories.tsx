import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { TabPanel, Tabs } from './Tabs';

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    label: 'Record detail',
    onChange: fn(),
    children: [
      <TabPanel key="overview" label="Overview">Summary of the record and its owner.</TabPanel>,
      <TabPanel key="activity" label="Activity" notification>Three new comments since your last visit.</TabPanel>,
      <TabPanel key="cog" label="Settings">Permissions and retention.</TabPanel>,
    ],
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const SecondTabActive: Story = { args: { defaultValue: 1 } };

export const Pills: Story = {
  render: () => (
    <Tabs.Root variant="pills" defaultValue="week">
      <Tabs.List aria-label="Range">
        <Tabs.Trigger value="day">Day</Tabs.Trigger>
        <Tabs.Trigger value="week">Week</Tabs.Trigger>
        <Tabs.Trigger value="month" notification>Month</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="day">Today’s numbers.</Tabs.Content>
      <Tabs.Content value="week">This week’s numbers.</Tabs.Content>
      <Tabs.Content value="month">This month’s numbers.</Tabs.Content>
    </Tabs.Root>
  ),
};

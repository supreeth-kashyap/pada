import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Accordion } from './Accordion';

const meta = {
  title: 'Display/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    header: 'What is Pada?',
    headerIconName: 'help',
    children: 'Pada is a singular React design system focused on dense product UIs.',
    onOpenChange: fn(),
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const DefaultOpen: Story = { args: { defaultOpen: true } };
export const WithoutIcon: Story = { args: { headerIconName: undefined, header: 'No leading icon' } };
export const Disabled: Story = { args: { disabled: true } };

export const SingleGroup: Story = {
  render: () => (
    <Accordion.Root type="single" collapsible defaultValue="shipping">
      <Accordion.Item value="shipping">
        <Accordion.Trigger iconName="info">Shipping</Accordion.Trigger>
        <Accordion.Content>Orders ship within two business days.</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="returns">
        <Accordion.Trigger>Returns</Accordion.Trigger>
        <Accordion.Content>Return anything within 30 days.</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="warranty" disabled>
        <Accordion.Trigger>Warranty (disabled)</Accordion.Trigger>
        <Accordion.Content>Two years.</Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  ),
};

export const MultipleGroup: Story = {
  render: () => (
    <Accordion.Root type="multiple" defaultValue={['billing']}>
      <Accordion.Item value="billing">
        <Accordion.Trigger>Billing</Accordion.Trigger>
        <Accordion.Content>Invoices are sent on the first of each month.</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="security">
        <Accordion.Trigger>Security</Accordion.Trigger>
        <Accordion.Content>Two-factor authentication is required for admins.</Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  ),
};

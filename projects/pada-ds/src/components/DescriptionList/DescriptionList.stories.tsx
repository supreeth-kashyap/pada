import type { Meta, StoryObj } from '@storybook/react-vite';
import { DescriptionList, type DescriptionListData } from './DescriptionList';

const vendor: DescriptionListData = {
  sections: [
    {
      header: { label: 'Ownership', slot: [{ type: 'button', label: 'Edit' }] },
      rows: [
        { key: 'Owner', value: [{ type: 'avatar', name: 'Anna Banks', subtitle: 'HR' }] },
        { key: 'Reviewers', value: [{ type: 'avatar', name: 'Ada Lovelace' }, { type: 'avatar', name: 'Grace Hopper' }] },
        { key: 'Status', tooltip: 'Current state of the vendor review', value: [{ type: 'badge', label: 'Active', tone: 'success' }] },
      ],
    },
    {
      header: { label: 'Contract', tooltip: 'From the signed order form', slot: [{ type: 'badge', label: 'Renews soon', tone: 'warning' }] },
      rows: [
        { key: 'Vendor', value: [{ type: 'text', text: 'Northwind Analytics' }] },
        { key: 'Annual value', value: [{ type: 'text', text: '₹ 18,40,000' }] },
        { key: 'Renewal', value: [{ type: 'text', text: '1 December 2026' }, { type: 'button', label: 'Set reminder' }] },
        { key: 'Data access', value: [{ type: 'badge', label: 'PII', tone: 'danger' }, { type: 'badge', label: 'Billing', tone: 'info' }] },
      ],
    },
  ],
};

const meta = {
  title: 'Components/DescriptionList',
  component: DescriptionList,
  tags: ['autodocs'],
  args: { data: vendor },
  decorators: [(Story) => <div style={{ maxWidth: 640 }}><Story /></div>],
} satisfies Meta<typeof DescriptionList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const SingleSection: Story = {
  args: {
    data: {
      sections: [
        {
          header: { label: 'Profile' },
          rows: [
            { key: 'Name', value: [{ type: 'text', text: 'Grace Hopper' }] },
            { key: 'Email', value: [{ type: 'text', text: 'grace.hopper@example.com' }] },
            { key: 'Role', value: [{ type: 'badge', label: 'Admin', tone: 'accent' }] },
          ],
        },
      ],
    },
  },
};
export const DisabledActions: Story = {
  args: {
    data: {
      sections: [
        {
          header: { label: 'Access', slot: [{ type: 'button', label: 'Manage', disabled: true }] },
          rows: [{ key: 'SSO', value: [{ type: 'text', text: 'Enforced' }, { type: 'button', label: 'Disable', disabled: true }] }],
        },
      ],
    },
  },
};

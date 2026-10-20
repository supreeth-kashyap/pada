import type { Meta, StoryObj } from '@storybook/react-vite';
import { BrandLogo } from './Logo';

const SIZES = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;

const meta = {
  title: 'Display/BrandLogo',
  component: BrandLogo,
  tags: ['autodocs'],
  args: { name: 'airtable', size: 'lg', tooltip: 'Airtable' },
  argTypes: {
    size: { control: 'inline-radio', options: SIZES },
    background: { control: 'boolean' },
  },
} satisfies Meta<typeof BrandLogo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithBackground: Story = { args: { background: true } };
export const Integrations: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12 }}>
      {['airtable', 'figma', 'notion', 'github_issues', 'google_analytics'].map((name) => (
        <BrandLogo key={name} {...args} name={name} tooltip={name} background />
      ))}
    </div>
  ),
};

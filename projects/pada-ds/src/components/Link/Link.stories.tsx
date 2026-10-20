import type { Meta, StoryObj } from '@storybook/react-vite';
import { Link } from './Link';

const meta = {
  title: 'Actions/Link',
  component: Link,
  tags: ['autodocs'],
  args: { href: '#', children: 'migration guide' },
  argTypes: {
    tone: { control: 'inline-radio', options: ['accent', 'neutral'] },
    underline: { control: 'inline-radio', options: ['hover', 'always'] },
  },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Neutral: Story = { args: { tone: 'neutral' } };
export const AlwaysUnderlined: Story = { args: { underline: 'always' } };
export const External: Story = { args: { href: 'https://github.com', external: true, children: 'source on GitHub' } };
export const InText: Story = {
  render: (args) => (
    <p style={{ margin: 0, maxWidth: 420 }}>
      Read the <Link {...args} /> before upgrading to version 2.
    </p>
  ),
};

import type { Meta, StoryObj } from '@storybook/react-vite';
import { CodeSnippet } from './CodeSnippet';

const meta = {
  title: 'Display/CodeSnippet',
  component: CodeSnippet,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    language: 'tsx',
    label: 'Usage',
    code: `import { Button } from 'pada-ds';

export function Save() {
  return <Button variant="primary">Save</Button>;
}`,
  },
  argTypes: { type: { control: 'inline-radio', options: ['micro', 'single-line', 'multi-line'] } },
} satisfies Meta<typeof CodeSnippet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MultiLine: Story = { args: { type: 'multi-line' } };
export const SingleLine: Story = { args: { type: 'single-line', language: 'bash', code: 'npm install pada-ds', label: 'Install' } };
export const Micro: Story = { args: { type: 'micro', language: 'bash', code: 'pada-ds' } };
export const WithoutCopy: Story = { args: { showCopy: false } };

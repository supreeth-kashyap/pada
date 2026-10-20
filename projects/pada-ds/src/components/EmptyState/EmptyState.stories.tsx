import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button';
import { EmptyState } from './EmptyState';

const meta = {
  title: 'Components/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  args: {
    media: 'folder',
    title: 'No projects yet',
    description: 'Create a project to get started.',
    actions: <Button leftIcon="add">New project</Button>,
  },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md'] } },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Small: Story = { args: { size: 'sm', media: 'search', title: 'No results', description: undefined, actions: undefined, headingLevel: 4 } };

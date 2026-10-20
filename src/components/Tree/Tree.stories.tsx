import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Badge } from '../Badge';
import { Tree, type TreeNode } from './Tree';

const files: TreeNode[] = [
  {
    value: 'src',
    label: 'src',
    icon: 'folder',
    children: [
      {
        value: 'components',
        label: 'components',
        icon: 'folder',
        children: [
          { value: 'Button.tsx', label: 'Button.tsx', icon: 'document' },
          { value: 'Card.tsx', label: 'Card.tsx', icon: 'document' },
        ],
      },
      { value: 'index.ts', label: 'index.ts', icon: 'document' },
    ],
  },
  { value: 'package.json', label: 'package.json', icon: 'document' },
  { value: 'secrets', label: '.env (locked)', icon: 'lock', disabled: true },
];

const meta = {
  title: 'Components/Tree',
  component: Tree,
  tags: ['autodocs'],
  args: { 'aria-label': 'Project files', items: files, defaultExpanded: ['src'], onValueChange: fn() },
  decorators: [(Story) => <div style={{ width: 280 }}><Story /></div>],
} satisfies Meta<typeof Tree>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const CustomRows: Story = {
  render: () => (
    <Tree.Root aria-label="Teams">
      <Tree.Item value="design" expandable>
        <Tree.ItemRow icon="team">
          <Tree.ItemLabel>Design</Tree.ItemLabel>
          <Badge size="sm">2</Badge>
        </Tree.ItemRow>
        <Tree.Group>
          <Tree.Item value="ada">
            <Tree.ItemRow icon="user_default"><Tree.ItemLabel>Ada</Tree.ItemLabel></Tree.ItemRow>
          </Tree.Item>
          <Tree.Item value="grace">
            <Tree.ItemRow icon="user_default"><Tree.ItemLabel>Grace</Tree.ItemLabel></Tree.ItemRow>
          </Tree.Item>
        </Tree.Group>
      </Tree.Item>
    </Tree.Root>
  ),
};

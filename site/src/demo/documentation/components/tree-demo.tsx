import DemoPage from '../DemoPage';
import { CodeSnippet } from '@pada/components/CodeSnippet/CodeSnippet';
import { Tree, type TreeNode } from '@pada/components/Tree';

const list = { margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 } as const;

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
          { value: 'button', label: 'Button.tsx', icon: 'document' },
          { value: 'dialog', label: 'Dialog.tsx', icon: 'document' },
        ],
      },
      { value: 'tokens', label: 'tokens.css', icon: 'document' },
      { value: 'index', label: 'index.ts', icon: 'document' },
    ],
  },
  { value: 'docs', label: 'docs', icon: 'folder', children: [{ value: 'guide', label: 'guide.md', icon: 'document' }] },
  { value: 'package', label: 'package.json', icon: 'document' },
  { value: 'lock', label: 'package-lock.json', icon: 'lock', disabled: true },
];

const settings: TreeNode[] = [
  { value: 'account', label: 'Account', children: [{ value: 'profile', label: 'Profile' }, { value: 'security', label: 'Security' }] },
  { value: 'workspace', label: 'Workspace', children: [{ value: 'members', label: 'Members' }, { value: 'billing', label: 'Billing' }] },
];

export default function TreeDemo() {
  return (
    <DemoPage
      title="Tree"
      kind="Component"
      purpose={<p>Tree shows nested items people can expand, collapse and select: file browsers, navigation with sections, nested settings, org charts. Use it when the hierarchy itself matters; for a flat list, use List.</p>}
      design={
        <>
          <p>Rows indent by level with a guide line under each open parent. Chevrons turn as items open, and children slide in. The selection is an accent tint; <code>selectionMode="multiple"</code> allows several.</p>
          <div className="demo-page__showcase" style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 40, alignItems: 'flex-start' }}>
            <div style={{ width: 260 }}>
              <Tree aria-label="Project files" items={files} defaultExpanded={['src', 'components']} defaultValue={['dialog']} />
            </div>
            <div style={{ width: 220 }}>
              <Tree aria-label="Settings" items={settings} selectionMode="multiple" defaultExpanded={['account']} defaultValue={['profile', 'security']} />
            </div>
          </div>
        </>
      }
      developer={
        <>
          <p>Pass nested <code>items</code>, or compose the parts for custom rows. Expansion and selection are controllable (<code>expanded</code> / <code>onExpandedChange</code>, <code>value</code> / <code>onValueChange</code>); mark an item <code>expandable</code> before its children load and fetch them in <code>onExpandedChange</code>.</p>
          <CodeSnippet
            code={`import { Tree } from 'pada-ds';

<Tree aria-label="Project files" items={files} defaultExpanded={['src']} onValueChange={open} />

// Custom rows
<Tree.Root aria-label="Teams">
  <Tree.Item value="design" expandable>
    <Tree.ItemRow icon="team">
      <Tree.ItemLabel>Design</Tree.ItemLabel>
      <Badge>4</Badge>
    </Tree.ItemRow>
    <Tree.Group>…</Tree.Group>
  </Tree.Item>
</Tree.Root>`}
            language="tsx"
            label="Tree usage"
          />
        </>
      }
      accessibility={
        <ul style={list}>
          <li>Follows the WAI-ARIA tree view pattern: <code>tree</code>, <code>treeitem</code> with <code>aria-level</code>, <code>aria-expanded</code> and <code>aria-selected</code>, and <code>group</code> for children.</li>
          <li>One item is in the tab order. <kbd>↑</kbd> / <kbd>↓</kbd> move, <kbd>→</kbd> expands or enters, <kbd>←</kbd> collapses or goes to the parent, <kbd>Home</kbd> / <kbd>End</kbd> jump, <kbd>*</kbd> expands the siblings, and typing jumps to a matching item.</li>
          <li><kbd>Enter</kbd> selects; in multiple mode <kbd>Space</kbd> toggles. Disabled items can be focused but not selected.</li>
        </ul>
      }
    />
  );
}

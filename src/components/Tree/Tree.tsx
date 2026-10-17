import type { ComponentPropsWithRef, ReactNode } from 'react';
import {
  TreeGroup as HeadlessGroup,
  TreeItem as HeadlessItem,
  TreeItemIndicator,
  TreeItemLabel as HeadlessLabel,
  TreeItemRow as HeadlessRow,
  TreeRoot as HeadlessRoot,
  type TreeItemProps,
  type TreeRootProps,
} from '../../headless/Tree/Tree';
import { Icon } from '../Icon';
import './Tree.css';

const cx = (...names: (string | undefined | false)[]) => names.filter(Boolean).join(' ');

export interface TreeNode {
  /** Unique within the tree. */
  value: string;
  label: ReactNode;
  /** Built-in icon name shown before the label. */
  icon?: string;
  children?: TreeNode[];
  disabled?: boolean;
}

/** The tree. Name it with `aria-label` or `aria-labelledby`. */
function TreeRoot({ className, ...props }: TreeRootProps) {
  return <HeadlessRoot {...props} className={cx('tree', className)} />;
}

/** One item. */
function TreeItem({ className, ...props }: TreeItemProps) {
  return <HeadlessItem {...props} className={cx('tree-item', className)} />;
}

export interface TreeItemRowProps extends ComponentPropsWithRef<'div'> {
  /** Built-in icon name shown before the label. */
  icon?: string;
}

/** The item's row: chevron (for expandable items), optional icon, then the label. */
function TreeItemRow({ icon, className, children, ...props }: TreeItemRowProps) {
  return (
    <HeadlessRow {...props} className={cx('tree-row', className)}>
      <TreeItemIndicator className="tree-indicator">
        <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
          <path d="M6 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </TreeItemIndicator>
      {icon && <Icon name={icon} size={16} className="tree-icon" />}
      {children}
    </HeadlessRow>
  );
}

/** The item's name. */
function TreeItemLabel({ className, ...props }: ComponentPropsWithRef<'span'>) {
  return <HeadlessLabel {...props} className={cx('tree-label', className)} />;
}

/** The item's children. */
function TreeGroup({ className, ...props }: ComponentPropsWithRef<'ul'>) {
  return <HeadlessGroup {...props} className={cx('tree-group', className)} />;
}

function TreeNodeItem({ node }: { node: TreeNode }) {
  const expandable = !!node.children?.length;
  return (
    <TreeItem value={node.value} expandable={expandable} disabled={node.disabled}>
      <TreeItemRow icon={node.icon}>
        <TreeItemLabel>{node.label}</TreeItemLabel>
      </TreeItemRow>
      {expandable && (
        <TreeGroup>
          {node.children!.map((child) => (
            <TreeNodeItem key={child.value} node={child} />
          ))}
        </TreeGroup>
      )}
    </TreeItem>
  );
}

export interface TreeProps extends Omit<TreeRootProps, 'children'> {
  /** The items, nested through `children`. */
  items: TreeNode[];
}

/**
 * A tree of items for file browsers, navigation and nested settings (WAI-ARIA APG Tree View).
 * Up/Down move, Right expands or enters, Left collapses or goes up, Home/End jump, `*` expands
 * the siblings, typing jumps to an item. Selection is `single`, `multiple` or `none`.
 *
 * Pass `items`, or compose `Tree.Root`, `Tree.Item`, `Tree.ItemRow`, `Tree.ItemLabel` and
 * `Tree.Group` for custom rows.
 */
export function Tree({ items, ...props }: TreeProps) {
  return (
    <TreeRoot {...props}>
      {items.map((node) => (
        <TreeNodeItem key={node.value} node={node} />
      ))}
    </TreeRoot>
  );
}

Tree.Root = TreeRoot;
Tree.Item = TreeItem;
Tree.ItemRow = TreeItemRow;
Tree.ItemLabel = TreeItemLabel;
Tree.Group = TreeGroup;

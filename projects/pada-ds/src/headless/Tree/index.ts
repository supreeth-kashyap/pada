import { TreeGroup, TreeItem, TreeItemIndicator, TreeItemLabel, TreeItemRow, TreeRoot } from './Tree';

export * from './Tree';

/**
 * Headless tree view (WAI-ARIA APG): Up/Down move, Right expands or enters, Left collapses or
 * goes to the parent, Home/End, `*` expands siblings, type-ahead; single or multiple selection.
 *
 * ```tsx
 * <Tree.Root aria-label="Files" defaultExpanded={['src']}>
 *   <Tree.Item value="src" expandable>
 *     <Tree.ItemRow><Tree.ItemIndicator>▸</Tree.ItemIndicator><Tree.ItemLabel>src</Tree.ItemLabel></Tree.ItemRow>
 *     <Tree.Group>
 *       <Tree.Item value="index.ts">
 *         <Tree.ItemRow><Tree.ItemLabel>index.ts</Tree.ItemLabel></Tree.ItemRow>
 *       </Tree.Item>
 *     </Tree.Group>
 *   </Tree.Item>
 * </Tree.Root>
 * ```
 */
export const Tree = {
  Root: TreeRoot,
  Item: TreeItem,
  ItemRow: TreeItemRow,
  ItemIndicator: TreeItemIndicator,
  ItemLabel: TreeItemLabel,
  Group: TreeGroup,
};

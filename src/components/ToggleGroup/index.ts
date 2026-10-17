import { ToggleGroupItem, ToggleGroupRoot } from './ToggleGroup';

export type { ToggleGroupItemProps, ToggleGroupRootProps } from './ToggleGroup';

/**
 * A segmented set of toggles with one tab stop and arrow-key movement.
 *
 * ```tsx
 * <ToggleGroup.Root type="single" defaultValue="list" aria-label="View">
 *   <ToggleGroup.Item value="list" icon="menu_2">List</ToggleGroup.Item>
 *   <ToggleGroup.Item value="board" icon="area">Board</ToggleGroup.Item>
 * </ToggleGroup.Root>
 * ```
 */
export const ToggleGroup = {
  Root: ToggleGroupRoot,
  Item: ToggleGroupItem,
};

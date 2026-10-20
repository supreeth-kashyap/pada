import { DropdownMenu } from '../DropdownMenu';
import { ContextMenuRoot, ContextMenuTrigger } from './ContextMenu';

export * from './ContextMenu';

/**
 * A menu opened by right-clicking (or Shift+F10, or a long press on) an area, at the pointer.
 * Everything inside is a DropdownMenu part: items with icons and shortcuts, checkbox and radio
 * items, labels, separators and submenus.
 *
 * ```tsx
 * <ContextMenu.Root>
 *   <ContextMenu.Trigger><FileCard /></ContextMenu.Trigger>
 *   <ContextMenu.Content aria-label="File actions">
 *     <ContextMenu.Item icon="edit_1" shortcut="F2" onSelect={rename}>Rename</ContextMenu.Item>
 *     <ContextMenu.Separator />
 *     <ContextMenu.Item tone="danger" onSelect={remove}>Delete</ContextMenu.Item>
 *   </ContextMenu.Content>
 * </ContextMenu.Root>
 * ```
 */
export const ContextMenu = {
  ...DropdownMenu,
  Root: ContextMenuRoot,
  Trigger: ContextMenuTrigger,
};

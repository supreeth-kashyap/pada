import {
  ContextMenuRoot,
  ContextMenuTrigger,
  DropdownMenuRoot,
  DropdownMenuTrigger,
  DropdownMenuPortal,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuItemIndicator,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  MenubarRoot,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
} from './Menu';

export * from './Menu';

/**
 * Headless menu-button parts (WAI-ARIA APG Menu Button).
 *
 * ```tsx
 * <DropdownMenu.Root>
 *   <DropdownMenu.Trigger>Actions</DropdownMenu.Trigger>
 *   <DropdownMenu.Portal>
 *     <DropdownMenu.Content>
 *       <DropdownMenu.Item onSelect={rename}>Rename</DropdownMenu.Item>
 *       <DropdownMenu.CheckboxItem checked={pinned} onCheckedChange={setPinned}>
 *         <DropdownMenu.ItemIndicator>✓</DropdownMenu.ItemIndicator> Pinned
 *       </DropdownMenu.CheckboxItem>
 *       <DropdownMenu.Separator />
 *       <DropdownMenu.Sub>
 *         <DropdownMenu.SubTrigger>Move to</DropdownMenu.SubTrigger>
 *         <DropdownMenu.Portal>
 *           <DropdownMenu.SubContent>…</DropdownMenu.SubContent>
 *         </DropdownMenu.Portal>
 *       </DropdownMenu.Sub>
 *     </DropdownMenu.Content>
 *   </DropdownMenu.Portal>
 * </DropdownMenu.Root>
 * ```
 */
export const DropdownMenu = {
  Root: DropdownMenuRoot,
  Trigger: DropdownMenuTrigger,
  Portal: DropdownMenuPortal,
  Content: DropdownMenuContent,
  Item: DropdownMenuItem,
  CheckboxItem: DropdownMenuCheckboxItem,
  RadioGroup: DropdownMenuRadioGroup,
  RadioItem: DropdownMenuRadioItem,
  ItemIndicator: DropdownMenuItemIndicator,
  Label: DropdownMenuLabel,
  Group: DropdownMenuGroup,
  Separator: DropdownMenuSeparator,
  Sub: DropdownMenuSub,
  SubTrigger: DropdownMenuSubTrigger,
  SubContent: DropdownMenuSubContent,
};

/**
 * Headless context menu: right-click (or Shift+F10, or a long press) on the trigger area opens
 * a menu at the pointer. Its content and items are the DropdownMenu parts.
 *
 * ```tsx
 * <ContextMenu.Root>
 *   <ContextMenu.Trigger>Right-click this card</ContextMenu.Trigger>
 *   <ContextMenu.Portal>
 *     <ContextMenu.Content aria-label="Card actions">
 *       <ContextMenu.Item onSelect={copy}>Copy</ContextMenu.Item>
 *     </ContextMenu.Content>
 *   </ContextMenu.Portal>
 * </ContextMenu.Root>
 * ```
 */
export const ContextMenu = {
  ...DropdownMenu,
  Root: ContextMenuRoot,
  Trigger: ContextMenuTrigger,
};

/**
 * Headless menubar (WAI-ARIA APG Menubar): a row of menus with one Tab stop. Use the
 * DropdownMenu item parts inside each menu's content.
 *
 * ```tsx
 * <Menubar.Root aria-label="Editor">
 *   <Menubar.Menu value="file">
 *     <Menubar.Trigger>File</Menubar.Trigger>
 *     <DropdownMenu.Portal>
 *       <Menubar.Content>
 *         <DropdownMenu.Item onSelect={newFile}>New file</DropdownMenu.Item>
 *       </Menubar.Content>
 *     </DropdownMenu.Portal>
 *   </Menubar.Menu>
 * </Menubar.Root>
 * ```
 */
export const Menubar = {
  Root: MenubarRoot,
  Menu: MenubarMenu,
  Trigger: MenubarTrigger,
  Content: MenubarContent,
};

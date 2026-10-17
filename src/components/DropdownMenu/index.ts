import {
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuRoot,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from './DropdownMenu';

export type {
  DropdownMenuCheckboxItemProps,
  DropdownMenuContentProps,
  DropdownMenuItemProps,
  DropdownMenuRadioGroupProps,
  DropdownMenuRadioItemProps,
  DropdownMenuRootProps,
  DropdownMenuSubContentProps,
  DropdownMenuSubProps,
  DropdownMenuSubTriggerProps,
  DropdownMenuTriggerProps,
} from './DropdownMenu';

/**
 * A menu of actions opened from a button (WAI-ARIA APG Menu Button): arrow keys, Home/End,
 * type-ahead, checkbox and radio items, and submenus. Built on `pada-ds/headless`.
 *
 * ```tsx
 * <DropdownMenu.Root>
 *   <DropdownMenu.Trigger asChild><Button variant="secondary" rightIcon="chevron_down">Actions</Button></DropdownMenu.Trigger>
 *   <DropdownMenu.Content>
 *     <DropdownMenu.Item icon="edit_1" shortcut="⌘E" onSelect={rename}>Rename</DropdownMenu.Item>
 *     <DropdownMenu.CheckboxItem checked={pinned} onCheckedChange={setPinned}>Pinned</DropdownMenu.CheckboxItem>
 *     <DropdownMenu.Separator />
 *     <DropdownMenu.Item tone="danger" onSelect={remove}>Delete</DropdownMenu.Item>
 *   </DropdownMenu.Content>
 * </DropdownMenu.Root>
 * ```
 */
export const DropdownMenu = {
  Root: DropdownMenuRoot,
  Trigger: DropdownMenuTrigger,
  Content: DropdownMenuContent,
  Item: DropdownMenuItem,
  CheckboxItem: DropdownMenuCheckboxItem,
  RadioGroup: DropdownMenuRadioGroup,
  RadioItem: DropdownMenuRadioItem,
  Label: DropdownMenuLabel,
  Group: DropdownMenuGroup,
  Separator: DropdownMenuSeparator,
  Sub: DropdownMenuSub,
  SubTrigger: DropdownMenuSubTrigger,
  SubContent: DropdownMenuSubContent,
};

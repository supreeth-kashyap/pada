import {
  DropdownMenuCheckboxItem,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '../DropdownMenu/DropdownMenu';
import { MenubarContent, MenubarMenu, MenubarRoot, MenubarTrigger } from './Menubar';

export type { MenubarContentProps, MenubarMenuProps, MenubarRootProps, MenubarTriggerProps } from './Menubar';

/**
 * A row of menus, as in a desktop application (WAI-ARIA APG Menubar). One Tab stop; arrow keys
 * move along the bar and between open menus. Items are the DropdownMenu items.
 *
 * ```tsx
 * <Menubar.Root aria-label="Editor">
 *   <Menubar.Menu value="file">
 *     <Menubar.Trigger>File</Menubar.Trigger>
 *     <Menubar.Content>
 *       <Menubar.Item shortcut="⌘N" onSelect={newFile}>New file</Menubar.Item>
 *       <Menubar.Separator />
 *       <Menubar.Item onSelect={close}>Close</Menubar.Item>
 *     </Menubar.Content>
 *   </Menubar.Menu>
 * </Menubar.Root>
 * ```
 */
export const Menubar = {
  Root: MenubarRoot,
  Menu: MenubarMenu,
  Trigger: MenubarTrigger,
  Content: MenubarContent,
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

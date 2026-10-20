import {
  DialogBody,
  DialogClose,
  DialogCloseButton,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from '../Dialog/Dialog';
import { DrawerContent } from './Drawer';

export type { DrawerContentProps, DrawerSide, DrawerSize } from './Drawer';

/**
 * A panel that slides in from an edge of the screen. A dialog underneath: it traps focus,
 * closes on Escape and returns focus to its trigger.
 *
 * ```tsx
 * <Drawer.Root>
 *   <Drawer.Trigger asChild><Button>Filters</Button></Drawer.Trigger>
 *   <Drawer.Content side="right" size="md">
 *     <Drawer.Header><Drawer.Title>Filters</Drawer.Title></Drawer.Header>
 *     <Drawer.Body>…</Drawer.Body>
 *     <Drawer.CloseButton />
 *   </Drawer.Content>
 * </Drawer.Root>
 * ```
 */
export const Drawer = {
  Root: DialogRoot,
  Trigger: DialogTrigger,
  Content: DrawerContent,
  Header: DialogHeader,
  Title: DialogTitle,
  Description: DialogDescription,
  Body: DialogBody,
  Footer: DialogFooter,
  Close: DialogClose,
  CloseButton: DialogCloseButton,
};

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
import { SheetContent } from './Sheet';

export type { SheetContentProps } from './Sheet';

/**
 * A bottom sheet for mobile-first flows. A dialog underneath (focus trap, Escape, focus return),
 * with drag to dismiss and optional snap points.
 *
 * ```tsx
 * <Sheet.Root>
 *   <Sheet.Trigger asChild><Button>Share</Button></Sheet.Trigger>
 *   <Sheet.Content snapPoints={[0.5, 0.9]}>
 *     <Sheet.Header><Sheet.Title>Share</Sheet.Title></Sheet.Header>
 *     <Sheet.Body>…</Sheet.Body>
 *   </Sheet.Content>
 * </Sheet.Root>
 * ```
 */
export const Sheet = {
  Root: DialogRoot,
  Trigger: DialogTrigger,
  Content: SheetContent,
  Header: DialogHeader,
  Title: DialogTitle,
  Description: DialogDescription,
  Body: DialogBody,
  Footer: DialogFooter,
  Close: DialogClose,
  CloseButton: DialogCloseButton,
};

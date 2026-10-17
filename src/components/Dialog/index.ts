import {
  DialogBody,
  DialogClose,
  DialogCloseButton,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from './Dialog';

export type {
  DialogCloseButtonProps,
  DialogContentProps,
  DialogRootProps,
  DialogSectionProps,
  DialogSize,
  DialogTriggerProps,
} from './Dialog';

/**
 * A modal (or non-modal) dialog, styled. Built on `Dialog` from `pada-ds/headless`.
 *
 * ```tsx
 * <Dialog.Root>
 *   <Dialog.Trigger asChild><Button>Edit profile</Button></Dialog.Trigger>
 *   <Dialog.Content size="md">
 *     <Dialog.Header>
 *       <Dialog.Title>Edit profile</Dialog.Title>
 *       <Dialog.Description>Changes save automatically.</Dialog.Description>
 *     </Dialog.Header>
 *     <Dialog.Body>…</Dialog.Body>
 *     <Dialog.Footer>
 *       <Dialog.Close asChild><Button variant="secondary">Cancel</Button></Dialog.Close>
 *     </Dialog.Footer>
 *     <Dialog.CloseButton />
 *   </Dialog.Content>
 * </Dialog.Root>
 * ```
 */
export const Dialog = {
  Root: DialogRoot,
  Trigger: DialogTrigger,
  Content: DialogContent,
  Header: DialogHeader,
  Title: DialogTitle,
  Description: DialogDescription,
  Body: DialogBody,
  Footer: DialogFooter,
  Close: DialogClose,
  CloseButton: DialogCloseButton,
};

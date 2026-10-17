import {
  DialogRoot,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from './Dialog';

export * from './Dialog';

/**
 * Headless dialog parts. Compose them; style with your own classes and `data-state`.
 *
 * ```tsx
 * <Dialog.Root>
 *   <Dialog.Trigger>Edit profile</Dialog.Trigger>
 *   <Dialog.Portal>
 *     <Dialog.Overlay className="overlay" />
 *     <Dialog.Content className="panel">
 *       <Dialog.Title>Edit profile</Dialog.Title>
 *       <Dialog.Description>Changes save automatically.</Dialog.Description>
 *       <Dialog.Close>Done</Dialog.Close>
 *     </Dialog.Content>
 *   </Dialog.Portal>
 * </Dialog.Root>
 * ```
 */
export const Dialog = {
  Root: DialogRoot,
  Trigger: DialogTrigger,
  Portal: DialogPortal,
  Overlay: DialogOverlay,
  Content: DialogContent,
  Title: DialogTitle,
  Description: DialogDescription,
  Close: DialogClose,
};

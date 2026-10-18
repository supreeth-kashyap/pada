import { DialogDescription, DialogFooter, DialogHeader, DialogRoot, DialogTitle, DialogTrigger } from '../Dialog/Dialog';
import { AlertDialogAction, AlertDialogCancel, AlertDialogContent } from './AlertDialog';

export type { AlertDialogContentProps } from './AlertDialog';

/**
 * A confirmation that needs an answer before the user continues (WAI-ARIA APG Alert Dialog).
 *
 * ```tsx
 * <AlertDialog.Root>
 *   <AlertDialog.Trigger asChild><Button variant="destructive">Delete project</Button></AlertDialog.Trigger>
 *   <AlertDialog.Content>
 *     <AlertDialog.Header>
 *       <AlertDialog.Title>Delete this project?</AlertDialog.Title>
 *       <AlertDialog.Description>This cannot be undone.</AlertDialog.Description>
 *     </AlertDialog.Header>
 *     <AlertDialog.Footer>
 *       <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
 *       <AlertDialog.Action variant="destructive" onClick={remove}>Delete</AlertDialog.Action>
 *     </AlertDialog.Footer>
 *   </AlertDialog.Content>
 * </AlertDialog.Root>
 * ```
 */
export const AlertDialog = {
  Root: DialogRoot,
  Trigger: DialogTrigger,
  Content: AlertDialogContent,
  Header: DialogHeader,
  Title: DialogTitle,
  Description: DialogDescription,
  Footer: DialogFooter,
  Cancel: AlertDialogCancel,
  Action: AlertDialogAction,
};

import type { RefObject } from 'react';
import { createPartContext } from '../utils/context';

export interface DialogContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  modal: boolean;
  triggerRef: RefObject<HTMLButtonElement | null>;
  contentId: string;
  titleId: string;
  descriptionId: string;
  hasTitle: boolean;
  setHasTitle: (value: boolean) => void;
  hasDescription: boolean;
  setHasDescription: (value: boolean) => void;
}

export const [DialogProvider, useDialogContext] = createPartContext<DialogContextValue>('Dialog.Root');

/**
 * The nearest `Dialog.Root`'s open state and setter, for building custom parts (a sheet that
 * closes when dragged down, a "Save and close" action that waits for a request).
 */
export function useDialog() {
  const { open, setOpen } = useDialogContext('useDialog');
  return { open, setOpen };
}

import { createContext, type KeyboardEvent } from 'react';

interface ListContextValue {
  draggable: boolean;
  onMove: (sourceId: string, targetId: string) => void;
  /** Item ids in their current order. */
  order: string[];
  /** Id of the item lifted with the keyboard, if any. */
  liftedId: string | null;
  /** Keyboard reordering on an item's handle. */
  onHandleKey: (id: string, label: string, event: KeyboardEvent<HTMLButtonElement>) => void;
  /** Ends a keyboard lift when focus leaves the handle. */
  onHandleBlur: (id: string) => void;
}

export const ListContext = createContext<ListContextValue | null>(null);

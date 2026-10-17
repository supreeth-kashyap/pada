import { createContext } from 'react';

interface ListContextValue {
  draggable: boolean;
  onMove: (sourceId: string, targetId: string) => void;
}

export const ListContext = createContext<ListContextValue | null>(null);

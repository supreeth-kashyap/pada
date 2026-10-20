import { createContext } from 'react';
import type { TableColumn } from './Table';

interface TableContextValue {
  columns: TableColumn[];
  gridTemplate: string;
  updateColumnWidth: (id: string, width: number) => void;
  reorderColumns: (sourceId: string, targetId: string) => void;
}

export const TableContext = createContext<TableContextValue | null>(null);

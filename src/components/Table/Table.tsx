import React, { createContext, useEffect, useMemo, useState } from 'react';
import './Table.css';

export interface TableColumn {
  id: string;
  label: string;
  width?: number;
  minWidth?: number;
}

interface TableContextValue {
  columns: TableColumn[];
  gridTemplate: string;
  updateColumnWidth: (id: string, width: number) => void;
  reorderColumns: (sourceId: string, targetId: string) => void;
}

export const TableContext = createContext<TableContextValue | null>(null);

export interface TableProps {
  columns: TableColumn[];
  children: React.ReactNode;
  toolbar?: React.ReactNode;
  className?: string;
  onColumnsChange?: (columns: TableColumn[]) => void;
}

export const Table: React.FC<TableProps> = ({
  columns,
  children,
  toolbar,
  className = '',
  onColumnsChange
}) => {
  const [columnState, setColumnState] = useState<TableColumn[]>(columns);

  useEffect(() => {
    setColumnState(columns);
  }, [columns]);

  const gridTemplate = useMemo(() => {
    return columnState
      .map((column) => (column.width ? `${column.width}px` : '1fr'))
      .join(' ');
  }, [columnState]);

  const updateColumnWidth = (id: string, width: number) => {
    setColumnState((prev) => {
      const next = prev.map((column) =>
        column.id === id
          ? { ...column, width: Math.max(column.minWidth ?? 80, width) }
          : column
      );
      onColumnsChange?.(next);
      return next;
    });
  };

  const reorderColumns = (sourceId: string, targetId: string) => {
    if (sourceId === targetId) return;
    setColumnState((prev) => {
      const sourceIndex = prev.findIndex((column) => column.id === sourceId);
      const targetIndex = prev.findIndex((column) => column.id === targetId);
      if (sourceIndex === -1 || targetIndex === -1) return prev;
      const next = [...prev];
      const [moved] = next.splice(sourceIndex, 1);
      next.splice(targetIndex, 0, moved);
      onColumnsChange?.(next);
      return next;
    });
  };

  return (
    <div className={`table ${className}`.trim()}>
      {toolbar && <div className="table__toolbar">{toolbar}</div>}
      <TableContext.Provider value={{ columns: columnState, gridTemplate, updateColumnWidth, reorderColumns }}>
        <div className="table__content">{children}</div>
      </TableContext.Provider>
    </div>
  );
};

import React, { Children, isValidElement, useEffect, useMemo, useState } from 'react';
import { TablePagination } from './Pagination';
import { TableContext } from './TableContext';
import './Table.css';

export interface TableColumn {
  id: string;
  label: string;
  width?: number;
  minWidth?: number;
}


export interface TableProps {
  columns: TableColumn[];
  /** `TableRow`s (the first one of `HeaderCell`s), then optionally a `TablePagination`. */
  children: React.ReactNode;
  toolbar?: React.ReactNode;
  className?: string;
  onColumnsChange?: (columns: TableColumn[]) => void;
  /** Accessible name of the table. */
  label?: string;
  /** Id of the element that names the table (instead of `label`). */
  labelledBy?: string;
}

export const Table: React.FC<TableProps> = ({
  columns,
  children,
  toolbar,
  className = '',
  onColumnsChange,
  label,
  labelledBy,
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

  // Pagination sits under the rows but is not part of the table's row structure.
  const items = Children.toArray(children);
  const isPagination = (child: React.ReactNode) => isValidElement(child) && child.type === TablePagination;

  return (
    <div className={`table ${className}`.trim()}>
      {toolbar && <div className="table__toolbar">{toolbar}</div>}
      <TableContext.Provider value={{ columns: columnState, gridTemplate, updateColumnWidth, reorderColumns }}>
        <div className="table__content">
          <div className="table__grid" role="table" aria-label={label} aria-labelledby={labelledBy}>
            {items.filter((child) => !isPagination(child))}
          </div>
          {items.filter(isPagination)}
        </div>
      </TableContext.Provider>
    </div>
  );
};

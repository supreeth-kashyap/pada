import React, { useContext } from 'react';
import './TableRow.css';
import { TableContext } from '../Table';
import type { TableCellProps } from '../Cells';

export interface TableRowProps {
  children: React.ReactNode;
  className?: string;
}

export const TableRow: React.FC<TableRowProps> = ({ children, className = '' }) => {
  const context = useContext(TableContext);
  const gridTemplate = context?.gridTemplate ?? '';
  const columns = context?.columns ?? [];

  const cells = React.Children.toArray(children) as React.ReactElement<TableCellProps>[];
  const cellMap = new Map<string, React.ReactElement<TableCellProps>>();
  const unnamedCells: React.ReactElement<TableCellProps>[] = [];

  cells.forEach((cell) => {
    if (cell.props.columnId) {
      cellMap.set(cell.props.columnId, cell);
    } else {
      unnamedCells.push(cell);
    }
  });

  const orderedCells = columns.map((column) => cellMap.get(column.id)).filter(Boolean) as React.ReactElement[];
  const finalCells = [...orderedCells, ...unnamedCells];

  return (
    <div className={`table-row ${className}`.trim()} style={{ gridTemplateColumns: gridTemplate }}>
      {finalCells}
    </div>
  );
};

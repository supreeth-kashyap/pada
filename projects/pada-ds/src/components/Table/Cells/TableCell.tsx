import React from 'react';
import './TableCell.css';

export interface TableCellProps {
  children: React.ReactNode;
  columnId?: string;
  className?: string;
  /** Marks the cell as the header of its row (`role="rowheader"`), e.g. a name column. */
  rowHeader?: boolean;
  /** Columns the cell spans; `'all'` for a full-width cell such as an empty-state message. */
  span?: number | 'all';
}

export const TableCell: React.FC<TableCellProps> = ({ children, className = '', rowHeader, span }) => {
  return (
    <div
      role={rowHeader ? 'rowheader' : 'cell'}
      className={`table-cell ${className}`.trim()}
      style={span ? { gridColumn: span === 'all' ? '1 / -1' : `span ${span}` } : undefined}
    >
      {children}
    </div>
  );
};

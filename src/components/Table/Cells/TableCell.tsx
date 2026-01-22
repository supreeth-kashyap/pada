import React from 'react';
import './TableCell.css';

export interface TableCellProps {
  children: React.ReactNode;
  columnId?: string;
  className?: string;
}

export const TableCell: React.FC<TableCellProps> = ({ children, className = '' }) => {
  return (
    <div className={`table-cell ${className}`.trim()}>
      {children}
    </div>
  );
};

import React from 'react';
import './TablePagination.css';
import { Icon } from '../../Icon';

export interface TablePaginationProps {
  total: number;
  page: number;
  rowsPerPage: number;
  rowsPerPageOptions?: number[];
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
  className?: string;
}

export const TablePagination: React.FC<TablePaginationProps> = ({
  total,
  page,
  rowsPerPage,
  rowsPerPageOptions = [10, 25, 50, 100],
  onPageChange,
  onRowsPerPageChange,
  className = ''
}) => {
  const totalPages = Math.max(1, Math.ceil(total / rowsPerPage));
  const start = total === 0 ? 0 : (page - 1) * rowsPerPage + 1;
  const end = Math.min(page * rowsPerPage, total);
  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className={`table-pagination ${className}`.trim()}>
      <div className="table-pagination__left">
        <span className="table-pagination__label">Rows per page</span>
        <div className="table-pagination__select">
          <select
            value={rowsPerPage}
            onChange={(event) => onRowsPerPageChange(Number(event.target.value))}
          >
            {rowsPerPageOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <Icon name="chevron_down" size={12} color="var(--color-neutral-600)" />
        </div>
      </div>

      <div className="table-pagination__right">
        <span className="table-pagination__range">
          <span className="table-pagination__range-strong">{start}-{end}</span> of {total}
        </span>
        <div className="table-pagination__nav">
          <button
            type="button"
            className="table-pagination__nav-button"
            disabled={!canPrev}
            onClick={() => onPageChange(page - 1)}
            aria-label="Previous page"
          >
            <Icon name="chevron_left" size={12} color="var(--color-neutral-600)" />
          </button>
          <button
            type="button"
            className="table-pagination__nav-button"
            disabled={!canNext}
            onClick={() => onPageChange(page + 1)}
            aria-label="Next page"
          >
            <Icon name="chevron_right" size={12} color="var(--color-neutral-600)" />
          </button>
        </div>
      </div>
    </div>
  );
};

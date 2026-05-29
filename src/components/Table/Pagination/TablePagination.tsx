import React from 'react';
import './TablePagination.css';
import { SegmentControl } from '../../SegmentControl';
import { Button } from '../../Button';

/**
 * Payload passed to interaction callbacks so the consumer always has full
 * context (which page, which page-size, the resulting visible range, totals).
 * Saves callers from re-deriving these values on every change.
 */
export interface TablePaginationContext {
  /** New active page (1-indexed). */
  page: number;
  /** Current rows-per-page selection. */
  rowsPerPage: number;
  /** Total number of records across all pages. */
  total: number;
  /** Total number of pages given `rowsPerPage` and `total`. */
  totalPages: number;
  /** First row index shown on the current page (1-indexed). */
  rangeStart: number;
  /** Last row index shown on the current page (1-indexed). */
  rangeEnd: number;
}

export interface TablePaginationProps {
  total: number;
  page: number;
  rowsPerPage: number;
  rowsPerPageOptions?: number[];
  /** Fires when the user clicks Previous / Next. */
  onPageChange: (page: number, context: TablePaginationContext) => void;
  /** Fires when the user picks a new page-size. Page resets to 1. */
  onRowsPerPageChange: (rowsPerPage: number, context: TablePaginationContext) => void;
  /** Fires when the user clicks the Next chevron. Convenience alias for filtering page changes. */
  onNextPage?: (context: TablePaginationContext) => void;
  /** Fires when the user clicks the Previous chevron. */
  onPrevPage?: (context: TablePaginationContext) => void;
  className?: string;
}

export const TablePagination: React.FC<TablePaginationProps> = ({
  total,
  page,
  rowsPerPage,
  rowsPerPageOptions = [25, 50, 100],
  onPageChange,
  onRowsPerPageChange,
  onNextPage,
  onPrevPage,
  className = ''
}) => {
  const totalPages = Math.max(1, Math.ceil(total / rowsPerPage));
  const rangeStart = total === 0 ? 0 : (page - 1) * rowsPerPage + 1;
  const rangeEnd = Math.min(page * rowsPerPage, total);
  const canPrev = page > 1;
  const canNext = page < totalPages;

  const buildContext = (nextPage: number, nextRpp: number): TablePaginationContext => {
    const tp = Math.max(1, Math.ceil(total / nextRpp));
    return {
      page: nextPage,
      rowsPerPage: nextRpp,
      total,
      totalPages: tp,
      rangeStart: total === 0 ? 0 : (nextPage - 1) * nextRpp + 1,
      rangeEnd: Math.min(nextPage * nextRpp, total),
    };
  };

  const handlePrev = () => {
    if (!canPrev) return;
    const next = page - 1;
    const ctx = buildContext(next, rowsPerPage);
    onPrevPage?.(ctx);
    onPageChange(next, ctx);
  };

  const handleNext = () => {
    if (!canNext) return;
    const next = page + 1;
    const ctx = buildContext(next, rowsPerPage);
    onNextPage?.(ctx);
    onPageChange(next, ctx);
  };

  const handleRowsPerPageChange = (nextValue: string) => {
    const nextRpp = Number(nextValue);
    // Picking a new page size resets to page 1 so the user doesn't land on
    // an empty page if total / rowsPerPage shrinks below the current page.
    onRowsPerPageChange(nextRpp, buildContext(1, nextRpp));
  };

  // Map the numeric `rowsPerPageOptions` into the shape `SegmentControl`
  // expects (string values + labels).
  const segmentOptions = rowsPerPageOptions.map((option) => ({
    value: String(option),
    label: String(option),
  }));

  return (
    <div className={`table-pagination ${className}`.trim()}>
      <div className="table-pagination__left">
        <span className="table-pagination__label">Show</span>
        {/* Reuse the design-system SegmentControl for the page-size picker.
            Compact, in-place toggle that avoids the Select dropdown's
            min-width. */}
        <SegmentControl
          options={segmentOptions}
          value={String(rowsPerPage)}
          onChange={handleRowsPerPageChange}
        />
      </div>

      <div className="table-pagination__right">
        <span className="table-pagination__range">
          {rangeStart}-{rangeEnd} of {total}
        </span>
        <div className="table-pagination__nav">
          <Button
            variant="ghost"
            leftIcon="keyboard_arrow_left"
            disabled={!canPrev}
            onClick={handlePrev}
            aria-label="Previous page"
          />
          <Button
            variant="ghost"
            leftIcon="keyboard_arrow_right"
            disabled={!canNext}
            onClick={handleNext}
            aria-label="Next page"
          />
        </div>
      </div>
    </div>
  );
};

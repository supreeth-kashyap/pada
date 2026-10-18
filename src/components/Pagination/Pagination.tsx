import type { ComponentPropsWithRef } from 'react';
import { Icon } from '../Icon';
import { paginationRange } from './paginationRange';
import './Pagination.css';

export interface PaginationProps extends Omit<ComponentPropsWithRef<'nav'>, 'onChange'> {
  /** Current page, starting at 1. */
  page: number;
  /** Number of pages. */
  totalPages: number;
  /** Called with the requested page. */
  onPageChange: (page: number) => void;
  /** Pages shown on each side of the current one. */
  siblingCount?: number;
  /** Pages always shown at each end. */
  boundaryCount?: number;
  /** Accessible name of the navigation landmark. */
  label?: string;
}

/** Page navigation: previous, numbered pages with ellipses, next. The current page has `aria-current`. */
export function Pagination({ page, totalPages, onPageChange, siblingCount = 1, boundaryCount = 1, label = 'Pagination', className, ...props }: PaginationProps) {
  const entries = paginationRange(page, totalPages, siblingCount, boundaryCount);
  return (
    <nav aria-label={label} {...props} className={['pagination', className].filter(Boolean).join(' ')}>
      <ul className="pagination-list">
        <li>
          <button type="button" className="pagination-step" aria-label="Previous page" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
            <Icon name="chevron_left" size={14} aria-hidden="true" />
          </button>
        </li>
        {entries.map((entry) => (
          <li key={entry}>
            {typeof entry === 'number' ? (
              <button
                type="button"
                className="pagination-page"
                aria-label={`Page ${entry}`}
                aria-current={entry === page ? 'page' : undefined}
                onClick={() => onPageChange(entry)}
              >
                {entry}
              </button>
            ) : (
              <span className="pagination-ellipsis" aria-hidden="true">
                …
              </span>
            )}
          </li>
        ))}
        <li>
          <button type="button" className="pagination-step" aria-label="Next page" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
            <Icon name="chevron_right" size={14} aria-hidden="true" />
          </button>
        </li>
      </ul>
    </nav>
  );
}

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Pagination } from './Pagination';
import { paginationRange } from './paginationRange';

describe('paginationRange', () => {
  it('shows every page when there is room', () => {
    expect(paginationRange(1, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(paginationRange(4, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it('collapses gaps into ellipses around the current page', () => {
    expect(paginationRange(1, 20)).toEqual([1, 2, 3, 4, 5, 'ellipsis-end', 20]);
    expect(paginationRange(10, 20)).toEqual([1, 'ellipsis-start', 9, 10, 11, 'ellipsis-end', 20]);
    expect(paginationRange(20, 20)).toEqual([1, 'ellipsis-start', 16, 17, 18, 19, 20]);
  });

  it('never hides a single page behind an ellipsis', () => {
    expect(paginationRange(4, 20)).toEqual([1, 2, 3, 4, 5, 'ellipsis-end', 20]);
    expect(paginationRange(17, 20)).toEqual([1, 'ellipsis-start', 16, 17, 18, 19, 20]);
  });
});

describe('Pagination', () => {
  it('marks the current page and moves with previous and next', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination page={1} totalPages={10} onPageChange={onPageChange} />);
    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Page 1' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
    await user.click(screen.getByRole('button', { name: 'Next page' }));
    expect(onPageChange).toHaveBeenCalledWith(2);
    await user.click(screen.getByRole('button', { name: 'Page 10' }));
    expect(onPageChange).toHaveBeenLastCalledWith(10);
  });
});

export type PaginationEntry = number | 'ellipsis-start' | 'ellipsis-end';

/**
 * The page numbers to show, with ellipses for gaps: `[1, 'ellipsis-start', 4, 5, 6, 'ellipsis-end', 20]`.
 * Always shows `boundaryCount` pages at each end and `siblingCount` pages on each side of the
 * current one. A gap of a single page shows that page instead of an ellipsis.
 */
export function paginationRange(page: number, totalPages: number, siblingCount = 1, boundaryCount = 1): PaginationEntry[] {
  const range = (start: number, end: number) => Array.from({ length: Math.max(0, end - start + 1) }, (_, index) => start + index);
  const total = Math.max(1, totalPages);
  const current = Math.min(Math.max(1, page), total);
  // Pages shown if nothing were collapsed: boundaries + siblings + current + two ellipses.
  if (total <= 2 * boundaryCount + 2 * siblingCount + 3) return range(1, total);

  const start = range(1, boundaryCount);
  const end = range(total - boundaryCount + 1, total);
  const siblingsStart = Math.max(Math.min(current - siblingCount, total - boundaryCount - siblingCount * 2 - 1), boundaryCount + 2);
  const siblingsEnd = Math.min(Math.max(current + siblingCount, boundaryCount + siblingCount * 2 + 2), total - boundaryCount - 1);

  return [
    ...start,
    ...(siblingsStart > boundaryCount + 2 ? (['ellipsis-start'] as const) : boundaryCount + 1 < total - boundaryCount ? [boundaryCount + 1] : []),
    ...range(siblingsStart, siblingsEnd),
    ...(siblingsEnd < total - boundaryCount - 1 ? (['ellipsis-end'] as const) : total - boundaryCount > boundaryCount ? [total - boundaryCount] : []),
    ...end,
  ];
}

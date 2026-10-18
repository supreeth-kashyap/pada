import { useCallback, useMemo } from 'react';
import { useControllableState } from '../utils/useControllableState';

export type DataTableSortDirection = 'ascending' | 'descending';

export interface DataTableSort {
  columnId: string;
  direction: DataTableSortDirection;
}

export interface DataTableColumnDef<T> {
  id: string;
  /** The value sorted and searched on: a key of the row or a function. @default row[id] */
  accessor?: keyof T | ((row: T) => unknown);
  /** @default true */
  sortable?: boolean;
  /** Custom comparison for ascending order. */
  sortFn?: (a: T, b: T) => number;
  /** Include the column in the global search. @default true */
  searchable?: boolean;
  /** Let people hide the column. @default true */
  hideable?: boolean;
}

export interface UseDataTableOptions<T> {
  data: T[];
  columns: DataTableColumnDef<T>[];
  /** Stable id per row, for selection. @default row.id, else the index */
  getRowId?: (row: T, index: number) => string;
  sort?: DataTableSort | null;
  defaultSort?: DataTableSort | null;
  onSortChange?: (sort: DataTableSort | null) => void;
  /** Global search text. */
  search?: string;
  defaultSearch?: string;
  onSearchChange?: (search: string) => void;
  /** Custom search match. @default case-insensitive "contains" over searchable columns */
  searchFn?: (row: T, query: string) => boolean;
  selectedIds?: string[];
  defaultSelectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  hiddenColumns?: string[];
  defaultHiddenColumns?: string[];
  onHiddenColumnsChange?: (ids: string[]) => void;
  /** Current page, starting at 1. */
  page?: number;
  defaultPage?: number;
  onPageChange?: (page: number) => void;
  pageSize?: number;
  /** @default 10 */
  defaultPageSize?: number;
  onPageSizeChange?: (pageSize: number) => void;
  /**
   * The data is already sorted, searched and paged (by a server): only selection, column
   * visibility and the state callbacks apply. Pass `rowCount` for the total.
   */
  manual?: boolean;
  /** Total rows across all pages, when `manual`. */
  rowCount?: number;
}

export interface DataTableRow<T> {
  id: string;
  index: number;
  original: T;
}

const read = <T,>(row: T, column: DataTableColumnDef<T>): unknown =>
  typeof column.accessor === 'function'
    ? column.accessor(row)
    : (row as Record<string, unknown>)[(column.accessor as string | undefined) ?? column.id];

const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

const isBlank = (value: unknown) => value === null || value === undefined || value === '';

/** Text a cell value is searched by: dates as YYYY-MM-DD, everything else as a string. */
const searchText = (value: unknown) => (value instanceof Date ? value.toISOString().slice(0, 10) : String(value ?? '')).toLowerCase();

/** Ascending order for mixed cell values: numbers and dates by value, text naturally, blanks last. */
export function compareValues(a: unknown, b: unknown): number {
  if (isBlank(a) || isBlank(b)) return isBlank(a) === isBlank(b) ? 0 : isBlank(a) ? 1 : -1;
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  if (typeof a === 'boolean' && typeof b === 'boolean') return Number(a) - Number(b);
  return collator.compare(String(a), String(b));
}

/**
 * State and derived rows for a data table: sorting, global search, row selection, column
 * visibility and paging, each controlled or uncontrolled. Renders nothing; pair it with your own
 * table markup or use the styled `DataTable`.
 */
export function useDataTable<T>(options: UseDataTableOptions<T>) {
  const { data, columns, getRowId, manual = false } = options;
  const [sort, setSort] = useControllableState<DataTableSort | null>({ prop: options.sort, defaultProp: options.defaultSort ?? null, onChange: options.onSortChange });
  const [search, setSearchState] = useControllableState({ prop: options.search, defaultProp: options.defaultSearch ?? '', onChange: options.onSearchChange });
  const [selectedIds, setSelectedIds] = useControllableState({ prop: options.selectedIds, defaultProp: options.defaultSelectedIds ?? [], onChange: options.onSelectionChange });
  const [hiddenColumns, setHiddenColumns] = useControllableState({ prop: options.hiddenColumns, defaultProp: options.defaultHiddenColumns ?? [], onChange: options.onHiddenColumnsChange });
  const [page, setPageState] = useControllableState({ prop: options.page, defaultProp: options.defaultPage ?? 1, onChange: options.onPageChange });
  const [pageSize, setPageSizeState] = useControllableState({ prop: options.pageSize, defaultProp: options.defaultPageSize ?? 10, onChange: options.onPageSizeChange });

  const allRows = useMemo<DataTableRow<T>[]>(
    () => data.map((row, index) => ({ id: getRowId?.(row, index) ?? String((row as { id?: unknown }).id ?? index), index, original: row })),
    [data, getRowId],
  );

  const processed = useMemo(() => {
    if (manual) return allRows;
    let rows = allRows;
    const query = search.trim().toLowerCase();
    if (query) {
      const searchFn = options.searchFn;
      const searchable = columns.filter((column) => column.searchable !== false);
      rows = rows.filter(({ original }) =>
        searchFn ? searchFn(original, query) : searchable.some((column) => searchText(read(original, column)).includes(query)),
      );
    }
    const column = sort && columns.find((candidate) => candidate.id === sort.columnId);
    if (sort && column) {
      const factor = sort.direction === 'ascending' ? 1 : -1;
      const compare = (a: T, b: T) => {
        if (column.sortFn) return column.sortFn(a, b) * factor;
        const [first, second] = [read(a, column), read(b, column)];
        // Blank cells stay at the end in both directions.
        if (isBlank(first) || isBlank(second)) return compareValues(first, second);
        return compareValues(first, second) * factor;
      };
      // Stable: ties keep their original order.
      rows = [...rows].sort((a, b) => compare(a.original, b.original) || a.index - b.index);
    }
    return rows;
  }, [allRows, manual, search, sort, columns, options.searchFn]);

  const total = manual ? (options.rowCount ?? allRows.length) : processed.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(Math.max(1, page), pageCount);
  const rows = manual ? processed : processed.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const setPage = useCallback((next: number) => setPageState(Math.max(1, next)), [setPageState]);
  const setSearch = useCallback(
    (next: string) => {
      setSearchState(next);
      // A new search starts from its first page.
      setPageState(1);
    },
    [setSearchState, setPageState],
  );
  const setPageSize = useCallback(
    (next: number) => {
      setPageSizeState(next);
      setPageState(1);
    },
    [setPageSizeState, setPageState],
  );

  const getSortDirection = (columnId: string): DataTableSortDirection | 'none' => (sort?.columnId === columnId ? sort.direction : 'none');
  /** Cycles a column through ascending, descending and unsorted. */
  const toggleSort = (columnId: string) => {
    const current = getSortDirection(columnId);
    setSort(current === 'none' ? { columnId, direction: 'ascending' } : current === 'ascending' ? { columnId, direction: 'descending' } : null);
  };

  const selected = new Set(selectedIds);
  const isSelected = (id: string) => selected.has(id);
  const toggleRow = (id: string) => setSelectedIds(selected.has(id) ? selectedIds.filter((value) => value !== id) : [...selectedIds, id]);
  const pageIds = rows.map((row) => row.id);
  const selectedOnPage = pageIds.filter((id) => selected.has(id)).length;
  const pageSelection: 'all' | 'some' | 'none' =
    pageIds.length > 0 && selectedOnPage === pageIds.length ? 'all' : selectedOnPage > 0 ? 'some' : 'none';
  /** Selects every row on the page, or clears them when they are all selected. */
  const togglePage = () =>
    setSelectedIds(pageSelection === 'all' ? selectedIds.filter((id) => !pageIds.includes(id)) : [...new Set([...selectedIds, ...pageIds])]);
  const clearSelection = () => setSelectedIds([]);
  const selectedRows = allRows.filter((row) => selected.has(row.id)).map((row) => row.original);

  const hidden = new Set(hiddenColumns);
  const isColumnVisible = (columnId: string) => !hidden.has(columnId);
  const toggleColumn = (columnId: string) =>
    setHiddenColumns(hidden.has(columnId) ? hiddenColumns.filter((id) => id !== columnId) : [...hiddenColumns, columnId]);
  const visibleColumns = columns.filter((column) => !hidden.has(column.id));

  return {
    rows,
    total,
    visibleColumns,
    sort,
    setSort,
    getSortDirection,
    toggleSort,
    search,
    setSearch,
    selectedIds,
    selectedRows,
    setSelectedIds,
    isSelected,
    toggleRow,
    pageSelection,
    togglePage,
    clearSelection,
    hiddenColumns,
    isColumnVisible,
    toggleColumn,
    page: currentPage,
    setPage,
    pageSize,
    setPageSize,
    pageCount,
  };
}

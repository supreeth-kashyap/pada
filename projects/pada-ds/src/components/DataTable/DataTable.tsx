import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useDataTable, type DataTableColumnDef, type UseDataTableOptions } from '../../headless/DataTable/useDataTable';
import { VisuallyHidden } from '../../headless/utils/VisuallyHidden';
import { Button } from '../Button';
import { Checkbox } from '../Checkbox';
import { DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRoot, DropdownMenuTrigger } from '../DropdownMenu/DropdownMenu';
import { SearchField } from '../SearchField';
import { Table, TableCell, TableRow, HeaderCell, TablePagination, type TableColumn } from '../Table';
import './DataTable.css';

export interface DataTableColumn<T> extends DataTableColumnDef<T> {
  /** Column heading. */
  header: string;
  /** Renders the cell. @default the accessor's value as text */
  cell?: (row: T) => ReactNode;
  /** Width in px; columns without one share the remaining space. */
  width?: number;
  minWidth?: number;
  /** Cells in this column name their row (`role="rowheader"`), e.g. a name column. */
  rowHeader?: boolean;
}

export interface DataTableProps<T> extends Omit<UseDataTableOptions<T>, 'columns'> {
  columns: DataTableColumn<T>[];
  /** Accessible name of the table, e.g. "Team members". */
  label: string;
  /** Adds a checkbox column for selecting rows. */
  selectable?: boolean;
  /** Shows a search field that filters every searchable column. @default true */
  searchable?: boolean;
  searchPlaceholder?: string;
  /** Shows a "Columns" menu for hiding columns. @default true */
  columnToggle?: boolean;
  /** Page sizes offered under the table. @default [10, 25, 50] */
  pageSizeOptions?: number[];
  /** Shown when there are no rows, or none match the search. */
  emptyState?: ReactNode;
  /** Toolbar content at the end, e.g. bulk actions for the selected rows. */
  actions?: ReactNode | ((selectedRows: T[]) => ReactNode);
  className?: string;
}

const SELECT_COLUMN = '__select';

function SelectHeaderCell({ children }: { columnId: string; children: ReactNode }) {
  return (
    <div role="columnheader" className="table-header-cell data-table-select">
      {children}
    </div>
  );
}

const valueOf = <T,>(row: T, column: DataTableColumn<T>): unknown =>
  typeof column.accessor === 'function'
    ? column.accessor(row)
    : (row as Record<string, unknown>)[(column.accessor as string | undefined) ?? column.id];

/**
 * A data-driven table: sortable headers, search, row selection, column visibility and paging, on
 * top of `Table`. Every piece of state can be controlled, or handled by a server with `manual`.
 * For the logic without the markup, use `useDataTable` from `pada-ds/headless`.
 */
export function DataTable<T>({
  columns,
  label,
  selectable = false,
  searchable = true,
  searchPlaceholder,
  columnToggle = true,
  pageSizeOptions = [10, 25, 50],
  emptyState,
  actions,
  className,
  ...options
}: DataTableProps<T>) {
  const table = useDataTable<T>({ defaultPageSize: pageSizeOptions[0], ...options, columns });
  const columnsById = useMemo(() => new Map(columns.map((column) => [column.id, column])), [columns]);
  const visible = table.visibleColumns.map((column) => columnsById.get(column.id)!);

  // Table resets its own column state (widths, order) when this array changes, so it only
  // changes when the columns themselves do, not on every selection or page change.
  const columnsKey = JSON.stringify([selectable, visible.map((column) => [column.id, column.header, column.width, column.minWidth])]);
  const tableColumns = useMemo<TableColumn[]>(
    () => [
      ...(selectable ? [{ id: SELECT_COLUMN, label: 'Select', width: 44, minWidth: 44 }] : []),
      ...visible.map((column) => ({ id: column.id, label: column.header, width: column.width, minWidth: column.minWidth })),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps -- keyed on the columns' content
    [columnsKey],
  );

  // Announce how many rows match once the search settles.
  const [announcement, setAnnouncement] = useState('');
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const timer = window.setTimeout(() => setAnnouncement(`${table.total} ${table.total === 1 ? 'result' : 'results'}`), 400);
    return () => window.clearTimeout(timer);
  }, [table.search, table.total]);

  const hideable = columns.filter((column) => column.hideable !== false);
  const selectedCount = table.selectedIds.length;

  const toolbar = (
    <div className="data-table-toolbar">
      {searchable && (
        <SearchField
          className="data-table-search"
          aria-label={`Search ${label}`}
          placeholder={searchPlaceholder ?? 'Search'}
          value={table.search}
          onChange={table.setSearch}
          onClear={() => table.setSearch('')}
        />
      )}
      {selectable && selectedCount > 0 && (
        <span className="data-table-selection">
          {selectedCount} selected
          <Button size="sm" variant="ghost" onClick={table.clearSelection}>
            Clear
          </Button>
        </span>
      )}
      <span className="data-table-actions">
        {typeof actions === 'function' ? actions(table.selectedRows) : actions}
        {columnToggle && hideable.length > 0 && (
          <DropdownMenuRoot>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="secondary" rightIcon="chevron_down">
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Show columns</DropdownMenuLabel>
              {hideable.map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={table.isColumnVisible(column.id)}
                  // Keep the menu open so several columns can be toggled in a row.
                  onSelect={(event) => event.preventDefault()}
                  onCheckedChange={() => table.toggleColumn(column.id)}
                >
                  {column.header}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenuRoot>
        )}
      </span>
      <VisuallyHidden role="status">{announcement}</VisuallyHidden>
    </div>
  );

  return (
    <div className={['data-table', className].filter(Boolean).join(' ')}>
      <Table columns={tableColumns} label={label} toolbar={toolbar}>
        <TableRow>
          {selectable && (
            <SelectHeaderCell columnId={SELECT_COLUMN}>
              <Checkbox
                aria-label="Select all rows on this page"
                checked={table.pageSelection === 'all'}
                indeterminate={table.pageSelection === 'some'}
                disabled={table.rows.length === 0}
                onChange={table.togglePage}
              />
            </SelectHeaderCell>
          )}
          {visible.map((column) =>
            column.sortable === false ? (
              <HeaderCell key={column.id} columnId={column.id} label={column.header} />
            ) : (
              <HeaderCell
                key={column.id}
                columnId={column.id}
                label={column.header}
                sortDirection={table.getSortDirection(column.id)}
                onSort={() => table.toggleSort(column.id)}
              />
            ),
          )}
        </TableRow>
        {table.rows.length === 0 ? (
          <TableRow>
            <TableCell span="all">
              <div className="data-table-empty">{emptyState ?? (table.search ? `No results for “${table.search}”` : 'No data')}</div>
            </TableCell>
          </TableRow>
        ) : (
          table.rows.map((row) => {
            const rowName = visible.find((column) => column.rowHeader) ?? visible[0];
            const name = rowName ? String(valueOf(row.original, rowName) ?? row.id) : row.id;
            return (
              <TableRow key={row.id} selected={selectable && table.isSelected(row.id)}>
                {selectable && (
                  <TableCell columnId={SELECT_COLUMN} className="data-table-select">
                    <Checkbox aria-label={`Select ${name}`} checked={table.isSelected(row.id)} onChange={() => table.toggleRow(row.id)} />
                  </TableCell>
                )}
                {visible.map((column) => (
                  <TableCell key={column.id} columnId={column.id} rowHeader={column.rowHeader}>
                    {column.cell ? column.cell(row.original) : String(valueOf(row.original, column) ?? '')}
                  </TableCell>
                ))}
              </TableRow>
            );
          })
        )}
        {table.total > Math.min(...pageSizeOptions) && (
          <TablePagination
            total={table.total}
            page={table.page}
            rowsPerPage={table.pageSize}
            rowsPerPageOptions={pageSizeOptions}
            onPageChange={table.setPage}
            onRowsPerPageChange={table.setPageSize}
          />
        )}
      </Table>
    </div>
  );
}

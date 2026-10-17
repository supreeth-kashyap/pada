import { useMemo, useState } from 'react';
import DemoPage from '../DemoPage';
import { CodeSnippet } from '../../../components/CodeSnippet/CodeSnippet';
import { Table } from '../../../components/Table';
import { TableRow } from '../../../components/Table/Row';
import { TableCell } from '../../../components/Table/Cells';
import { HeaderCell } from '../../../components/Table/HeaderCell';
import { TablePagination } from '../../../components/Table/Pagination';
import { Toolbar, Filter, MoreFilter } from '../../../components/Toolbar';
import { Tags } from '../../../components/Tags';
import type { TableColumn } from '../../../components/Table';
import type { SortDirection } from '../../../components/Table/HeaderCell';
import { USERS, STATUS_VARIANT, formatJoined } from './table-demo.data';

const COLUMNS: TableColumn[] = [
  { id: 'name',   label: 'Name',     minWidth: 160 },
  { id: 'email',  label: 'Email',    minWidth: 200 },
  { id: 'role',   label: 'Role',     width: 120 },
  { id: 'status', label: 'Status',   width: 120 },
  { id: 'joined', label: 'Joined',   width: 140 }
];

/**
 * Fully wired Table preview: toolbar (search + secondary actions), HeaderCell row,
 * filtered + paged TableRow body, and TablePagination footer. Filter and pagination
 * state live locally to the preview so this stays a self-contained example.
 */
// Filter option lists drawn from the mock USERS data so the dropdown contents
// match the rows the user actually sees.
const STATUS_OPTIONS = [
  { value: 'Active', label: 'Active' },
  { value: 'Invited', label: 'Invited' },
  { value: 'Suspended', label: 'Suspended' }
];
const ROLE_OPTIONS = [
  { value: 'Owner', label: 'Owner' },
  { value: 'Admin', label: 'Admin' },
  { value: 'Editor', label: 'Editor' },
  { value: 'Viewer', label: 'Viewer' }
];

function UsersTablePreview() {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  // Toolbar filter state. Status / Role show as their own chips; the rest are
  // tucked behind the MoreFilter (joined-year here for demo purposes).
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [roleFilter, setRoleFilter] = useState<string[]>([]);
  const [moreFilters, setMoreFilters] = useState<Record<string, string[]>>({});
  const [nameSort, setNameSort] = useState<SortDirection>('none');
  // Bulk-row-selection state. Click a row to toggle. Preview ships with the
  // first user pre-selected so the indigo wash is visible at first paint.
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set([USERS[0]?.id].filter(Boolean) as string[]));
  const toggleSelected = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const joinedYears = Array.from(new Set(USERS.map((u) => u.joined.slice(0, 4)))).sort();

  const filtered = useMemo(() => {
    return USERS.filter((u) => {
      if (statusFilter.length > 0 && !statusFilter.includes(u.status)) return false;
      if (roleFilter.length > 0 && !roleFilter.includes(u.role)) return false;
      const yearFilter = moreFilters.joinedYear ?? [];
      if (yearFilter.length > 0 && !yearFilter.includes(u.joined.slice(0, 4))) return false;
      return true;
    }).sort((a, b) => (nameSort === 'none' ? 0 : a.name.localeCompare(b.name) * (nameSort === 'ascending' ? 1 : -1)));
  }, [statusFilter, roleFilter, moreFilters, nameSort]);

  const total = filtered.length;
  const start = (page - 1) * rowsPerPage;
  const visible = filtered.slice(start, start + rowsPerPage);

  // Reset to page 1 whenever the filter changes the result set length below the
  // current page's start index.
  const safePage = start >= total && total > 0 ? 1 : page;
  if (safePage !== page) {
    // Defer the state update so we don't set state during render.
    queueMicrotask(() => setPage(safePage));
  }

  return (
    <div style={{ width: '100%' }}>
      <Table
        columns={COLUMNS}
        label="Users"
        toolbar={
          <Toolbar
            left={
              <>
                <Filter
                  label="Status"
                  multiSelect
                  options={STATUS_OPTIONS}
                  value={statusFilter}
                  onChange={(values) => {
                    setStatusFilter(values);
                    setPage(1);
                  }}
                />
                <Filter
                  label="Role"
                  multiSelect
                  options={ROLE_OPTIONS}
                  value={roleFilter}
                  onChange={(values) => {
                    setRoleFilter(values);
                    setPage(1);
                  }}
                />
                <MoreFilter
                  filters={[
                    {
                      id: 'joinedYear',
                      label: 'Joined year',
                      multiSelect: true,
                      options: joinedYears.map((y) => ({ value: y, label: y })),
                    },
                  ]}
                  value={moreFilters}
                  onChange={(values) => {
                    setMoreFilters(values);
                    setPage(1);
                  }}
                />
              </>
            }
            actions={[
              // Search is the first ghost action on the right cluster \u2014 wire
              // it to a popover with a SearchField when ready.
              { id: 'search',   leftIcon: 'search',   'aria-label': 'Search users' },
              { id: 'export',   leftIcon: 'download', 'aria-label': 'Export users' },
              { id: 'settings', leftIcon: 'settings', 'aria-label': 'Table settings' },
            ]}
            primaryAction={{ id: 'invite', leftIcon: 'add', children: 'Invite user' }}
          />
        }
      >
        <TableRow>
          {COLUMNS.map((c) =>
            c.id === 'name' ? (
              <HeaderCell
                key={c.id}
                columnId={c.id}
                label={c.label}
                sortDirection={nameSort}
                onSort={() => setNameSort(nameSort === 'ascending' ? 'descending' : 'ascending')}
              />
            ) : (
              <HeaderCell key={c.id} columnId={c.id} label={c.label} />
            ),
          )}
        </TableRow>
        {visible.map((u) => (
          <TableRow
            key={u.id}
            selected={selectedIds.has(u.id)}
            onClick={() => toggleSelected(u.id)}
          >
            <TableCell columnId="name" rowHeader>{u.name}</TableCell>
            <TableCell columnId="email">
              <span style={{ color: 'var(--pada-color-fg-muted)' }}>{u.email}</span>
            </TableCell>
            <TableCell columnId="role">{u.role}</TableCell>
            <TableCell columnId="status">
              <Tags variant={STATUS_VARIANT[u.status]}>
                {u.status}
              </Tags>
            </TableCell>
            <TableCell columnId="joined">{formatJoined(u.joined)}</TableCell>
          </TableRow>
        ))}
        {visible.length === 0 && (
          <TableRow>
            <TableCell span="all">
              <span style={{ textAlign: 'center', color: 'var(--pada-color-fg-muted)' }}>No users match the current filters.</span>
            </TableCell>
          </TableRow>
        )}
        <TablePagination
          total={total}
          page={safePage}
          rowsPerPage={rowsPerPage}
          onPageChange={setPage}
          onRowsPerPageChange={(n) => {
            setRowsPerPage(n);
            setPage(1);
          }}
        />
      </Table>
    </div>
  );
}

export default function TableDemo() {
  return (
    <DemoPage
      title="Table"
      kind="Component"
      purpose={
        <p>
          Table presents structured rows and columns of data — records, transactions,
          audit logs. Use it when users need to scan, sort, or compare across rows.
          For free-form lists or single-record details, prefer List or KeyValue.
        </p>
      }
      design={
        <>
          <p>
            Table composes a <code>Toolbar</code>, a header <code>TableRow</code> of{' '}
            <code>HeaderCell</code>s, body <code>TableRow</code>s of{' '}
            <code>TableCell</code>s, and a <code>TablePagination</code> footer. Columns
            are configured once via the <code>columns</code> prop — widths, min-widths,
            and reorder/resize state are handled internally. Click the Name header to sort.
          </p>
          <div className="demo-page__showcase" style={{ flexDirection: 'column', gap: 16 }}>
            <UsersTablePreview />
          </div>
        </>
      }
      developer={
        <>
          <p>
            Import <code>Table</code> plus its row/cell/pagination primitives from{' '}
            <code>pada-ds</code>. Filter and pagination state live in the parent — Table
            itself is presentational.
          </p>
          <CodeSnippet
            code={`import { useMemo, useState } from 'react';
import {
  Table,
  TableRow,
  TableCell,
  HeaderCell,
  TablePagination,
  Toolbar,
  SearchField,
  Button,
  Tags
} from 'pada-ds';

const COLUMNS = [
  { id: 'name',   label: 'Name',   minWidth: 160 },
  { id: 'email',  label: 'Email',  minWidth: 200 },
  { id: 'role',   label: 'Role',   width: 120 },
  { id: 'status', label: 'Status', width: 120 }
];

export function UsersTable({ users }) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const filtered = useMemo(
    () => users.filter((u) => u.name.toLowerCase().includes(search.toLowerCase())),
    [users, search]
  );

  const start = (page - 1) * rowsPerPage;
  const visible = filtered.slice(start, start + rowsPerPage);

  return (
    <Table
      columns={COLUMNS}
      label="Users"
      toolbar={
        <Toolbar>
          <SearchField value={search} onChange={setSearch} placeholder="Search users" />
          <Button variant="primary" leftIcon="add">Invite user</Button>
        </Toolbar>
      }
    >
      <TableRow>
        {COLUMNS.map((c) => <HeaderCell key={c.id} columnId={c.id} label={c.label} />)}
      </TableRow>
      {visible.map((u) => (
        <TableRow key={u.id}>
          <TableCell columnId="name" rowHeader>{u.name}</TableCell>
          <TableCell columnId="email">{u.email}</TableCell>
          <TableCell columnId="role">{u.role}</TableCell>
          <TableCell columnId="status">
            <Tags variant="green">{u.status}</Tags>
          </TableCell>
        </TableRow>
      ))}
      <TablePagination
        total={filtered.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
        onRowsPerPageChange={setRowsPerPage}
      />
    </Table>
  );
}`}
            language="tsx"
            label="Table usage"
          />
        </>
      }
      accessibility={
        <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <li>
            The rows sit in a <code>role="table"</code> named by <code>label</code>; rows,
            column headers, row headers (<code>rowHeader</code>) and cells carry their
            table roles, so screen readers announce positions and headers as you move.
          </li>
          <li>
            Pass <code>sortDirection</code> and <code>onSort</code> to a <code>HeaderCell</code>{' '}
            to make it a sort button; the header reports <code>aria-sort</code>.
          </li>
          <li>
            Each column's resize handle is a focusable separator: <kbd>←</kbd> /{' '}
            <kbd>→</kbd> resize it by 16px and its width is announced.
          </li>
          <li>
            Pagination controls have explicit <code>aria-label</code>s (
            <code>Previous page</code>, <code>Next page</code>) and disable on the
            boundaries so keyboard users can't navigate past the edges.
          </li>
          <li>
            The toolbar's <code>SearchField</code> is a real <code>&lt;input&gt;</code>{' '}
            with an accessible label; results announce via <code>role="status"</code>{' '}
            when filtering changes the row count.
          </li>
          <li>
            Row text and status pills clear AA 4.5:1 contrast; the focus ring on the
            row and on action buttons is visible on <code>:focus-visible</code>.
          </li>
        </ul>
      }
    />
  );
}

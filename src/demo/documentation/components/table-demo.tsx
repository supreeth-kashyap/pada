import { useMemo, useState } from 'react';
import DemoPage from '../DemoPage';
import { CodeSnippet } from '../../../components/CodeSnippet/CodeSnippet';
import { Table } from '../../../components/Table';
import { TableRow } from '../../../components/Table/Row';
import { TableCell } from '../../../components/Table/Cells';
import { HeaderCell } from '../../../components/Table/HeaderCell';
import { TablePagination } from '../../../components/Table/Pagination';
import { Toolbar } from '../../../components/Toolbar';
import { SearchField } from '../../../components/SearchField';
import { Button } from '../../../components/Button';
import { Tags } from '../../../components/Tags';
import type { TableColumn } from '../../../components/Table';
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
function UsersTablePreview() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return USERS;
    return USERS.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q) ||
        u.status.toLowerCase().includes(q)
    );
  }, [search]);

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
        toolbar={
          <Toolbar>
            <div style={{ flex: 1, minWidth: 0 }}>
              <SearchField
                value={search}
                onChange={(value) => {
                  setSearch(value);
                  setPage(1);
                }}
                placeholder="Search users by name, email, role…"
              />
            </div>
            <Button variant="secondary" leftIcon="filter_list">
              Filters
            </Button>
            <Button variant="primary" leftIcon="add">
              Invite user
            </Button>
          </Toolbar>
        }
      >
        <TableRow>
          {COLUMNS.map((c) => (
            <HeaderCell key={c.id} columnId={c.id} label={c.label} />
          ))}
        </TableRow>
        {visible.map((u) => (
          <TableRow key={u.id}>
            <TableCell columnId="name">{u.name}</TableCell>
            <TableCell columnId="email">
              <span style={{ color: 'var(--color-stone-600)' }}>{u.email}</span>
            </TableCell>
            <TableCell columnId="role">{u.role}</TableCell>
            <TableCell columnId="status">
              <Tags variant={STATUS_VARIANT[u.status]} size="sm">
                {u.status}
              </Tags>
            </TableCell>
            <TableCell columnId="joined">{formatJoined(u.joined)}</TableCell>
          </TableRow>
        ))}
        {visible.length === 0 && (
          <div
            style={{
              padding: '24px 16px',
              textAlign: 'center',
              color: 'var(--color-stone-500)',
              fontSize: 13
            }}
          >
            No users match “{search}”.
          </div>
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
            and reorder/resize state are handled internally.
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
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filtered = useMemo(
    () => users.filter((u) => u.name.toLowerCase().includes(search.toLowerCase())),
    [users, search]
  );

  const start = (page - 1) * rowsPerPage;
  const visible = filtered.slice(start, start + rowsPerPage);

  return (
    <Table
      columns={COLUMNS}
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
          <TableCell columnId="name">{u.name}</TableCell>
          <TableCell columnId="email">{u.email}</TableCell>
          <TableCell columnId="role">{u.role}</TableCell>
          <TableCell columnId="status">
            <Tags variant="green" size="sm">{u.status}</Tags>
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
            Header cells expose <code>aria-sort</code> when sortable so screen readers
            announce the active sort state.
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

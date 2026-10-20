import { useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button';
import { SearchField } from '../SearchField';
import { Tags } from '../Tags';
import { Toolbar } from '../Toolbar';
import { HeaderCell, Table, TableCell, TablePagination, TableRow, type TableColumn } from '.';

const COLUMNS: TableColumn[] = [
  { id: 'name', label: 'Name', minWidth: 160 },
  { id: 'email', label: 'Email', minWidth: 200 },
  { id: 'role', label: 'Role', width: 120 },
  { id: 'status', label: 'Status', width: 120 },
];

const USERS = ['Ada Lovelace', 'Grace Hopper', 'Alan Turing', 'Katherine Johnson', 'Margaret Hamilton', 'Barbara Liskov',
  'Radia Perlman', 'Frances Allen', 'Hedy Lamarr', 'Donald Knuth', 'Ken Thompson', 'Dennis Ritchie'].map((name, i) => ({
  id: String(i),
  name,
  email: `${name.split(' ')[0].toLowerCase()}@example.com`,
  role: ['Admin', 'Editor', 'Viewer'][i % 3],
  status: i % 4 === 3 ? 'Invited' : 'Active',
}));

function UsersTable() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const filtered = useMemo(() => USERS.filter((u) => u.name.toLowerCase().includes(search.toLowerCase())), [search]);
  const visible = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <Table
      columns={COLUMNS}
      label="Users"
      toolbar={
        <Toolbar>
          <SearchField value={search} onChange={(value) => { setSearch(value); setPage(1); }} placeholder="Search users" />
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
            <Tags variant={u.status === 'Active' ? 'success' : 'neutral'}>{u.status}</Tags>
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
}

const meta = {
  title: 'Data/Table',
  component: Table,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithToolbarAndPagination: Story = {
  args: { columns: COLUMNS, children: null },
  render: () => <UsersTable />,
};

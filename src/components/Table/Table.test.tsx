import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axeViolations } from '../../test/axe';
import { HeaderCell, Table, TableCell, TablePagination, TableRow, type TableColumn } from '.';

const COLUMNS: TableColumn[] = [
  { id: 'name', label: 'Name' },
  { id: 'role', label: 'Role', width: 120, minWidth: 100 },
];

function Example({ onSort = () => {}, onColumnsChange }: { onSort?: () => void; onColumnsChange?: (columns: TableColumn[]) => void }) {
  return (
    <Table columns={COLUMNS} label="Users" onColumnsChange={onColumnsChange}>
      <TableRow>
        <HeaderCell columnId="name" label="Name" sortDirection="ascending" onSort={onSort} />
        <HeaderCell columnId="role" label="Role" />
      </TableRow>
      <TableRow>
        <TableCell columnId="role">Owner</TableCell>
        <TableCell columnId="name" rowHeader>
          Ada
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell span="all">No more users</TableCell>
      </TableRow>
      <TablePagination total={2} page={1} rowsPerPage={25} onPageChange={() => {}} onRowsPerPageChange={() => {}} />
    </Table>
  );
}

describe('Table', () => {
  it('exposes table semantics, in column order, with pagination outside the table', async () => {
    render(<Example />);
    const table = screen.getByRole('table', { name: 'Users' });
    const rows = within(table).getAllByRole('row');
    expect(rows).toHaveLength(3);
    expect(within(rows[0]).getAllByRole('columnheader').map((cell) => cell.textContent)).toEqual(
      expect.arrayContaining([expect.stringContaining('Name'), expect.stringContaining('Role')]),
    );
    // Cells follow the column order, whatever order they were written in.
    expect(rows[1].children[0]).toHaveAttribute('role', 'rowheader');
    expect(rows[1].children[0]).toHaveTextContent('Ada');
    expect(within(rows[2]).getByRole('cell')).toHaveStyle({ gridColumn: '1 / -1' });
    expect(table).not.toContainElement(screen.getByRole('button', { name: 'Next page' }));
    expect(await axeViolations()).toEqual([]);
  });

  it('sortable headers report aria-sort and sort on click', async () => {
    const user = userEvent.setup();
    const onSort = vi.fn();
    render(<Example onSort={onSort} />);
    const [name, role] = screen.getAllByRole('columnheader');
    expect(name).toHaveAttribute('aria-sort', 'ascending');
    expect(role).not.toHaveAttribute('aria-sort');
    await user.click(within(name).getByRole('button', { name: 'Name' }));
    expect(onSort).toHaveBeenCalledOnce();
  });

  it('resizes a column from the keyboard, not below its minimum', () => {
    const onColumnsChange = vi.fn();
    render(<Example onColumnsChange={onColumnsChange} />);
    const handle = screen.getByRole('separator', { name: 'Resize Role column' });
    expect(handle).toHaveAttribute('aria-valuenow', '120');
    fireEvent.keyDown(handle, { key: 'ArrowRight' });
    expect(handle).toHaveAttribute('aria-valuenow', '136');
    expect(onColumnsChange).toHaveBeenLastCalledWith(expect.arrayContaining([expect.objectContaining({ id: 'role', width: 136 })]));
    for (let i = 0; i < 5; i++) fireEvent.keyDown(handle, { key: 'ArrowLeft' });
    expect(handle).toHaveAttribute('aria-valuenow', '100');
  });
});

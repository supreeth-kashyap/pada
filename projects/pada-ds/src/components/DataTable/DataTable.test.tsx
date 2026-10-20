import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axeViolations } from '../../test/axe';
import { DataTable, type DataTableColumn } from '.';

interface Member {
  id: string;
  name: string;
  role: string;
  commits: number;
}

const members: Member[] = Array.from({ length: 14 }, (_, index) => ({
  id: `m${index + 1}`,
  name: `Member ${index + 1}`,
  role: index % 3 === 0 ? 'Owner' : index % 3 === 1 ? 'Editor' : 'Viewer',
  commits: (index * 37) % 50,
}));

const columns: DataTableColumn<Member>[] = [
  { id: 'name', header: 'Name', rowHeader: true },
  { id: 'role', header: 'Role' },
  { id: 'commits', header: 'Commits', cell: (row) => <strong>{row.commits}</strong> },
];

const bodyRows = () => screen.getAllByRole('row').slice(1);
const firstCells = () => bodyRows().map((row) => row.querySelector('[role="rowheader"], [role="cell"]')?.textContent);

describe('DataTable', () => {
  it('renders a named table with sortable headers and the first page', async () => {
    render(<DataTable label="Team members" data={members} columns={columns} selectable />);
    expect(screen.getByRole('table', { name: 'Team members' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /Name/ })).toHaveAttribute('aria-sort', 'none');
    expect(bodyRows()).toHaveLength(10);
    expect(screen.getByRole('rowheader', { name: 'Member 1' })).toBeInTheDocument();
    expect(screen.getByText('1-10 of 14')).toBeInTheDocument();
    expect(await axeViolations()).toEqual([]);
  });

  it('sorts when a header is pressed', async () => {
    const user = userEvent.setup();
    render(<DataTable label="Team members" data={members} columns={columns} />);
    await user.click(screen.getByRole('button', { name: 'Commits' }));
    expect(screen.getByRole('columnheader', { name: /Commits/ })).toHaveAttribute('aria-sort', 'ascending');
    expect(firstCells()[0]).toBe('Member 1');
    await user.click(screen.getByRole('button', { name: 'Commits' }));
    expect(screen.getByRole('columnheader', { name: /Commits/ })).toHaveAttribute('aria-sort', 'descending');
    expect(firstCells()[0]).toBe('Member 5');
  });

  it('searches and announces the result count', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<DataTable label="Team members" data={members} columns={columns} />);
    await user.type(screen.getByRole('textbox', { name: 'Search Team members' }), 'owner');
    expect(bodyRows()).toHaveLength(5);
    act(() => vi.advanceTimersByTime(500));
    expect(screen.getByRole('status')).toHaveTextContent('5 results');
    await user.type(screen.getByRole('textbox', { name: 'Search Team members' }), 'zzz');
    expect(screen.getByText('No results for “ownerzzz”')).toBeInTheDocument();
    vi.useRealTimers();
  });

  it('selects rows, and the header box selects the page', async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    render(<DataTable label="Team members" data={members} columns={columns} selectable onSelectionChange={onSelectionChange} actions={(rows) => rows.length > 0 && <button type="button">Remove {rows.length}</button>} />);
    await user.click(screen.getByRole('checkbox', { name: 'Select Member 2' }));
    expect(onSelectionChange).toHaveBeenLastCalledWith(['m2']);
    const all = screen.getByRole('checkbox', { name: 'Select all rows on this page' });
    expect(all).toHaveAttribute('aria-checked', 'mixed');
    expect(screen.getByText('1 selected')).toBeInTheDocument();
    await user.click(all);
    expect(screen.getByRole('button', { name: 'Remove 10' })).toBeInTheDocument();
    expect(await axeViolations()).toEqual([]);
    await user.click(screen.getByRole('button', { name: 'Clear' }));
    expect(onSelectionChange).toHaveBeenLastCalledWith([]);
  });

  it('hides columns from the Columns menu and pages through rows', async () => {
    const user = userEvent.setup();
    render(<DataTable label="Team members" data={members} columns={columns} />);
    await user.click(screen.getByRole('button', { name: 'Columns' }));
    await user.click(await screen.findByRole('menuitemcheckbox', { name: 'Role' }));
    // The menu stays open for further changes.
    expect(screen.getByRole('menuitemcheckbox', { name: 'Role' })).toHaveAttribute('aria-checked', 'false');
    expect(screen.queryByRole('columnheader', { name: /Role/ })).toBeNull();
    await user.keyboard('{Escape}');
    await user.click(screen.getByRole('button', { name: 'Next page' }));
    expect(bodyRows()).toHaveLength(4);
    expect(screen.getByText('11-14 of 14')).toBeInTheDocument();
  });
});

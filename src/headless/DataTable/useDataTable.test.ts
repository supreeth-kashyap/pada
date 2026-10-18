import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { compareValues, useDataTable, type DataTableColumnDef } from './useDataTable';

interface Person {
  id: string;
  name: string;
  age: number | null;
  joined: Date;
}

const people: Person[] = [
  { id: 'a', name: 'Ada', age: 36, joined: new Date('2024-03-01') },
  { id: 'b', name: 'grace', age: 85, joined: new Date('2023-01-15') },
  { id: 'c', name: 'Alan', age: null, joined: new Date('2024-07-30') },
  { id: 'd', name: 'Edsger 10', age: 72, joined: new Date('2022-11-02') },
  { id: 'e', name: 'Edsger 9', age: 41, joined: new Date('2025-02-14') },
];
const columns: DataTableColumnDef<Person>[] = [{ id: 'name' }, { id: 'age' }, { id: 'joined' }, { id: 'initial', accessor: (row) => row.name[0], searchable: false }];
const names = (rows: { original: Person }[]) => rows.map((row) => row.original.name);

describe('useDataTable', () => {
  it('compares numbers, dates and text naturally, with blanks last', () => {
    expect(compareValues(2, 10)).toBeLessThan(0);
    expect(compareValues('item 2', 'item 10')).toBeLessThan(0);
    expect(compareValues('ada', 'Ada')).toBe(0);
    expect(compareValues(null, 1)).toBeGreaterThan(0);
    expect(compareValues(new Date(1), new Date(2))).toBeLessThan(0);
  });

  it('sorts by a column, cycling ascending, descending and off', () => {
    const { result } = renderHook(() => useDataTable({ data: people, columns }));
    act(() => result.current.toggleSort('age'));
    expect(names(result.current.rows)).toEqual(['Ada', 'Edsger 9', 'Edsger 10', 'grace', 'Alan']);
    act(() => result.current.toggleSort('age'));
    expect(result.current.getSortDirection('age')).toBe('descending');
    expect(names(result.current.rows)).toEqual(['grace', 'Edsger 10', 'Edsger 9', 'Ada', 'Alan']);
    act(() => result.current.toggleSort('age'));
    expect(result.current.sort).toBeNull();
    expect(names(result.current.rows)).toEqual(people.map((person) => person.name));
    act(() => result.current.toggleSort('joined'));
    expect(names(result.current.rows)[0]).toBe('Edsger 10');
  });

  it('searches searchable columns and resets to the first page', () => {
    const { result } = renderHook(() => useDataTable({ data: people, columns, defaultPageSize: 2, defaultPage: 2 }));
    expect(result.current.page).toBe(2);
    act(() => result.current.setSearch('edsger'));
    expect(result.current.page).toBe(1);
    expect(result.current.total).toBe(2);
    act(() => result.current.setSearch('E'));
    // "initial" is not searchable, so only names containing "e" match.
    expect(names(result.current.rows)).toEqual(['grace', 'Edsger 10']);
  });

  it('pages the sorted rows and clamps the page', () => {
    const { result } = renderHook(() => useDataTable({ data: people, columns, defaultPageSize: 2 }));
    expect(result.current.pageCount).toBe(3);
    act(() => result.current.setPage(3));
    expect(names(result.current.rows)).toEqual(['Edsger 9']);
    act(() => result.current.setPage(9));
    expect(result.current.page).toBe(3);
    act(() => result.current.setPageSize(10));
    expect(result.current.page).toBe(1);
    expect(result.current.rows).toHaveLength(5);
  });

  it('selects rows and whole pages', () => {
    const onSelectionChange = vi.fn();
    const { result } = renderHook(() => useDataTable({ data: people, columns, defaultPageSize: 2, onSelectionChange }));
    act(() => result.current.toggleRow('a'));
    expect(result.current.pageSelection).toBe('some');
    act(() => result.current.togglePage());
    expect(result.current.selectedIds.sort()).toEqual(['a', 'b']);
    expect(result.current.pageSelection).toBe('all');
    expect(result.current.selectedRows.map((row) => row.name)).toEqual(['Ada', 'grace']);
    act(() => result.current.togglePage());
    expect(result.current.selectedIds).toEqual([]);
    expect(onSelectionChange).toHaveBeenLastCalledWith([]);
  });

  it('hides columns and leaves manual data untouched', () => {
    const { result } = renderHook(() => useDataTable({ data: people.slice(0, 2), columns, manual: true, rowCount: 40, defaultSort: { columnId: 'age', direction: 'descending' } }));
    act(() => result.current.toggleColumn('age'));
    expect(result.current.visibleColumns.map((column) => column.id)).toEqual(['name', 'joined', 'initial']);
    expect(result.current.total).toBe(40);
    expect(result.current.pageCount).toBe(4);
    expect(names(result.current.rows)).toEqual(['Ada', 'grace']);
  });
});

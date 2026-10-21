---
name: DataTable
category: Data
summary: A data-driven table with sorting, search, selection, column visibility and paging.
react: DataTable
angular: ds-data-table
reactDir: DataTable
angularDir: data-table
related: Table, Toolbar, Pagination, Checkbox
---
## Overview

DataTable turns `data` and `columns` into a full table: sortable headers, a search over searchable
columns, row selection with a select-all box, a Columns menu, bulk `actions` and paging. Every piece
of state can be controlled, or handed to a server with `manual`. The logic is also available
without markup as `useDataTable` in `pada-ds/headless`.

## When to use

- For lists of records people scan, sort, filter and act on: users, orders, invoices.

## When not to use

- For a small static table: use **Table**.
- For a single record's fields: use **DescriptionList**.

## Best practices

### Do

- Make the first column the row header (the name people recognise).
- Align numbers to the right and format them; sort numbers and dates naturally.
- Use `manual` with server-side sorting, search and paging for large data sets.
- Show the selected count and bulk actions only while rows are selected.

### Don't

- Don't show every field; hide less important columns by default.
- Don't put more than one or two inline actions per row; use a row menu.

## Accessibility

- Header buttons report `aria-sort`; the search result count is announced.
- Row checkboxes are named by the row header; select-all goes mixed on a partial selection.

## Use with AI

```text
With Pada, render the users as a DataTable with columns Name (row header, sortable), Email
(searchable), Role and Last active (date, sortable), row selection with a "Remove" bulk action,
10 rows per page, and server-side paging through manual mode.
```

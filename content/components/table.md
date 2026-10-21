---
name: Table
category: Data
summary: Rows and cells with sortable, resizable and reorderable columns.
react: Table
angular: ds-table
reactDir: Table
angularDir: table
related: DataTable, Pagination, Toolbar
---
## Overview

Table is the presentational layer under DataTable: rows and cells on a CSS grid, with an optional
toolbar above and pagination below. Column headers can sort, resize (drag the edge, or focus it and
press Left/Right) and reorder (drag a header onto another).

## When to use

- When you need full control over rows and cells, or the data is small and static.

## When not to use

- For typical record lists with sorting, search and selection: use **DataTable**.

## Best practices

### Do

- Name the table with `label` or `labelledBy`.
- Mark the identifying cell of each row as the row header.
- Keep column widths stable as data loads.

### Don't

- Don't use a table for layout.

## Accessibility

- `role="table"` with rows, column headers and cells. Sortable headers report `aria-sort`;
  resize handles are focusable and keyboard-operable.

## Use with AI

```text
With Pada, build a Table labelled "Invoices" with columns Number, Customer, Amount (right-aligned,
currency) and Status (Badge), a sortable Amount header, and TablePagination below.
```

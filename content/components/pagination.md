---
name: Pagination
category: Navigation
summary: Previous, numbered pages with ellipses, next.
react: Pagination
angular: ds-pagination
reactDir: Pagination
angularDir: pagination
related: Table, DataTable
---
## Overview

Pagination moves between pages of results. It shows previous and next buttons and page numbers with
ellipses around the current page (`siblingCount`, `boundaryCount`).

## When to use

- Below lists and search results that are split into pages.

## When not to use

- Inside tables with rows per page: use the Table's pagination footer (`TablePagination`).
- For feeds: use infinite loading with a "Load more" button.

## Best practices

### Do

- Keep it in the same place on every page.
- Show the total count of results nearby.
- Scroll to the top of the list when the page changes.

### Don't

- Don't paginate fewer than about 25 items.

## Accessibility

- A labelled `nav`; the current page has `aria-current="page"`; previous and next are named and
  disabled at the ends.

## Use with AI

```text
With Pada, add Pagination under the search results (page from the URL, totalPages from the API,
siblingCount 1) that updates the URL and scrolls to the top on change.
```

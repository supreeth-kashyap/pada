---
name: Grid
category: Layout
summary: CSS grid layout with token gaps, fixed or auto-fitting columns.
react: Grid
angular: ds-grid
reactDir: Grid
angularDir: grid
related: Stack, Container, Card
---
## Overview

Grid lays out children in columns with gaps from the space tokens, so spacing follows density. Use
fixed `columns`, or `minItemWidth` for as many columns as fit.

## When to use

- For card grids, dashboards and galleries.

## When not to use

- For a single row or column: use **Stack**.

## Best practices

### Do

- Prefer `minItemWidth` so the grid adapts to the screen without breakpoints.
- Keep items the same height within a row.

### Don't

- Don't use a grid to build tables; use **Table**.

## Accessibility

- Visual order follows DOM order, so keyboard and reading order stay correct.

## Use with AI

```text
With Pada, lay out the dashboard Stat cards in a Grid with minItemWidth "240px" and gap 4.
```

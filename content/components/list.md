---
name: List
category: Layout
summary: A vertical list of items, optionally reorderable.
react: List
angular: ds-list
reactDir: List
angularDir: list
related: Tree, Table, Timeline
---
## Overview

List renders `ListItem` rows. With `draggable`, items can be reordered with the mouse or keyboard:
focus the handle, press Space to lift, move with the arrows and press Space to drop (Escape cancels).
Each step is announced, and `onReorder` reports the new order.

## When to use

- For simple lists of items, and for ordering things (priorities, playlist, steps).

## When not to use

- For records with several columns: use **Table**.
- For hierarchies: use **Tree**.

## Best practices

### Do

- Name reorderable lists with `label` ("Tasks").
- Persist the new order as soon as an item is dropped.

### Don't

- Don't rely on drag only; the keyboard route is built in, keep the handle visible.

## Accessibility

- A list with list items; drag handles are buttons with live announcements for lift, move and drop.

## Use with AI

```text
With Pada, show the sprint backlog as a draggable List labelled "Backlog" whose order is saved
through onReorder.
```

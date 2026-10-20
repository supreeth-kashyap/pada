---
name: Toolbar
category: Navigation
summary: Filters and a view switcher on the left, actions on the right.
react: Toolbar
angular: ds-toolbar
reactDir: Toolbar
angularDir: toolbar
related: DataTable, Table, ComboBox, ButtonGroup
---
## Overview

Toolbar sits above lists and tables: filter chips and a view switcher on the left, buttons on the
right (`actions` and a `primaryAction`). Pada's filters (`Filter`, `MoreFilter`, `FilterChip`) are
built for it.

## When to use

- Above data views to filter, switch views and act on the data.

## When not to use

- For editor formatting: use **ToggleGroup** inside a toolbar region.
- For app-level menus: use **Menubar**.

## Best practices

### Do

- Name it with `aria-label` ("Members").
- Keep one primary action on the right ("Invite").
- Use MoreFilter when filters don't fit as chips.

### Don't

- Don't put more than three secondary actions; move the rest into a menu.

## Accessibility

- In Angular, `role="toolbar"` with roving focus (one tab stop, Left/Right and Home/End). In React,
  a flex container whose buttons are separate tab stops; the difference is documented.

## Use with AI

```text
With Pada, put a Toolbar above the members table with a Status Filter (Active, Invited, Suspended),
a MoreFilter for Role and Team, an "Export" action and a primary "Invite" action.
```

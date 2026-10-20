---
name: Sidebar
category: Navigation
summary: The app's side navigation, from data, with sections, search and collapse.
react: Sidebar
angular: ds-sidebar
reactDir: Sidebar
angularDir: sidebar
related: PageHeader, Tabs, Indexer
---
## Overview

Sidebar is the app-shell navigation: a logo, a search, sections of menu items with icons and
badges, nested items and a collapse toggle. Pass it `data` (or compose its parts) and the active id.

## When to use

- As the main navigation of an app with more than a handful of sections.

## When not to use

- For in-page navigation: use **Indexer** or **Tabs**.

## Best practices

### Do

- Group items into labelled sections and order them by frequency.
- Keep labels short; use icons consistently across items.
- Remember the collapsed state per person.

### Don't

- Don't nest more than two levels.

## Accessibility

- Rendered as an `<aside>`; the active item has `aria-current="page"` and the collapse toggle
  announces `aria-expanded`. Give the sidebar an `aria-label` ("Main navigation").

## Use with AI

```text
With Pada, build the app Sidebar from data: our logo, a search, sections Workspace (Dashboard,
Projects, Reports) and Settings (Team, Billing), with icons and the active item from the router.
```

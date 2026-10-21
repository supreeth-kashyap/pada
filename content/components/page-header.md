---
name: PageHeader
category: Navigation
summary: The bar at the top of a page: breadcrumbs, search, AI and profile.
react: PageHeader
angular: ds-page-header
reactDir: PageHeader
angularDir: page-header
related: Breadcrumbs, CommandPalette, Avatar, Sidebar
---
## Overview

PageHeader is the app's top bar: a breadcrumb trail on the left and, on the right, a command
(search) button with its shortcut, an AI button and a profile button with a menu. Long trails
collapse to the first and last crumbs.

## When to use

- At the top of every page in an app shell, next to a **Sidebar**.

## When not to use

- For marketing pages: build a site header instead.

## Best practices

### Do

- Wire the command button to a **CommandPalette** and show its shortcut.
- Use the profile menu for account actions (Settings, Sign out).

### Don't

- Don't put page-specific actions in the header; put them in the page or a Toolbar.

## Accessibility

- The command and AI buttons are named by `commandLabel` and `aiLabel`.
- In React, give a custom `profileTrigger` an accessible name (for example an Avatar image with alt
  text). Angular names the profile button with `profileLabel` and renders the trail as a labelled
  `nav` list with `aria-current="page"`.

## Use with AI

```text
With Pada, add a PageHeader with breadcrumbs from the current route, a command button (⌘K) that
opens our CommandPalette, an AI button that opens the assistant panel, and a profile Avatar menu
with Settings and Sign out.
```

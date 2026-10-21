---
name: Menubar
category: Navigation
summary: A horizontal bar of menus, as in desktop applications.
react: Menubar
angular: ds-menubar
reactDir: Menubar
angularDir: menubar
related: DropdownMenu, Toolbar
---
## Overview

Menubar is a row of menu triggers (File, Edit, View) for editor-style apps. Each `Menubar.Menu` has a
trigger and content built from the DropdownMenu item parts, including checkbox and radio items and
submenus.

## When to use

- In document, design and data editors with many commands.

## When not to use

- For site navigation: use **Sidebar**, **Tabs** or links.
- For a few actions: use **Toolbar** or **DropdownMenu**.

## Best practices

### Do

- Name the bar with `aria-label` ("Editor").
- Follow platform conventions for menu names and order.
- Show shortcuts next to items.

### Don't

- Don't put navigation links in a menubar.

## Accessibility

- WAI-ARIA Menubar: one tab stop; Left/Right move between menus, Down opens one; once a menu is open,
  Left/Right move to the neighbouring menu.

## Use with AI

```text
With Pada, add a Menubar aria-label="Editor" with File (New, Open, Save ⌘S), Edit (Undo, Redo) and
View (checkbox items Show grid and Show rulers) menus.
```

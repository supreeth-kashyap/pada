---
name: DropdownMenu
category: Overlays
summary: A menu of actions or options opened from a button.
react: DropdownMenu
angular: ds-dropdown-menu
reactDir: DropdownMenu
angularDir: dropdown-menu
related: ContextMenu, Menubar, Select, SplitButton
---
## Overview

DropdownMenu opens a list of actions from a trigger: row actions, account menus, "More" menus. It
supports groups, labels, separators, checkbox and radio items, and nested submenus.

## When to use

- For a set of actions related to an object or a page.
- For toggling a few view options (checkbox or radio items).

## When not to use

- To pick a value in a form: use **Select**.
- For actions on right-click: use **ContextMenu** (it shares the same parts).
- For an app-level menu bar: use **Menubar**.

## Best practices

### Do

- Start items with verbs and keep them short; show shortcuts on the right.
- Group related items and separate destructive ones at the end.
- Use submenus sparingly, one level deep.

### Don't

- Don't hide the only way to do something important inside a menu.
- Don't put form fields inside a menu.

## Accessibility

- WAI-ARIA Menu Button. The trigger opens with click, Enter, Space, ArrowDown (first item) or
  ArrowUp (last item). Arrow keys, Home/End and type-ahead move; Escape closes and returns focus.

## Use with AI

```text
With Pada, add a DropdownMenu to each card with an IconButton trigger "Card actions": Edit,
Duplicate, a separator, then Delete. Delete opens an AlertDialog before deleting.
```

---
name: ContextMenu
category: Overlays
summary: A menu opened at the pointer with right-click or a long press.
react: ContextMenu
angular: ds-context-menu
reactDir: ContextMenu
angularDir: context-menu
related: DropdownMenu, Menubar
---
## Overview

ContextMenu is the same menu as DropdownMenu, opened at the pointer from a `ContextMenu.Trigger`
area with right-click, Shift+F10 or a long press. It supports the same items, groups and submenus.

## When to use

- For shortcuts on canvases, file lists and editors where right-click is expected.

## When not to use

- As the only way to reach an action: also offer a visible button or DropdownMenu.

## Best practices

### Do

- Mirror the most common actions available elsewhere.
- Keep it short and ordered by frequency.

### Don't

- Don't override the browser's context menu on ordinary text and links.

## Accessibility

- Opens with Shift+F10 or the Menu key from the focused trigger area; keyboard navigation is
  DropdownMenu's.

## Use with AI

```text
With Pada, wrap each file row in a ContextMenu.Trigger with items Open, Rename, Move to… (submenu
of folders) and Delete, matching the row's DropdownMenu.
```

---
name: Kbd
category: Display
summary: A keyboard key or shortcut, as in "Press ⌘ K".
react: Kbd
angular: kbd[dsKbd]
reactDir: Kbd
angularDir: kbd
related: Tooltip, CommandPalette, CodeSnippet
---
## Overview

Kbd renders keys as small key caps inside a native `<kbd>`. Pass `keys` for a combination.

## When to use

- In tooltips, menus, help text and command palettes to teach shortcuts.

## When not to use

- For code: use **CodeSnippet**.

## Best practices

### Do

- Show the platform's modifier (⌘ on macOS, Ctrl elsewhere).
- Use the same key names everywhere ("Esc", "Enter").

### Don't

- Don't use Kbd for non-keyboard input.

## Accessibility

- Native `<kbd>` elements; symbols like ⌘ are read by screen readers, so pair them with a text
  alternative where it matters.

## Use with AI

```text
With Pada, add Kbd hints to the menu items: Save (⌘ S), Undo (⌘ Z), and a "Press ⌘ K to search"
hint in the header.
```

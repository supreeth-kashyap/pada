---
name: Tooltip
category: Overlays
summary: A short description shown on hover and keyboard focus.
react: Tooltip
angular: ds-tooltip
reactDir: Tooltip
angularDir: tooltip
related: InfoTooltip, HoverCard, Popover, IconButton
---
## Overview

Tooltip describes an element in a few words: an icon button's action, a truncated label, a keyboard
shortcut. It opens on hover after a delay and immediately on keyboard focus. `Tooltip.Provider`
shares delays so moving between triggers is instant.

## When to use

- To name icon-only controls and show their shortcuts.
- To reveal the full text of truncated content.

## When not to use

- For information people need to complete a task: put it on the page.
- For interactive content: use **Popover** or **HoverCard**.
- For help next to a label: use **InfoTooltip**.

## Best practices

### Do

- Keep it to a few words, without a period.
- Add the keyboard shortcut with Kbd when there is one.

### Don't

- Don't put links or buttons in a tooltip.
- Don't add tooltips to disabled elements; they can't be focused.

## Accessibility

- WAI-ARIA Tooltip: the trigger gets `aria-describedby` while open; Escape, blur and pointer-down
  close it.

## Use with AI

```text
With Pada, wrap the toolbar's icon buttons in Tooltips ("Bold ⌘B", "Italic ⌘I") inside one
Tooltip.Provider so moving between them skips the delay.
```

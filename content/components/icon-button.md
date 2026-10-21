---
name: IconButton
category: Actions
summary: A square button that shows only an icon and is named by a label.
react: IconButton
angular: button[dsIconButton]
reactDir: IconButton
angularDir: icon-button
related: Button, Tooltip, Toggle
---
## Overview

IconButton is a compact square button for familiar actions such as close, more, edit or delete.
It defaults to the ghost variant and requires an accessible name, because there is no visible
text.

## When to use

- In dense UI: table rows, toolbars, card headers, dialog corners.
- For actions whose icon is universally understood (close, search, more).

## When not to use

- When the action is the main call to action: use **Button** with a label.
- When the icon's meaning is not obvious: add a visible label instead of relying on a tooltip.

## Best practices

### Do

- Always pass a `label` (`aria-label`) that names the action: "Close", "Delete row".
- Set `tooltip` to show the label on hover and focus for sighted users.
- Use the same size as neighbouring controls.

### Don't

- Don't use an IconButton for a destructive action without confirmation.
- Don't put several unlabelled IconButtons in a row with similar icons.

## Accessibility

- Native `<button>`; the label is its accessible name and the icon is hidden from assistive technology.
- Has a minimum hit area that follows density tokens.

## Use with AI

```text
With Pada, add an IconButton with the "more_horizontal" icon and label "Row actions" to each table
row. It opens a DropdownMenu with Edit and Delete. Turn on the IconButton's tooltip so the label also
shows on hover and focus.
```

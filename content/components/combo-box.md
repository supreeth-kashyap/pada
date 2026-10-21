---
name: ComboBox
category: Forms
summary: A listbox of selectable options, used inside filters and custom pickers.
react: ComboBox
angular: ds-combo-box
reactDir: ComboBox
angularDir: combo-box
related: Select, Autocomplete, Toolbar
---
## Overview

ComboBox is a list of selectable options (`role="listbox"`) with icons and single or multiple
selection. On its own it manages focus with the arrow keys; inside a combobox it is driven through
`aria-activedescendant`. Pada's toolbar filters are built on it.

## When to use

- As the option list inside a popover, filter chip or custom picker.
- When you need the list behaviour without a text field.

## When not to use

- For a form field: use **Select** (one value) or **Autocomplete** (typing to filter).

## Best practices

### Do

- Give each item a short, scannable label and an optional icon.
- Use `multiSelect` with a clear Apply or Clear pattern (see the Toolbar filters).

### Don't

- Don't put actions in the list; use a **DropdownMenu** for actions.

## Accessibility

- `role="listbox"` with `role="option"` items and `aria-selected`.
- One tab stop; arrow keys, Home and End move between options.

## Use with AI

```text
With Pada, build a "Status" filter popover whose content is a ComboBox with multiSelect over
Open, In progress and Done, staging the selection until Apply is pressed.
```

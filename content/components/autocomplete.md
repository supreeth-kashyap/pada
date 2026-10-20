---
name: Autocomplete
category: Forms
summary: A text field with filtered suggestions; pick one or several.
react: Autocomplete
angular: ds-autocomplete
reactDir: Autocomplete
angularDir: autocomplete
related: Select, ComboBox, TagInput, SearchField
---
## Overview

Autocomplete is a combobox: people type to narrow a list of options, move with the arrow keys and
press Enter to pick. With `multiple`, picks become chips and Backspace in the empty input removes
the last one.

## When to use

- When the list is long (countries, people, repositories) and typing is faster than scrolling.
- For picking several known values, such as assignees or labels (`multiple`).

## When not to use

- For a short list (under about 10 options): use **Select** or **RadioGroup**.
- For free-form values that are not in a list: use **TagInput**.
- For searching content on a page: use **SearchField**.

## Best practices

### Do

- Give it a visible `label`; use the placeholder only for an example.
- Set an `emptyMessage` that helps ("No people match 'ana'").
- Pass a custom `filter` when matching should use more than the label (email, aliases).

### Don't

- Don't load thousands of options at once; filter on the server with `onInputValueChange`.
- Don't let free text submit as if it were a picked option.

## Accessibility

- WAI-ARIA combobox with a listbox popup; focus stays in the input and options are referenced
  with `aria-activedescendant`.
- Arrow keys move, Enter picks, Escape closes; chips in multiple mode are removable from the keyboard.

## Use with AI

```text
With Pada, add an Autocomplete labelled "Assignees" with multiple selection over the team
members (value = user id, label = name), an empty message "No one matches", and bind the
selected ids to the task form.
```

---
name: Select
category: Forms
summary: A labelled dropdown for picking one option from a list.
react: Select
angular: ds-select
reactDir: Select
angularDir: select
related: Autocomplete, RadioGroup, ComboBox
---
## Overview

Select is a select-only combobox: focus stays on the trigger while the arrow keys, Home/End and
type-ahead move through options. The list renders in a portal, flips above the trigger when there
is no room and matches the trigger's width.

## When to use

- For one choice from about five to 15 options.
- When space is limited and the options don't need to be compared side by side.

## When not to use

- For a few options that should all be visible: use **RadioGroup**.
- For long lists: use **Autocomplete** so people can type.

## Best practices

### Do

- Use a placeholder such as "Choose a role" when there is no sensible default.
- Order options alphabetically or by frequency.
- Keep option labels short; put detail in the description of the field.

### Don't

- Don't use Select for actions; use a **DropdownMenu**.
- Don't auto-submit on change.

## Accessibility

- WAI-ARIA select-only combobox: Enter, Space, ArrowDown open the list; type-ahead jumps to options;
  Escape closes and returns to the trigger.

## Use with AI

```text
With Pada, add a Select labelled "Role" with options Admin, Editor and Viewer, a placeholder
"Choose a role", required, bound to the invite form.
```

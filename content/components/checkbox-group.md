---
name: CheckboxGroup
category: Forms
summary: A labelled set of checkboxes with an optional Select all.
react: CheckboxGroup
angular: ds-checkbox-group
reactDir: CheckboxGroup
angularDir: checkbox-group
related: Checkbox, RadioGroup, Switch
---
## Overview

CheckboxGroup renders options as checkboxes under one label and description. Its value is the
array of checked option values, in option order. `selectAll` adds a parent box that turns mixed
while only some are checked and only changes enabled choices.

## When to use

- For a set of related, independent options: notification topics, permissions, filters.
- When people often want all or none (`selectAll`).

## When not to use

- When exactly one option can be chosen: use **RadioGroup**.
- For a long list of options: use **Autocomplete** with `multiple`.

## Best practices

### Do

- Label the group with what is being chosen ("Notify me about").
- Keep the list short and in a meaningful order.
- Show a group-level `error` when a minimum selection is required.

### Don't

- Don't nest groups more than one level.
- Don't use a group for options that depend on each other.

## Accessibility

- `role="group"` named by the label and described by the description and error.
- Each choice is a native checkbox: Tab moves between them, Space toggles.

## Use with AI

```text
With Pada, render a CheckboxGroup labelled "Notify me about" with options Comments, Mentions,
Assignments and Weekly summary, a Select all box and the description "We send at most one email
a day."
```

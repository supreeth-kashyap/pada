---
name: Checkbox
category: Forms
summary: A single on/off choice, with a mixed state for "select all".
react: Checkbox
angular: ds-checkbox
reactDir: Checkbox
angularDir: checkbox
related: CheckboxGroup, Switch, RadioGroup
---
## Overview

Checkbox is a native checkbox with Pada's styles and an optional label. It supports an
indeterminate (mixed) state for parent boxes that control a set. In Angular it works with forms as
a boolean.

## When to use

- To accept a single statement: "I agree to the terms".
- For independent options in a list, where any number can be on.
- In table rows for selection.

## When not to use

- For a setting that takes effect immediately: use **Switch**.
- When only one option can be chosen: use **RadioGroup**.
- For a labelled set with Select all: use **CheckboxGroup**.

## Best practices

### Do

- Write labels as positive statements ("Email me updates", not "Don't email me").
- Use `indeterminate` for a parent box when only some children are checked.
- Put the label to the right of the box and make it clickable.

### Don't

- Don't use a checkbox to trigger an action immediately.
- Don't pre-check consent boxes.

## Accessibility

- Native `<input type="checkbox">`; Space toggles it.
- Indeterminate maps to `aria-checked="mixed"`.
- Inside a Field, the input takes the field's description and error.

## Use with AI

```text
With Pada, add a required Checkbox "I agree to the terms of service" under the sign-up form,
with a Field error "You need to accept the terms" when the form is submitted unchecked.
```

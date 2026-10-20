---
name: Field
category: Forms
summary: Label, control, description and error, wired together for assistive technology.
react: Field
angular: ds-field
reactDir: Field
angularDir: field
related: InputText, Select, Checkbox, FormLabel
---
## Overview

Field is the building block for form rows. `Field.Root` (or `ds-field`) generates the ids and wires
the label, the control, the description and the error together, and carries `invalid`, `required`
and `disabled` to every part. Use it for any control, including your own.

## When to use

- When you compose a custom control (a third-party input, a native select) and want Pada's label,
  help and error.
- When you need a layout the all-in-one inputs don't offer.

## When not to use

- For a standard text input: **InputText** already includes the label, description and error.

## Best practices

### Do

- Write labels as nouns ("Email"), and put rules in the description ("At least 8 characters").
- Write errors that say how to fix the problem ("Enter an email like name@example.com").
- Mark optional fields when most are required, or required ones when most are optional, not both.

### Don't

- Don't use placeholder text as the label.
- Don't show an error before the person has had a chance to type.

## Accessibility

- The label is a `<label for>`; the control gets `aria-describedby` for the description and error,
  and `aria-invalid` while invalid.
- The required asterisk is hidden from screen readers because the control itself is `required`.

## Use with AI

```text
With Pada, wrap our third-party phone input in a Field with the label "Phone number", the
description "We'll text a code to this number." and an error from the form's validation, using
Field.Control asChild (React) or dsInput inside ds-field (Angular).
```

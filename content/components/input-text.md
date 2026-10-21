---
name: InputText
category: Forms
summary: A labelled text input with description, error and prefix or suffix.
react: InputText
angular: ds-input-text
reactDir: InputText
angularDir: input-text
related: Field, InputTextArea, NumberInput, PasswordInput, SearchField
---
## Overview

InputText is the standard single-line text field: label, input, optional description, error and
prefix or suffix content ("$", "kg", an icon). It accepts every native input attribute (`type`,
`autoComplete`, `inputMode`). In Angular it works with forms and shows `error` once the control is
invalid and touched.

## When to use

- For short free text: names, emails, URLs, titles.

## When not to use

- For long text: use **InputTextArea**.
- For numbers with steppers or formatting: use **NumberInput**.
- For passwords: use **PasswordInput**. For search: use **SearchField**.

## Best practices

### Do

- Set `type` and `autoComplete` so browsers and password managers help ("email", "name").
- Size the field to the expected input length.
- Use a prefix or suffix for units and currency instead of putting them in the label.

### Don't

- Don't rely on the placeholder for instructions; it disappears when typing starts.
- Don't validate on every keystroke; validate on blur or submit.

## Accessibility

- The label is programmatically linked; description and error are in `aria-describedby`;
  `aria-invalid` is set while there is an error.

## Use with AI

```text
With Pada, build a profile form with InputText fields Full name (autocomplete="name") and Email
(type="email", autocomplete="email", required) with validation errors shown on blur.
```

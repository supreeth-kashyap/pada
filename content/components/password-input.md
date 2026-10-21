---
name: PasswordInput
category: Forms
summary: A password field with show/hide and an optional strength meter.
react: PasswordInput
angular: ds-password-input
reactDir: PasswordInput
angularDir: password-input
related: InputText, PinInput, Field
---
## Overview

PasswordInput adds a show/hide toggle to a password field and an optional strength meter. It
defaults to `autoComplete="current-password"`; set `"new-password"` on sign-up and change forms.

## When to use

- For sign-in, sign-up and password change forms.

## When not to use

- For one-time codes: use **PinInput**.

## Best practices

### Do

- Use `autoComplete="new-password"` when creating a password so password managers can suggest one.
- Explain the rules in the description before people type.
- Show strength while typing on sign-up; don't on sign-in.

### Don't

- Don't block paste.
- Don't show the password by default.

## Accessibility

- The toggle is a button named "Show password" with `aria-pressed`, controlling the input.
- The strength meter shows a text label next to the bar, so strength is not shown by colour alone.

## Use with AI

```text
With Pada, build a sign-up password field with PasswordInput labelled "Password",
autocomplete="new-password", a strength meter, and the description "At least 12 characters."
```

---
name: Switch
category: Forms
summary: An on/off switch for settings that take effect immediately.
react: Switch
angular: ds-switch
reactDir: Switch
angularDir: switch
related: Checkbox, Toggle
---
## Overview

Switch is a native checkbox with `role="switch"`. Use it for settings that apply as soon as they
change. `loading` shows a spinner in the knob and blocks interaction while a change saves.

## When to use

- For preferences and feature flags that save instantly: "Email notifications".

## When not to use

- When the change only applies after Save: use **Checkbox**.
- For formatting in an editor: use **Toggle**.

## Best practices

### Do

- Label the setting, not the state: "Email notifications", not "On".
- Use `loading` while a server-side change saves, and revert with an error if it fails.

### Don't

- Don't use a switch in a form with a submit button.

## Accessibility

- `role="switch"` with `aria-checked`; Space toggles it. `loading` sets `aria-busy`.

## Use with AI

```text
With Pada, add a Switch labelled "Email notifications" in settings that saves immediately,
shows loading while the request is pending and reverts with a danger toast on failure.
```

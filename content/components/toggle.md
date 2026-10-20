---
name: Toggle
category: Actions
summary: A button that stays pressed, for an on/off option.
react: Toggle
angular: button[dsToggle]
reactDir: Toggle
angularDir: toggle
related: ToggleGroup, Switch, Button
---
## Overview

Toggle is a two-state button: Bold, Italic, Show archived, Mute. It is announced with
`aria-pressed` and can be controlled (`pressed`) or uncontrolled (`defaultPressed`).

## When to use

- For formatting and view options inside editors and toolbars.
- When the option takes effect immediately and is visible in the UI.

## When not to use

- For settings that save a preference: use **Switch**.
- For picking one of several options: use **ToggleGroup** or **SegmentControl**.

## Best practices

### Do

- Keep the label constant; the pressed state shows whether it's on.
- Give icon-only toggles an `aria-label` and a Tooltip.

### Don't

- Don't change the label between states ("Mute" / "Unmute"); screen readers already say pressed.
- Don't use a Toggle to submit or navigate.

## Accessibility

- Native `<button>` with `aria-pressed="true|false"`; Enter and Space switch it.
- State is exposed as `data-state="on|off"` for styling.

## Use with AI

```text
With Pada, add Bold, Italic and Underline Toggles (icon-only, each with an aria-label and a
Tooltip) to the editor toolbar, bound to the editor's formatting state.
```

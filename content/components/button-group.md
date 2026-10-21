---
name: ButtonGroup
category: Actions
summary: A labelled row or column of related buttons that share a size and variant.
react: ButtonGroup
angular: ds-button-group
reactDir: ButtonGroup
angularDir: button
related: Button, ToggleGroup, SplitButton, Toolbar
---
## Overview

ButtonGroup puts related buttons together as a `role="group"` named by `label`. Buttons without
their own `size` or `variant` take the group's, and `attached` joins them into one segmented
shape. Every button keeps its own tab stop.

## When to use

- For a small set of related actions: Previous / Next, Zoom in / Zoom out, Export / Print.
- When the actions should read as one unit visually.

## When not to use

- For a single choice between options with a pressed state: use **ToggleGroup** or **SegmentControl**.
- For a full bar of controls with one tab stop and arrow keys: use **Toolbar**.
- For a main action with alternatives in a menu: use **SplitButton**.

## Best practices

### Do

- Always give the group a `label` that describes the set ("Text alignment", "Pagination").
- Keep the group short: two to four buttons.
- Set `size` and `variant` on the group so every button matches.

### Don't

- Don't mix primary and secondary buttons in an attached group.
- Don't use a group to fake tabs or a radio choice.

## Accessibility

- `role="group"` with the `label` as its accessible name.
- Each button stays a separate tab stop: a group of actions is not a toolbar.

## Use with AI

```text
With Pada, render a ButtonGroup labelled "Text alignment" with attached secondary small buttons
Left, Center and Right, each with a leading icon (align_left, align_center, align_right).
```

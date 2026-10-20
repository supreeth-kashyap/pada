---
name: Sheet
category: Overlays
summary: A bottom sheet for mobile-first flows, with drag and snap points.
react: Sheet
angular: ds-sheet
reactDir: Sheet
angularDir: sheet
related: Drawer, Dialog
---
## Overview

Sheet is a dialog that rises from the bottom edge: filters, a share menu, details on mobile. Drag it
down to close, or between `snapPoints`; Escape and the backdrop close it too. It uses the Dialog
parts inside.

## When to use

- On small screens, for secondary tasks that should keep the page in view.
- For pickers and action lists that are reached with the thumb.

## When not to use

- On desktop layouts with room for a side panel: use **Drawer** or **Dialog**.

## Best practices

### Do

- Give it a title even when it is visually short.
- Use snap points for content that can be glanced at, then expanded.
- Keep the primary action reachable without scrolling.

### Don't

- Don't nest scrolling areas that fight with the drag gesture.

## Accessibility

- A modal dialog: focus trapped, named by its title, Escape closes it. Drag is never the only way to
  close it.

## Use with AI

```text
With Pada, on mobile show the product filters in a Sheet titled "Filters" with snap points at 50%
and 90%, a CheckboxGroup for brands and a RangeSlider for price, and an "Apply" button.
```

---
name: SegmentControl
category: Forms
summary: A compact single choice between a few views or modes.
react: SegmentControl
angular: ds-segment-control
reactDir: SegmentControl
angularDir: segment-control
related: Tabs, Pills, ToggleGroup, RadioGroup
---
## Overview

SegmentControl is a row of segments for switching between a few views or modes: List / Board,
Day / Week / Month. Selection follows focus.

## When to use

- To switch how the same content is shown.
- For two to five short options.

## When not to use

- For panels with different content: use **Tabs**.
- For a form choice that is submitted: use **RadioGroup**.

## Best practices

### Do

- Name it with `aria-label` ("View").
- Keep labels to one or two words; give icon-only segments an `ariaLabel`.

### Don't

- Don't use more than five segments.
- Don't trigger slow loads on every arrow press; selection follows focus.

## Accessibility

- `role="tablist"` with `role="tab"` segments; arrow keys move and select, skipping disabled ones.

## Use with AI

```text
With Pada, add a SegmentControl aria-label="View" with options List and Board (with icons) above
the tasks, switching the layout between a Table and a board.
```

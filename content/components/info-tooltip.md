---
name: InfoTooltip
category: Display
summary: A small info icon that explains the thing next to it.
react: InfoTooltip
angular: ds-info-tooltip
reactDir: InfoTooltip
angularDir: info-tooltip
related: Tooltip, KeyValue, Field
---
## Overview

InfoTooltip is a small info icon button next to a label or value that opens a Tooltip on hover and
keyboard focus. It is named "More info about {label}".

## When to use

- For short explanations of terms, metrics and settings that most people don't need.

## When not to use

- For information needed to complete a task: put it in the field description.
- For rich content: use **Popover**.

## Best practices

### Do

- Keep the text to one or two sentences.
- Pass `label` so the button's name says what it explains.

### Don't

- Don't put several info icons in one row.

## Accessibility

- A native button; Escape closes the tooltip; the trigger references the tooltip only while it is
  open.

## Use with AI

```text
With Pada, add an InfoTooltip after the "Seats" label with label "Seats" and text "Seats are
billed monthly, per active member."
```

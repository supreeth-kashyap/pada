---
name: ProgressCircle
category: Feedback
summary: A compact ring that fills with progress or spins while indeterminate.
react: ProgressCircle
angular: ds-progress-circle
reactDir: Progress
angularDir: progress
related: Progress, Spinner
---
## Overview

ProgressCircle is circular progress for compact places: a file row, a table cell, a button. It
fills clockwise from the top for a known `value`, or spins while `value` is `null`. Three sizes,
with an optional value label in the middle.

## When to use

- When there is no room for a bar: lists, cells, cards.
- For per-item progress in a list of uploads or jobs.

## When not to use

- When there is room for a bar and a label: use **Progress**.
- For a generic page or section wait: use **Spinner** or **Skeleton**.

## Best practices

### Do

- Name it with `label` ("Uploading report.pdf").
- Use `showValue` on the large size when the percentage matters.
- Keep sizes consistent within one list.

### Don't

- Don't show several spinning rings at once for one task.
- Don't use it as decoration.

## Accessibility

- `role="progressbar"` named by `label`, with `aria-valuenow` (left out while indeterminate).
- `data-state` is `indeterminate`, `loading` or `complete`.

## Use with AI

```text
With Pada, add a small ProgressCircle to each row of the upload list, labelled with the file
name and bound to that file's percentage; show it indeterminate until the first progress event.
```

---
name: Progress
category: Feedback
summary: A progress bar for a task with a known (or unknown) amount of work.
react: Progress
angular: ds-progress
reactDir: Progress
angularDir: progress
related: ProgressCircle, Spinner, Skeleton
---
## Overview

Progress shows how far a task has come: an upload, an import, a quota. It is a horizontal bar with
a label; give it a `value` out of `max`. In Angular, `value` of `null` shows an indeterminate,
sweeping bar.

## When to use

- For tasks longer than a couple of seconds where progress can be measured.
- For usage against a limit (storage, seats), alongside the numbers.

## When not to use

- In a tight space such as a table cell or a button: use **ProgressCircle**.
- For short waits with no measurable progress: use **Spinner**.

## Best practices

### Do

- Always give it a `label` that says what is progressing ("Uploading report.pdf").
- Show the numbers next to the bar for quotas ("42 of 50 seats").
- Move to a success state or message when the task completes.

### Don't

- Don't let the bar go backwards or jump to 100% and sit there.
- Don't use colour alone to show a quota is nearly full; add text.

## Accessibility

- `role="progressbar"` with `aria-valuenow`, `aria-valuemin` and `aria-valuemax`.
- State is exposed as `data-state` for styling. The Angular bar is named by `label`; React and
  Angular differences are listed in each Storybook page.

## Use with AI

```text
With Pada, show a Progress bar labelled "Uploading report.pdf" bound to the upload's percentage,
and replace it with a success Alert when the upload finishes.
```

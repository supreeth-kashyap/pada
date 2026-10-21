---
name: Spinner
category: Feedback
summary: An indeterminate loading indicator.
react: Spinner
angular: ds-spinner
reactDir: Spinner
angularDir: spinner
related: ProgressCircle, Skeleton, Progress
---
## Overview

Spinner tells people something is happening when there is no measurable progress. It rotates, and
under reduced motion it pulses slowly instead. Three sizes.

## When to use

- For short waits (a second or two) such as loading a popover or refreshing a panel.
- Inline next to the thing that is loading.

## When not to use

- For first page loads with a known layout: use **Skeleton**.
- When progress is measurable: use **Progress** or **ProgressCircle**.
- Inside a button: use the Button `loading` state.

## Best practices

### Do

- Keep the default `label` ("Loading") or make it specific ("Loading comments").
- Pass `label={null}` when the spinner sits inside something that already announces loading.

### Don't

- Don't show a full-page spinner for content that could load progressively.
- Don't leave a spinner running when a request fails; show an error.

## Accessibility

- With a label, the spinner is `role="status"` with visually hidden text, so the label is announced.
- The animation respects reduced motion.

## Use with AI

```text
With Pada, show a small Spinner labelled "Loading comments" under the post while comments are
fetched, then replace it with the comment list or an EmptyState.
```

---
name: Stack
category: Layout
summary: Flex layout with token-based gaps.
react: Stack
angular: ds-stack
reactDir: Stack
angularDir: stack
related: Grid, Container, Separator
---
## Overview

Stack lays out children in a row or column with a gap from the space scale, so spacing follows the
density setting. It sets alignment, justification and wrapping, and can render as any element.

## When to use

- For almost every one-dimensional layout: form fields, button rows, card content.

## When not to use

- For two-dimensional layouts: use **Grid**.

## Best practices

### Do

- Use space tokens for gaps instead of margins on children.
- Use `wrap` for rows of chips and buttons that may not fit.

### Don't

- Don't nest many Stacks just to add padding; padding belongs to the container.

## Accessibility

- No role; choose the element with `as` (for example `ul` for a list).

## Use with AI

```text
With Pada, lay out the form fields in a column Stack with gap 4 and the footer buttons in a row
Stack justified to the end with gap 2.
```

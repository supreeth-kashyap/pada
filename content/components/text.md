---
name: Text
category: Display
summary: Text set on the type scale.
react: Text
angular: "[dsText]"
reactDir: Text
angularDir: text
related: Heading
---
## Overview

Text applies the type scale to any element: size, weight, family, line height and colour from
tokens. In React choose the element with `as`; in Angular put `dsText` on the element you want.

## When to use

- For body copy, captions, labels and helper text that need a specific step on the scale.

## When not to use

- For headings: use **Heading** so the outline is correct.

## Best practices

### Do

- Use semantic colour tokens (`--pada-color-fg-muted`) for secondary text.
- Choose the right element (`p` for paragraphs, `span` inline).

### Don't

- Don't set raw font sizes; pick a size from the scale so it follows `--pada-type-base`.

## Accessibility

- Text inherits the element's semantics; muted colours still meet contrast in both themes.

## Use with AI

```text
With Pada, render the card description as Text size "sm" in var(--pada-color-fg-muted) inside a p
element.
```

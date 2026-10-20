---
name: Heading
category: Display
summary: A native h1–h6 on the type scale.
react: Heading
angular: h2[dsHeading]
reactDir: Text
angularDir: text
related: Text
---
## Overview

Heading renders a native `h1`–`h6`, so the document outline comes from the element. The level picks a
default size (h1 3xl, h2 2xl, h3 xl, h4 lg, h5 base, h6 sm) that `size` can override when the visual
and the outline differ. Sizes, weights and spacing come from `--pada-heading-*` tokens.

## When to use

- For every page and section title.

## When not to use

- For large numbers or decorative text that isn't a heading: use **Text** or **Stat**.

## Best practices

### Do

- Pick the level from the outline (one h1 per page, no skipped levels), then adjust `size`.
- Keep headings short and descriptive.

### Don't

- Don't choose a heading level for its size.

## Accessibility

- Native heading elements give screen-reader users a navigable outline.

## Use with AI

```text
With Pada, use Heading level 1 for the page title "Billing" and Heading level 3 with size "lg"
for the "Payment method" card title.
```

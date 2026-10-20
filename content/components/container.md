---
name: Container
category: Layout
summary: Centres page content at a readable maximum width.
react: Container
angular: ds-container
reactDir: Container
angularDir: container
related: Stack, Grid
---
## Overview

Container centres content with a maximum width (sizes from small to full) and side gutters that grow
on wider screens.

## When to use

- As the outer wrapper of page content and marketing sections.

## When not to use

- Inside cards or panels that already constrain width.

## Best practices

### Do

- Use the small size for reading (articles, forms) and larger sizes for dashboards.
- Render it as the right element with `as` (`main`, `section`).

### Don't

- Don't nest containers.

## Accessibility

- No role of its own; choose a semantic element with `as`.

## Use with AI

```text
With Pada, wrap the settings page in a Container size "md" rendered as main, with a Stack of
sections inside.
```

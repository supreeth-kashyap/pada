---
name: Separator
category: Display
summary: A thin line between content, horizontal or vertical.
react: Separator
angular: ds-separator
reactDir: Separator
angularDir: separator
related: Stack
---
## Overview

Separator draws a hairline between groups of content, horizontally or vertically, using the border
token.

## When to use

- Between groups in menus, toolbars and long panels.

## When not to use

- Instead of spacing; most groups only need more space between them.

## Best practices

### Do

- Mark purely visual separators as `decorative`.

### Don't

- Don't stack separators with borders on cards and sections.

## Accessibility

- `role="separator"` with `aria-orientation`, or hidden from assistive technology when decorative.

## Use with AI

```text
With Pada, put a vertical decorative Separator between the filters and the actions in the toolbar.
```

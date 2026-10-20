---
name: InfoIcon
category: Display
summary: A small decorative info glyph.
react: none
angular: ds-info-icon
angularDir: info-icon
story: none
related: InfoTooltip, Icon
---
## Overview

InfoIcon is the 12px "i" glyph used next to labels. It is purely decorative and takes the text
colour. React draws the same glyph inside `KeyValue` and `InfoTooltip`.

## When to use

- Inside your own composite components, next to text that already explains the meaning.

## When not to use

- As an interactive help trigger: use **InfoTooltip**, which is a labelled button.

## Best practices

### Do

- Pair it with visible text or a labelled control.

### Don't

- Don't make it the only signal for important information.

## Accessibility

- Decorative SVG; it has no accessible name.

## Use with AI

```text
With pada-ds-angular, use ds-info-tooltip (not ds-info-icon) next to the "Seats" label so the
explanation is reachable from the keyboard.
```

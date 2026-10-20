---
name: Icon
category: Display
summary: An SVG icon from Pada's built-in set that takes the text colour.
react: Icon
angular: ds-icon
reactDir: Icon
angularDir: icon
related: IconButton, BrandLogo
---
## Overview

Icon renders one of Pada's 154 built-in SVG icons by name (`tick_1`, `chevron_down`, `search` …),
in the surrounding text colour, at a given size, in stroke or fill. You can also pass your own SVG
`src`. Icons are decorative by default.

## When to use

- Next to labels in buttons, menus and navigation; as status indicators with text.

## When not to use

- As the only content of a button: use **IconButton**, which requires a label.
- For brand marks: use **BrandLogo** or **PadaLogo**.

## Best practices

### Do

- Use one icon per meaning across the product.
- Size icons with the icon size tokens so they scale with density.
- Give meaningful standalone icons a label.

### Don't

- Don't use icons without text for uncommon actions.

## Accessibility

- Decorative icons are `aria-hidden`; pass a label when the icon carries meaning on its own.

## Use with AI

```text
With Pada, add a success Icon "tick_1" (size 16, colour var(--pada-color-success-fg)) before the
"Saved" status text, and an Icon "alert_1" with label "Warning" for the error rows.
```

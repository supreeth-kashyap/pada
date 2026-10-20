---
name: ThemeProvider
category: Layout
summary: Sets Pada's theme axes for the page or a subtree.
react: ThemeProvider
angular: ds-theme-provider
reactDir: Theme
angularDir: theme
related: ColorPicker
---
## Overview

ThemeProvider sets the theme attributes (`data-theme`, `data-accent`, `data-neutral`,
`data-density`, `data-radius`, `data-motion`, `data-contrast`) on the page root or on its own
element, and shares them through `useTheme()`. It can remember the choice in storage. `ThemeToggle`
switches light and dark with a view transition.

## When to use

- At the app root to apply and persist the person's theme.
- Around a subtree that should look different (a dark sidebar, a compact table).

## When not to use

- If you only need static attributes: set them on `<html>` directly.

## Best practices

### Do

- Default the theme to `system` and let people override it.
- Use a custom accent hue for your brand (`accent="custom"` with a hue).

### Don't

- Don't override individual colours to brand the product; change the knobs.

## Accessibility

- `data-motion="reduced"` and `data-contrast="more"` follow the OS settings by default; offer them
  as preferences too.

## Use with AI

```text
With Pada, wrap the app in a ThemeProvider target="root" with defaultTheme "system", accent
"custom" with our brand hue 262, density "compact" and a storageKey, and add a ThemeToggle to the
header.
```

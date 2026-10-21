---
name: PadaLogo
category: Display
summary: The Pada logo as inline SVG: mark, wordmark or both.
react: PadaLogo
angular: ds-pada-logo
reactDir: PadaLogo
angularDir: pada-logo
related: BrandLogo
---
## Overview

PadaLogo draws the Pada mark, the "Pada . design" wordmark, or the lockup of both, as inline SVG.
Tones are colour, accent (follows the theme's accent) and mono.

## When to use

- In products built with Pada that credit the system, and on Pada's own pages.

## When not to use

- For third-party logos: use **BrandLogo**.

## Best practices

### Do

- Use the mark alone where space is tight (favicons, collapsed sidebars).
- Use the mono tone on busy backgrounds.

### Don't

- Don't redraw or stretch the mark.

## Accessibility

- Named by `title`; mark it `decorative` when the name is already present in text.

## Use with AI

```text
With Pada, show the PadaLogo lockup (tone accent) in the sidebar header, switching to the mark
variant when the sidebar is collapsed.
```

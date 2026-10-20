---
name: ColorPicker
category: Forms
summary: Pick a colour in OKLCH with an area, a hue slider, a hex field and swatches.
react: ColorPicker
angular: ds-color-picker
reactDir: ColorPicker
angularDir: color-picker
related: Slider, InputText
---
## Overview

ColorPicker works in OKLCH, the perceptual colour space Pada's tokens use. It has a 2D area for
chroma and lightness, a hue slider, a hex field and optional swatches. Colours outside sRGB show at
their nearest displayable colour. The value can be hex or OKLCH (`format`).

## When to use

- For brand or theme colours, tags and labels with custom colours.
- Together with Pada's custom accent (`data-accent="custom"` and `--pada-accent-hue`).

## When not to use

- When a fixed palette is enough: offer **RadioCardGroup** or swatches only.

## Best practices

### Do

- Provide `swatches` for the colours people use most (brand colours).
- Check contrast when a picked colour is used for text or controls.
- Store OKLCH when you will derive tints from the colour.

### Don't

- Don't use a colour picker as the only way to tell items apart; add names or icons.

## Accessibility

- The area is a 2D slider: arrows change chroma and lightness (Shift ×10), PageUp/PageDown
  lightness, Home/End chroma. The hue is a standard slider.
- The hex field commits on Enter or blur and reverts on Escape; it is `aria-invalid` while it holds
  text that is not a colour.

## Use with AI

```text
With Pada, add a ColorPicker labelled "Accent colour" with swatches for our brand colours. When
the value changes, set data-accent="custom" and --pada-accent-hue on the preview container so
every component re-themes.
```

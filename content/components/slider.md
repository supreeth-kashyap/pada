---
name: Slider
category: Forms
summary: A labelled single-value slider.
react: Slider
angular: ds-slider
reactDir: Slider
angularDir: slider
related: RangeSlider, NumberInput
---
## Overview

Slider picks one value from a range by dragging or with the keyboard: volume, opacity, zoom. It has
a label, an optional live value, a description and an error.

## When to use

- For approximate values where immediate feedback helps (preview updates as it moves).

## When not to use

- For exact values: use **NumberInput**.
- For a range: use **RangeSlider**.

## Best practices

### Do

- Show the value (`showValue`) when the number matters.
- Use sensible `min`, `max` and `step`.

### Don't

- Don't use a slider without a label; pass `aria-label` if there is no visible one.

## Accessibility

- Arrow keys step, PageUp/PageDown take ten steps, Home/End jump to the limits.
- React uses a native range input; Angular uses a `role="slider"` thumb with the same keyboard map.

## Use with AI

```text
With Pada, add a Slider labelled "Volume" from 0 to 100 with showValue, updating the audio
player's volume as it moves.
```

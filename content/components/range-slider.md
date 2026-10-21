---
name: RangeSlider
category: Forms
summary: A slider with two thumbs for picking a range.
react: RangeSlider
angular: ds-range-slider
reactDir: RangeSlider
angularDir: range-slider
related: Slider, NumberInput, DateRangePicker
---
## Overview

RangeSlider picks a low and a high value: price, size, duration. Each thumb is a slider in its own
right; pressing the track moves the nearest thumb. Values can be formatted with `formatOptions`.

## When to use

- For filters with a numeric range where approximate values are fine.

## When not to use

- When exact numbers matter: use two **NumberInput**s (or pair them with the slider).
- For date ranges: use **DateRangePicker**.

## Best practices

### Do

- Show the current values (`showValue`) and format them (currency, units).
- Name the thumbs with `thumbLabels` ("Minimum price", "Maximum price").
- Use `minStepsBetweenThumbs` to stop the thumbs crossing.

### Don't

- Don't use a step so small that the thumbs are hard to place.

## Accessibility

- Two `role="slider"` thumbs with their own labels and value text.
- Arrow keys step, PageUp/PageDown take ten steps, Home/End jump as far as the other thumb allows.

## Use with AI

```text
With Pada, add a RangeSlider labelled "Price" from 0 to 1000 in steps of 10, formatted as USD,
thumb labels "Minimum price" and "Maximum price", that filters the product list on commit.
```

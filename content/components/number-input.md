---
name: NumberInput
category: Forms
summary: A number field with steppers, keyboard stepping and locale formatting.
react: NumberInput
angular: ds-number-input
reactDir: NumberInput
angularDir: number-input
related: InputText, Slider
---
## Overview

NumberInput is a spinbutton: type a value, use Up/Down, PageUp/PageDown and Home/End, or press and
hold the steppers. Values are formatted with `formatOptions` (currency, percent, units) and typed
text is parsed in the same locale.

## When to use

- For quantities, prices, percentages and limits with a known range.

## When not to use

- For identifiers that look like numbers (phone numbers, card numbers, ZIP codes): use **InputText**.
- For picking a rough value in a range: use **Slider**.

## Best practices

### Do

- Set `min`, `max` and `step` to the real limits.
- Use `formatOptions` for currency and units rather than putting symbols in the label.

### Don't

- Don't use it for very large ranges where stepping is pointless; hide the steppers.

## Accessibility

- WAI-ARIA Spinbutton: `aria-valuenow`, `aria-valuemin`, `aria-valuemax` and a readable
  `aria-valuetext` with the formatted value.

## Use with AI

```text
With Pada, add a NumberInput labelled "Seats" with min 1, max 500, step 1, and another labelled
"Monthly budget" formatted as USD currency with no decimals.
```

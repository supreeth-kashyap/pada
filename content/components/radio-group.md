---
name: RadioGroup
category: Forms
summary: A single choice from a short list.
react: RadioGroup
angular: ds-radio-group
reactDir: RadioGroup
angularDir: radio-group
related: RadioCardGroup, Select, CheckboxGroup, SegmentControl
---
## Overview

RadioGroup is a labelled set of native radio buttons for picking exactly one option. Tab reaches the
group, arrow keys move and select, and the value submits with native forms.

## When to use

- For two to about six mutually exclusive options that should all be visible.

## When not to use

- For many options: use **Select**.
- For options that need descriptions and prices: use **RadioCardGroup**.
- For a binary on/off: use **Switch** or **Checkbox**.

## Best practices

### Do

- Order options logically (by frequency, size or time).
- Set a sensible default when one exists.
- Keep labels short and parallel.

### Don't

- Don't use radios for actions; selecting a radio should never navigate or submit.

## Accessibility

- `role="radiogroup"` named by the label; native radios give arrow-key navigation.

## Use with AI

```text
With Pada, add a RadioGroup labelled "Delivery" with options Standard, Express and Pick up in
store, defaulting to Standard, bound to the checkout form.
```

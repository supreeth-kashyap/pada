---
name: Stat
category: Display
summary: A key figure with a label, delta, description and chart slot.
react: Stat
angular: ds-stat
reactDir: Stat
angularDir: stat
related: Card, Badge, Progress
---
## Overview

Stat shows a KPI: a label, a big value that counts to its new number when it changes, an optional
delta coloured by whether the change is good, a description and a chart slot for a sparkline.
Values and deltas are formatted with `Intl.NumberFormat` options.

## When to use

- On dashboards and summaries for the few numbers that matter.

## When not to use

- For tables of numbers: use **Table**.

## Best practices

### Do

- Format values (`formatOptions`) and deltas (percent) and say what the delta compares to
  ("vs last month").
- Use `invertTrend` for metrics where down is good (churn, errors).
- Keep a row of stats to four or fewer.

### Don't

- Don't show a delta without a comparison period.

## Accessibility

- Screen readers get the final value, never the frames of the count animation; the animation is off
  under reduced motion.

## Use with AI

```text
With Pada, show a row of Stats in Cards: Revenue (USD, delta +12.4% vs last month), Active users,
and Churn (percent, invertTrend), each with a small sparkline in the chart slot.
```

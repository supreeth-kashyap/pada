---
name: RadioCardGroup
category: Forms
summary: A single choice presented as rich cards.
react: RadioCardGroup
angular: ds-radio-card-group
reactDir: RadioCard
angularDir: radio-card
related: RadioGroup, SegmentControl, Card
---
## Overview

RadioCardGroup presents a single choice as cards with a title, description, icon and extra content:
plans, shipping speeds, templates. It is built on native radios, so it submits with forms and
behaves like any radio group.

## When to use

- When each option needs explanation or a price to choose well.
- For a small number of options (two to six) that deserve visual weight.

## When not to use

- For short, simple options: use **RadioGroup**.
- For switching views: use **SegmentControl** or **Tabs**.

## Best practices

### Do

- Keep card content parallel: the same fields in the same order.
- Use `columns` to lay cards out in a grid; one column on small screens.
- Preselect the recommended option when there is one.

### Don't

- Don't put links or buttons inside a card; the whole card is the choice.

## Accessibility

- Native radio inputs: Tab reaches the group, arrow keys move and select.
- The title names each radio and the description is announced with it.

## Use with AI

```text
With Pada, render a RadioCardGroup labelled "Plan" with three options (Starter, Team, Business),
each with a title, a price in meta and a one-line description, in three columns, Team preselected.
```

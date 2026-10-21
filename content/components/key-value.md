---
name: KeyValue
category: Display
summary: A label on the left and a value on the right.
react: KeyValue
angular: ds-key-value
reactDir: KeyValue
angularDir: key-value
related: DescriptionList, InfoTooltip
---
## Overview

KeyValue pairs a label with a value for settings and detail panels, with an optional info tooltip on
the label. The value can be any content.

## When to use

- For a few labelled values in a panel or card.

## When not to use

- For many fields from data: use **DescriptionList**.
- For editable values: use form fields.

## Best practices

### Do

- Keep labels short and aligned; put units in the value.
- Use the info tooltip for terms that need explaining.

### Don't

- Don't use it for long text values.

## Accessibility

- The label and value are read in order; the info tooltip is a labelled button.

## Use with AI

```text
With Pada, show the plan details as KeyValue rows: Plan (Team), Seats (12 of 20, with an info
tooltip), Renews on (date) and Owner (Avatar with name).
```

---
name: DescriptionList
category: Data
summary: A record's attributes as sections of terms and values, from data.
react: DescriptionList
angular: ds-description-list
reactDir: DescriptionList
angularDir: description-list
related: KeyValue, Card, Table
---
## Overview

DescriptionList renders the fields of one record from `data`: sections with a header (tooltip,
buttons, badges) and rows of terms and values. Values can be text, an avatar with a name, a badge, a
button or custom content. Button presses come out of `onAction`.

## When to use

- On detail pages and drawers for a record: an order, a user, a policy.

## When not to use

- For a single pair in a settings row: use **KeyValue**.
- For many records: use **Table** or **DataTable**.

## Best practices

### Do

- Group fields into sections with clear headers ("Ownership", "Billing").
- Map your API response to the component's data shape in one adapter function.
- Show an em dash for empty values rather than hiding the row.

### Don't

- Don't use it for editable forms; switch to form fields when editing.

## Accessibility

- Each section is a `role="group"` named by its header, holding a native `dl` with `dt` and `dd`.

## Use with AI

```text
With Pada, show the order in a DescriptionList with sections Customer (name with avatar, email)
and Status (a success badge "Paid", payment method), plus an "Edit" button in the section header
handled by onAction. Write a toDescriptionListData(order) adapter.
```

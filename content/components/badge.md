---
name: Badge
category: Display
summary: A short status label or a count.
react: Badge
angular: ds-badge
reactDir: Badge
angularDir: badge
related: Tags, Avatar, Stat
---
## Overview

Badge labels status or shows a count: "Beta", "Overdue", "12". It comes in six tones (neutral,
accent, success, warning, danger, info), subtle, solid or outline, two sizes, a `count` with `max` ("99+") and
a `dot` mode.

## When to use

- For status in tables and cards, and counts on navigation items.

## When not to use

- For removable or clickable labels: use **Tags**.
- For important messages: use **Alert**.

## Best practices

### Do

- Keep the text to one or two words.
- Use tones consistently across the product (danger always means failed or overdue).
- Use `max` so large counts don't break the layout.

### Don't

- Don't use badges as buttons.
- Don't use a dot without a text alternative nearby.

## Accessibility

- Plain text, so it is read with its context; counts can be given a fuller label with `aria-label`
  ("12 unread messages").

## Use with AI

```text
With Pada, show each invoice's status as a Badge: Paid (success), Due (warning), Overdue (danger),
Draft (neutral), and an unread count Badge (max 99) on the Inbox sidebar item.
```

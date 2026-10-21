---
name: Avatar
category: Display
summary: A picture for a person or entity, with initials and status fallbacks.
react: Avatar
angular: ds-avatar
reactDir: Avatar
angularDir: avatar
related: HoverCard, Badge, DescriptionList
---
## Overview

Avatar shows a person's or organisation's picture once it loads; until then (or if it fails) it shows
initials on a colour derived from the name, or a person icon. Five sizes, circle or square shape, and
an optional status dot (online, away, busy, offline). `AvatarGroup` overlaps several with a "+N"
counter.

## When to use

- Next to names in lists, comments, assignees and headers.

## When not to use

- For company or tool logos: use **BrandLogo**.

## Best practices

### Do

- Always pass `name`, so the fallback and the accessible name work.
- Use the square shape for organisations and workspaces.
- Cap groups (for example at four) and show the rest as "+N".

### Don't

- Don't rely on the status colour alone; show the status in text somewhere.

## Accessibility

- With a picture, `alt` defaults to the name; next to a visible name, mark it decorative with an
  empty `alt` to avoid repetition.

## Use with AI

```text
With Pada, show the task assignees as an AvatarGroup of small avatars (name and src from the API),
capped at 4 with a "+N" counter, each wrapped in a Tooltip with the person's name.
```

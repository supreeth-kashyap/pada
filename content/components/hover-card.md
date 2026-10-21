---
name: HoverCard
category: Overlays
summary: A rich preview shown when hovering or focusing a link.
react: HoverCard
angular: ds-hover-card
reactDir: HoverCard
angularDir: hover-card
related: Tooltip, Popover, Avatar
---
## Overview

HoverCard shows a preview of what a link points to: a profile, a page, a repository. It opens after
a short delay on hover or keyboard focus and stays open while the pointer is over the card.

## When to use

- For optional previews that help people decide whether to follow a link.

## When not to use

- For essential information or actions: they must be reachable through the link itself.
- For a short label: use **Tooltip**.

## Best practices

### Do

- Keep the card informational: an avatar, a name, a short bio, a few stats.
- Make the trigger a real link to the full page.

### Don't

- Don't put buttons or forms in a hover card.

## Accessibility

- Opens on hover (not touch) and keyboard focus. The card is supplementary: touch and screen-reader
  users may never see it, so everything in it must also be available at the link's destination.

## Use with AI

```text
With Pada, wrap each author name in a HoverCard whose trigger is a Link to the profile and whose
content shows their Avatar, name, role and number of posts.
```

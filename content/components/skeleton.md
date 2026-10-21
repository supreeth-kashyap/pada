---
name: Skeleton
category: Feedback
summary: A shimmering placeholder that holds the shape of content while it loads.
react: Skeleton
angular: ds-skeleton
reactDir: Skeleton
angularDir: skeleton
related: Spinner, EmptyState, ProgressCircle
---
## Overview

Skeleton draws the outline of content that is on its way: lines of text, a rectangle for an image,
a circle for an avatar. It reduces layout shift and makes loading feel faster.

## When to use

- For the first load of a page, card or list whose layout you know.
- When content takes more than a moment and will replace the placeholder in place.

## When not to use

- For actions the person just started (saving, sending): use a **Button** loading state or **Spinner**.
- When the load failed or returned nothing: use **EmptyState**.

## Best practices

### Do

- Match the real layout: the same number of lines, avatar size and card height.
- Use `lines` for text blocks; the last line is shorter, like real text.
- Mark the loading region with `aria-busy="true"` and remove it when content arrives.

### Don't

- Don't show skeletons for more than a few seconds without a fallback message.
- Don't mix skeletons and spinners in the same region.

## Accessibility

- Skeletons are hidden from assistive technology (`aria-hidden`). Announce loading through
  `aria-busy` on the region.
- The shimmer stops under reduced motion.

## Use with AI

```text
With Pada, while the team list loads, render five rows of Skeletons: a circle (40px) for the
avatar and two text lines, inside a region with aria-busy="true" that is removed once the data
arrives.
```

---
name: Carousel
category: Display
summary: A rotating set of slides with controls.
react: Carousel
angular: ds-carousel
reactDir: Carousel
angularDir: carousel
related: Tabs, ScrollArea
---
## Overview

Carousel shows one slide at a time with previous/next buttons and dots. Auto-rotation (`autoPlay`)
pauses while the pointer or keyboard focus is inside, can be paused with its rotation button and is
off when the person prefers reduced motion.

## When to use

- For a few visual highlights, onboarding tips or image galleries where seeing all at once isn't
  needed.

## When not to use

- For important content: people rarely see slides after the first.
- For long lists: use a grid or a horizontal **ScrollArea**.

## Best practices

### Do

- Keep it to three to five slides and name the carousel with `label`.
- Make each slide make sense on its own.

### Don't

- Don't auto-rotate slides that contain text people need to read.

## Accessibility

- WAI-ARIA Carousel: slides are labelled "n of m"; the rotation control is a real button; rotation
  stops on focus and hover.

## Use with AI

```text
With Pada, add a Carousel labelled "What's new" with three slides (image, heading, one line of
text), showDots and showNav, without auto-play.
```

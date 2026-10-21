---
name: ScrollArea
category: Layout
summary: A scrolling region with slim, themed scrollbars and faded edges.
react: ScrollArea
angular: ds-scroll-area
reactDir: ScrollArea
angularDir: scroll-area
related: Resizable, Carousel
---
## Overview

ScrollArea adds slim, themed scrollbars and faded edges to an overflowing region while keeping native
scrolling (touch, wheel, keyboard, snapping, find-in-page).

## When to use

- For panels and lists with their own scroll inside a fixed layout.
- For horizontal rows of items.

## When not to use

- For the main page scroll.

## Best practices

### Do

- Give it an `aria-label` when content overflows, since it becomes focusable.
- Keep only one scrolling area per direction in a view.

### Don't

- Don't hide scrollbars entirely on content people need to explore.

## Accessibility

- When content overflows, the region becomes focusable so keyboard users can scroll it.

## Use with AI

```text
With Pada, wrap the notifications list in a ScrollArea with max height 400px and aria-label
"Notifications".
```

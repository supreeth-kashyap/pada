---
name: AspectRatio
category: Layout
summary: Keeps content at a fixed shape; media inside fill it.
react: AspectRatio
angular: ds-aspect-ratio
reactDir: AspectRatio
angularDir: aspect-ratio
related: Card, Carousel
---
## Overview

AspectRatio keeps its content at a fixed width-to-height ratio (16/9, 4/3, 1). Images and videos
inside fill it and are cropped to fit, so layouts don't jump as media loads.

## When to use

- For thumbnails, video embeds, maps and cover images.

## When not to use

- For text content whose height should grow.

## Best practices

### Do

- Use the media's real ratio where possible to avoid cropping important parts.
- Set `alt` text on the images inside.

### Don't

- Don't nest scrollable content inside.

## Accessibility

- A layout wrapper with no role; accessibility comes from the media inside.

## Use with AI

```text
With Pada, wrap each project thumbnail in an AspectRatio of 16/9 inside its Card, with the image
covering the area and meaningful alt text.
```

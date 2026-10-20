---
name: Card
category: Display
summary: A bordered surface that groups related content.
react: Card
angular: ds-card
reactDir: Card
angularDir: card
related: Stat, DescriptionList, RadioCardGroup
---
## Overview

Card is a bordered, rounded surface for a self-contained piece of content: a summary, a plan, a
project tile. It follows the theme's surface, border and radius tokens.

## When to use

- To group content that belongs together on dashboards and grids.

## When not to use

- To wrap a whole page or every section; use spacing and headings instead.
- For selectable options: use **RadioCardGroup**.

## Best practices

### Do

- Give each card a heading and keep content parallel across a grid.
- If the whole card is a link, make one link cover it rather than nesting several.

### Don't

- Don't nest cards inside cards.

## Accessibility

- A plain container; give it structure with headings. Use a list when cards are a collection.

## Use with AI

```text
With Pada, render a Grid (minItemWidth 280px) of Cards for projects, each with a Heading level 3,
a short description, a status Badge and an owner Avatar.
```

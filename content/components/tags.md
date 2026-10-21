---
name: Tags
category: Display
summary: A tinted label for categories and metadata.
react: Tags
angular: ds-tags
reactDir: Tags
angularDir: tags
related: Badge, TagGroup, TagInput
---
## Overview

Tags label items with categories and metadata: "Design", "Q3", "Owner: Ada". They come in six
variants (neutral, primary, secondary, success, danger, royal) with an optional leading icon. In
Angular, `ds-tag` with `removable` adds a remove button.

## When to use

- For categories, topics and attributes on cards and rows.

## When not to use

- For status: use **Badge**.
- For entering values: use **TagInput**.

## Best practices

### Do

- Keep tag text short and consistent in case.
- Use colour to group categories, not to rank them.

### Don't

- Don't use the deprecated hue names (`gray`, `blue` …); use the variants.

## Accessibility

- Plain text; a removable tag's button is named "Remove <label>".

## Use with AI

```text
With Pada, show the article's topics as Tags (variant neutral) under the title, and its status as
a Badge.
```

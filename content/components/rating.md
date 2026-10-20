---
name: Rating
category: Forms
summary: A star rating, interactive or read-only.
react: Rating
angular: ds-rating
reactDir: Rating
angularDir: rating
related: RadioGroup, Stat
---
## Overview

Rating shows or collects a score out of `max` stars. Interactive ratings are a radio group (hover
previews, the value submits with forms, `allowClear` lets people remove their rating); read-only
ratings are a single image named like "4.5 out of 5 stars".

## When to use

- To collect quick satisfaction feedback.
- To display an average score next to reviews.

## When not to use

- For precise scores or scales with meaning per step: use **RadioGroup** with labelled options.

## Best practices

### Do

- Show the number and the count of ratings next to a read-only rating ("4.5 · 120 reviews").
- Label interactive ratings with the question ("Rate your experience").

### Don't

- Don't use stars for things that aren't quality judgements.

## Accessibility

- Interactive: a radio group; Tab in, arrow keys change the value.
- Read-only: `role="img"` with a text alternative.

## Use with AI

```text
With Pada, add an interactive Rating labelled "Rate your experience" (max 5, allowClear) to the
feedback form, and show a readOnly Rating with the product's average next to its title.
```

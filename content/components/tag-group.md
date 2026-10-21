---
name: TagGroup
category: Display
summary: A wrapping list of removable tags with one tab stop.
react: none
angular: ds-tag-group
angularDir: tags
story: Tags
related: Tags, TagInput, Toolbar
---
## Overview

TagGroup lists removable tags (active filters, selected recipients) as one keyboard unit. Arrow keys
move between the tags' remove buttons, Delete or Backspace removes the focused tag, and focus moves to
the next tag once it is gone. Available in Angular; React has it on the roadmap.

## When to use

- To show active filters or selections that people can remove one by one.

## When not to use

- For typing new values: use **TagInput**.
- For static labels: use **Tags**.

## Best practices

### Do

- Name the group with `label` ("Active filters").
- Offer a "Clear all" button next to long groups.

### Don't

- Don't mix removable and non-removable tags in one group.

## Accessibility

- `role="list"` with each tag a `listitem`; one tab stop with arrow keys and Home/End.

## Use with AI

```text
With pada-ds-angular, show the active filters in a ds-tag-group label="Active filters" with a
removable ds-tag per filter that removes it on (remove).
```

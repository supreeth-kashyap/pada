---
name: ToggleGroup
category: Actions
summary: A segmented set of toggles with one tab stop and arrow-key navigation.
react: ToggleGroup
angular: ds-toggle-group
reactDir: ToggleGroup
angularDir: toggle-group
related: Toggle, SegmentControl, ButtonGroup, Toolbar
---
## Overview

ToggleGroup groups related toggles. With `type="single"` one item can be pressed (text alignment),
with `type="multiple"` several (bold, italic, underline). The group is one tab stop; arrow keys
move between items.

## When to use

- For related formatting or view options in an editor or toolbar.
- For a compact single choice that should look like pressed buttons.

## When not to use

- For a group of independent actions: use **ButtonGroup**.
- For switching between views or modes of the page: use **SegmentControl** or **Tabs**.

## Best practices

### Do

- Name the group with `aria-label` ("Text alignment").
- Give icon-only items an `aria-label` each.
- Use `type="single"` when the options exclude each other.

### Don't

- Don't mix actions and toggles in one group.
- Don't make groups longer than about five items.

## Accessibility

- One tab stop; Left/Right (or Up/Down when vertical) and Home/End move focus.
- Items announce `aria-pressed` (multiple) or act as radio items (single).

## Use with AI

```text
With Pada, add a ToggleGroup type="single" aria-label="Text alignment" with icon-only items Left,
Center, Right and Justify, bound to the paragraph's alignment.
```

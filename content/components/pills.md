---
name: Pills
category: Navigation
summary: A row of rounded, single-select pills for switching views or filters.
react: Pills
angular: ds-pills
reactDir: Pills
angularDir: pills
related: SegmentControl, Tabs, Tags
---
## Overview

Pills are rounded choices for switching quickly between views or filters: All, Open, Closed. They
behave like tabs: arrow keys move and select, and only the selected pill is in the tab order.

## When to use

- For quick filters above a list or feed.

## When not to use

- For panels with different content: use **Tabs**.
- For many filters at once: use the **Toolbar** filters.

## Best practices

### Do

- Keep labels to one or two words; add counts when helpful ("Open 12").
- Default to the most useful option.

### Don't

- Don't wrap pills onto several lines; scroll or reduce the options.

## Accessibility

- A tab list: arrow keys and Home/End move and select, wrapping and skipping disabled pills.

## Use with AI

```text
With Pada, add Pills with options All, Open and Closed above the issue list, filtering the list
by status.
```

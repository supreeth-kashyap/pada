---
name: Tabs
category: Navigation
summary: Tabbed sections that switch panels in place.
react: Tabs
angular: ds-tabs
reactDir: Tabs
angularDir: tabs
related: SegmentControl, Pills, Indexer
---
## Overview

Tabs organise related content into panels shown one at a time. Compose `Tabs.Root`, `Tabs.List`,
`Tabs.Trigger` and `Tabs.Content`; choose a visual `variant`, horizontal or vertical `orientation`,
and automatic or manual `activationMode`. A sliding indicator follows the selected tab.

## When to use

- To split a page into peer sections: Overview, Activity, Settings.

## When not to use

- For steps in a sequence: use **Steps**.
- To switch the view of the same data: use **SegmentControl**.
- When people need to compare content side by side.

## Best practices

### Do

- Keep labels short and use nouns.
- Use `activationMode="manual"` when panels are slow to render.
- Keep the selected tab in the URL for deep links.

### Don't

- Don't nest tabs inside tabs.
- Don't use tabs for navigation between pages; use links.

## Accessibility

- WAI-ARIA Tabs: one tab stop for the list; arrow keys move, Home/End jump; panels are labelled by
  their tabs.

## Use with AI

```text
With Pada, split the project page into Tabs (Overview, Activity, Settings) with the selected tab
synced to the ?tab= query parameter.
```

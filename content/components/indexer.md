---
name: Indexer
category: Navigation
summary: An "on this page" index that follows the reader.
react: Indexer
angular: ds-indexer
reactDir: Indexer
angularDir: indexer
related: Tabs, ScrollArea, Sidebar
---
## Overview

Indexer lists the sections of a long page and highlights the one being read. Clicking an entry
scrolls its section into view (smoothly, unless the person prefers reduced motion). Sections are
found by id; `offset` sets where a section becomes active.

## When to use

- On long documentation, settings and report pages with clear sections.

## When not to use

- For switching between separate panels: use **Tabs**.
- On short pages with two or three sections.

## Best practices

### Do

- Use the section headings as labels.
- Keep it sticky next to the content on wide screens; hide it on narrow ones.

### Don't

- Don't nest more than one level of entries.

## Accessibility

- A labelled navigation landmark; the active entry has `aria-current`.

## Use with AI

```text
With Pada, add a sticky Indexer to the right of the settings page listing the sections Profile,
Notifications, Security and Billing (by their heading ids).
```

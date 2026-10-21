---
name: Resizable
category: Layout
summary: Panels separated by handles that people drag to resize.
react: Resizable
angular: ds-resizable
reactDir: Resizable
angularDir: resizable
related: ScrollArea, Sidebar
---
## Overview

Resizable splits a region into panels with handles between them: an editor and a preview, a list and
a detail view. Panels can have minimum sizes and be collapsible. Compose `Resizable.Root`,
`Resizable.Panel` and `Resizable.Handle`.

## When to use

- For tools where people tune the layout to their task.

## When not to use

- For simple pages; fixed responsive layouts are easier to use.

## Best practices

### Do

- Set sensible minimum sizes so panels never become unusable.
- Remember sizes per person.

### Don't

- Don't nest many levels of resizable panels.

## Accessibility

- Handles are focusable separators: arrow keys resize, Home/End jump to the limits, Enter collapses
  a collapsible panel. Named "Resize" unless you pass a label.

## Use with AI

```text
With Pada, split the editor into a Resizable group: a file tree panel (min 15%, collapsible), a
handle, and the editor panel, saving the sizes to local storage.
```

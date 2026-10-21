---
name: Tree
category: Data
summary: A tree of items for file browsers, navigation and nested settings.
react: Tree
angular: ds-tree
reactDir: Tree
angularDir: tree
related: Sidebar, List, Accordion
---
## Overview

Tree shows hierarchical items that expand and collapse: folders and files, nested categories.
Selection is `single`, `multiple` or `none`. Pass `items`, or compose `Tree.Root`, `Tree.Item`,
`Tree.ItemRow`, `Tree.ItemLabel` and `Tree.Group` for custom rows.

## When to use

- For deep hierarchies people browse and select from.

## When not to use

- For two-level navigation: use **Sidebar** sections.
- For collapsible content sections: use **Accordion**.

## Best practices

### Do

- Name the tree with `aria-label` ("Files").
- Use icons to tell item types apart (folder, file).
- Load children lazily for large trees.

### Don't

- Don't put buttons inside rows; use a context menu or a row menu.

## Accessibility

- WAI-ARIA Tree View: Up/Down move, Right expands or enters, Left collapses or goes up, Home/End
  jump, `*` expands siblings, typing jumps to an item.

## Use with AI

```text
With Pada, render the project files as a Tree aria-label="Files" with single selection, folder
and file icons, and open the selected file in the editor.
```

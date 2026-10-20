---
name: CommandPalette
category: Overlays
summary: A searchable list of actions in a dialog, opened with ⌘K.
react: CommandPalette
angular: ds-command-palette
reactDir: CommandPalette
angularDir: command-palette
related: SearchField, Dialog, DropdownMenu, Kbd
---
## Overview

CommandPalette is a keyboard-first launcher: press ⌘K (Ctrl+K), type to filter commands with fuzzy,
ranked matching, use the arrows and press Enter to run. Commands have a label, a group, keywords,
an icon and an optional shortcut.

## When to use

- In apps with many pages and actions, for power users and fast navigation.

## When not to use

- As the only way to reach features; the palette complements visible navigation.
- For filtering a single list: use **SearchField**.

## Best practices

### Do

- Group commands (Navigation, Create, Settings) and add `keywords` for synonyms.
- Show shortcuts so people learn them.
- Advertise the hotkey in the UI (a search button with a Kbd hint).

### Don't

- Don't run destructive commands without confirmation.

## Accessibility

- A modal dialog with a combobox and a listbox; the active option is referenced with
  `aria-activedescendant`. Escape closes and restores focus.

## Use with AI

```text
With Pada, add a CommandPalette (hotkey ⌘K) with groups Navigation (Dashboard, Projects,
Settings), Create (New project, Invite member) and Theme (Light, Dark), each command with an icon
and keywords, wired to the router and actions.
```

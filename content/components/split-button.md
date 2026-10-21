---
name: SplitButton
category: Actions
summary: A main action joined to a chevron that opens related actions.
react: SplitButton
angular: ds-split-button
reactDir: SplitButton
angularDir: button
related: Button, DropdownMenu, ButtonGroup
---
## Overview

SplitButton joins a primary action ("Save") to a chevron button that opens related alternatives
("Save as draft", "Save and publish"). `SplitButton.Root` sets the variant and size for both
halves; the chevron (`SplitButton.Splitter`) is usually a DropdownMenu trigger.

## When to use

- When one action is the common default and a few variants are occasionally needed.
- In toolbars and form footers where space is tight.

## When not to use

- When the options are equally likely: use a **DropdownMenu** with a labelled trigger.
- When there is only one action: use **Button**.

## Best practices

### Do

- Make the main half do the most common action, with a clear verb.
- Name the splitter with `label` ("More save options").
- Keep the menu short and closely related to the main action.

### Don't

- Don't put unrelated or destructive actions in the menu.
- Don't use the deprecated `Button split` prop; use SplitButton.

## Accessibility

- Two native buttons, each a tab stop. The splitter announces its label and `aria-expanded`.
- The menu follows the WAI-ARIA Menu Button pattern (arrows, Home/End, type-ahead, Escape).

## Use with AI

```text
With Pada, build a SplitButton whose main action is "Save" and whose chevron (label "More save
options") opens a DropdownMenu with "Save as draft" and "Save and publish".
```

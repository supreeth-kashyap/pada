---
name: Popover
category: Overlays
summary: A non-modal panel anchored to a trigger.
react: Popover
angular: ds-popover
reactDir: Popover
angularDir: popover
related: Tooltip, HoverCard, DropdownMenu, Dialog
---
## Overview

Popover is a floating panel next to a trigger for light, interactive content: filters, a quick
form, a colour picker. It closes on Escape, a click outside and when focus leaves it. Compose
`Popover.Root`, `Trigger`, `Content`, `Title`, `Arrow`, `Close` and `CloseButton`; `Popover.Anchor`
positions it against another element.

## When to use

- For small tasks related to the trigger that shouldn't block the page.

## When not to use

- For a list of actions: use **DropdownMenu**.
- For a short description on hover: use **Tooltip**.
- For blocking tasks: use **Dialog**.

## Best practices

### Do

- Give it a `Popover.Title` so it has a name.
- Choose `side` and `align` so it doesn't cover what people are working on.
- Keep the content small; move bigger tasks to a dialog or drawer.

### Don't

- Don't open popovers on hover; use HoverCard for previews.

## Accessibility

- The trigger gets `aria-expanded` and `aria-controls`; the content is named by its title.
- Escape closes and returns focus to the trigger. Positioning flips to stay on screen.

## Use with AI

```text
With Pada, add a "Filters" secondary Button that opens a Popover (side bottom, align start) titled
"Filters" with a Select for status and a Switch for "Only mine", and a close button.
```

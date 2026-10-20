---
name: Dialog
category: Overlays
summary: A modal window for focused tasks that sit on top of the page.
react: Dialog
angular: ds-dialog
reactDir: Dialog
angularDir: dialog
related: AlertDialog, Drawer, Sheet, Popover
---
## Overview

Dialog is a modal panel with a backdrop: edit a profile, create a project, review details. Compose
`Dialog.Root`, `Dialog.Trigger` and `Dialog.Content` with `Header`, `Title`, `Description`, `Body`,
`Footer` and `CloseButton`. It animates in and out, traps focus, locks page scroll and restores
focus to the trigger when it closes.

## When to use

- For short, focused tasks that need the person's full attention: a form, a review step.
- When the task can be completed or cancelled without leaving the page.

## When not to use

- For confirming a destructive action: use **AlertDialog**.
- For long or multi-step flows: use a page, or a **Drawer** that keeps context visible.
- For light, non-blocking content next to a trigger: use **Popover**.

## Best practices

### Do

- Always include a `Dialog.Title`; add a `Dialog.Description` when the purpose isn't obvious.
- Put the primary action last in the footer and label it with a verb ("Save changes").
- Pick the smallest `size` that fits the content.
- Keep the content short enough that the body rarely scrolls.

### Don't

- Don't open a dialog on page load or stack dialogs on top of each other.
- Don't put a dialog's only close option in the footer; keep the close button and Escape.

## Accessibility

- WAI-ARIA Dialog (Modal): `role="dialog"`, `aria-modal`, named by the title and described by the
  description. The trigger gets `aria-expanded` and `aria-controls`.
- Focus moves inside on open, Tab is trapped, Escape and the backdrop close it, and focus returns to
  the trigger.

## Use with AI

```text
With Pada, add an "Edit profile" secondary Button that opens a small Dialog titled "Edit profile"
with the description "Changes are visible to your team." Put Name and Email InputText fields in
the body, and Cancel (secondary) and "Save changes" (primary, loading while saving) in the footer.
```

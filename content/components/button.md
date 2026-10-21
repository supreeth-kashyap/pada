---
name: Button
category: Actions
summary: Triggers an action: save, submit, open, delete.
react: Button
angular: button[dsButton]
reactDir: Button
angularDir: button
related: IconButton, ButtonGroup, SplitButton, Toggle, Link
---
## Overview

Button is the primary way people act on a page. It is a native `<button>` with four variants
(primary, secondary, ghost and destructive), three sizes, optional leading and trailing icons and
a loading state that keeps its width while it works.

## When to use

- To submit a form, confirm a dialog or start a task.
- To open an overlay (a dialog, a menu, a drawer) from a clear label.
- For the one most important action in a view, use the primary variant.

## When not to use

- To go to another page: use **Link**, so it behaves like a link (middle-click, open in new tab).
- For an on/off state such as Bold or Show archived: use **Toggle**.
- For an icon with no visible text: use **IconButton**, which requires an accessible name.

## Best practices

### Do

- Start labels with a verb and say what happens: "Save changes", "Invite member".
- Keep one primary button per view or dialog; make the rest secondary or ghost.
- Use the destructive variant for destructive actions, and confirm them with an AlertDialog.
- Use `loading` while an async action runs, so people don't click twice.

### Don't

- Don't disable a submit button to signal a validation problem; let people submit and show the errors.
- Don't use vague labels such as "OK", "Yes" or "Click here".
- Don't put two primary buttons side by side.

## Accessibility

- Renders a native `<button>` (`type="button"` unless you set one), so Enter and Space activate it.
- `loading` sets `aria-busy` and `aria-disabled` and ignores clicks, but keeps the button focusable.
- Icons are decorative; the label is the accessible name.

## Use with AI

```text
Using pada-ds (React) or pada-ds-angular, add a "Save changes" primary Button and a secondary
"Cancel" Button to the form footer. Show the primary button's loading state while the save
request is pending. Use Pada tokens only; no custom colours.
```

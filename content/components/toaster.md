---
name: Toaster
category: Feedback
summary: Brief notifications created with toast(), stacked in a corner.
react: Toaster
angular: ds-toaster
reactDir: Toast
angularDir: toast
related: Alert, Banner
---
## Overview

Render one Toaster near the root of the app and call `toast()` (or `toast.success`, `toast.info`,
`toast.warning`, `toast.danger`) from anywhere. Toasts stack in a corner, expand on hover or focus,
pause their timers while hovered, focused or in a background tab, and can be swiped or Escaped
away. In Angular, use `ToastService` (or `injectToast()`) the same way.

## When to use

- To confirm an action that happened: "Invite sent", "Changes saved".
- For background events: "Export ready".
- With an Undo action for reversible operations.

## When not to use

- For errors that block progress or need a fix in a form: use **Alert** next to the problem.
- For questions that need an answer: use **AlertDialog**.

## Best practices

### Do

- Keep titles short and specific; add a description only when it helps.
- Offer one action at most (Undo, View, Retry).
- Use the danger tone for failures, and give toasts with an action a longer `duration` (the default is 5 seconds).

### Don't

- Don't put essential information only in a toast; it disappears.
- Don't fire several toasts for one action.

## Accessibility

- The toaster is a labelled region ("Notifications (F8)"); F8 moves focus to it.
- Toasts are announced politely (`role="status"`), danger toasts assertively; timers pause while focus is inside.

## Use with AI

```text
With Pada, render a Toaster at the app root (bottom-right). After inviting a member, call
toast.success with title "Invite sent", the email as description and an Undo action that
cancels the invite.
```

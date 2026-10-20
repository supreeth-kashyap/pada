---
name: Alert
category: Feedback
summary: An inline, persistent message inside a page or form.
react: Alert
angular: ds-alert
reactDir: Alert
angularDir: alert
related: Banner, Toaster, AlertDialog, EmptyState
---
## Overview

Alert is a callout that stays in place until the situation changes: a failed payment, a form-level
error, a heads-up before a destructive change. It comes in five tones (neutral, info, success,
warning, danger), with an optional title, icon, actions and dismiss button.

## When to use

- For messages tied to a section of the page or a form.
- When the message must stay visible until the person deals with it.

## When not to use

- For a brief confirmation such as "Saved": use a **Toaster** toast.
- For a site-wide promotion or announcement: use **Banner**.
- When the person must decide before continuing: use **AlertDialog**.

## Best practices

### Do

- Match the tone to the meaning: danger for failures, warning for risk, success for completion.
- Lead with what happened in the title and say what to do next in the body.
- Put the fixing action in the alert ("Update card").
- Use `live="assertive"` only for urgent errors that appear after an action; `polite` for the rest.

### Don't

- Don't stack several alerts in one place; combine them or prioritise.
- Don't rely on colour alone; keep the icon and the title.

## Accessibility

- Without `live`, the alert is static content. `live="polite"` gives it `role="status"`,
  `live="assertive"` gives it `role="alert"`, so screen readers announce it when it appears.
- The dismiss button is a labelled native button.

## Use with AI

```text
With Pada, show a danger Alert titled "Payment failed" above the billing form when the charge is
declined, with the text "Check your card details and try again." and an "Update card" secondary
small Button in its actions. Announce it assertively.
```

---
name: AlertDialog
category: Overlays
summary: A modal confirmation that the person must answer before continuing.
react: AlertDialog
angular: ds-alert-dialog
reactDir: AlertDialog
angularDir: alert-dialog
related: Dialog, Alert, Button
---
## Overview

AlertDialog interrupts to ask for a decision: "Delete this project?" It is `role="alertdialog"`,
doesn't close on a click outside, and starts focus on Cancel, the safe choice. Compose it with
`AlertDialog.Title`, `Description`, `Cancel` and `Action`.

## When to use

- Before destructive or irreversible actions: delete, revoke, discard unsaved changes.

## When not to use

- For tasks with fields: use **Dialog**.
- For information that doesn't need a decision: use **Alert** or a toast.
- For reversible actions: do them and offer Undo in a toast instead.

## Best practices

### Do

- Phrase the title as a question that names the thing: "Delete 'Q3 report'?"
- Say what happens in the description ("This can't be undone").
- Label the action with the verb ("Delete"), using the destructive variant.

### Don't

- Don't use "OK" / "Cancel"; say exactly what the button does.
- Don't ask for confirmation on routine actions; people stop reading.

## Accessibility

- `role="alertdialog"` named by the title and described by the description; focus starts on Cancel.
- Escape cancels; a click outside does not close it.

## Use with AI

```text
With Pada, when the user clicks "Delete project", open an AlertDialog titled "Delete 'Q3 report'?"
with the description "The project and its tasks are deleted for everyone. This can't be undone."
and buttons Cancel and Delete (destructive). Only delete after Delete is pressed.
```

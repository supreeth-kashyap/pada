---
name: Modal
category: Legacy
status: legacy
replacedBy: Dialog
summary: The 1.x modal. Use Dialog.
react: Modal
angular: none
reactDir: Modal
related: Dialog, AlertDialog
---
## Overview

Modal is the Pada 1.x modal window. Since 2.0 it wraps **Dialog**, which adds a trigger, a
description, a footer and sizes. It keeps working until 3.0.

## Migrating

- Replace `<Modal open onClose title>` with `Dialog.Root` (`open`, `onOpenChange`), `Dialog.Content`,
  `Dialog.Header` and `Dialog.Title`.
- Move buttons into `Dialog.Footer`.

## Use with AI

```text
Replace every Pada Modal in this file with Dialog (Dialog.Root, Dialog.Content, Dialog.Header,
Dialog.Title, Dialog.Body, Dialog.Footer), keeping the same open state and close handlers.
```

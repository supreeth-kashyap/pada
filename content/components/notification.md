---
name: Notification
category: Legacy
status: legacy
replacedBy: Toaster
summary: The 1.x notification. Use Toaster and toast().
react: Notification
angular: none
reactDir: Notification
related: Toaster, Alert
---
## Overview

Notification is the Pada 1.x notification. Since 2.0, render one **Toaster** and call `toast()` /
`toast.success()` …: toasts are queued, stacked, dismissed by swipe and paused on hover. It keeps
working until 3.0.

## Use with AI

```text
Remove Pada Notification components from this app: add one Toaster at the root and replace each
notification with a toast.success / toast.danger call carrying the same title and description.
```

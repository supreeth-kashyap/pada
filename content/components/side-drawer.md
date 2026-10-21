---
name: SideDrawer
category: Legacy
status: legacy
replacedBy: Drawer
summary: The 1.x side panel. Use Drawer.
react: SideDrawer
angular: none
reactDir: SideDrawer
related: Drawer, Sheet
---
## Overview

SideDrawer is the Pada 1.x side panel. Since 2.0 it wraps **Drawer**, which adds a trigger, a title,
other edges and padding. It keeps working until 3.0.

## Use with AI

```text
Replace Pada SideDrawer usages with Drawer.Root and Drawer.Content side="right", adding a
Drawer.Header with a Drawer.Title for each.
```

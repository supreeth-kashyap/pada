---
name: Drawer
category: Overlays
summary: A dialog panel that slides in from an edge of the screen.
react: Drawer
angular: ds-drawer
reactDir: Drawer
angularDir: drawer
related: Dialog, Sheet, SideDrawer
---
## Overview

Drawer is a modal panel that slides in from the left, right, top or bottom, with a backdrop. It uses
the Dialog parts (`Drawer.Header`, `Drawer.Title`, `Drawer.Body`, `Drawer.Footer`) and comes in
several sizes.

## When to use

- For details and edits that relate to the page underneath: a record's details, filters, settings.
- For longer forms that would crowd a centred dialog.

## When not to use

- For a short, focused task: use **Dialog**.
- For mobile-first bottom panels with drag to close: use **Sheet**.

## Best practices

### Do

- Open from the right for details and editing, from the left for navigation.
- Keep the title visible and actions in the footer.
- Size it to the content; avoid full-width drawers on desktop.

### Don't

- Don't open a drawer from inside another drawer.

## Accessibility

- Same as Dialog: `role="dialog"`, focus trapped, Escape and the backdrop close it, focus returns to
  the trigger.
- The slide motion is removed under reduced motion.

## Use with AI

```text
With Pada, open a right-side Drawer titled "Order #4512" when a table row is clicked, showing the
order in a DescriptionList, with Close and "Refund" buttons in the footer.
```

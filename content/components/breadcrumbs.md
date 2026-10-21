---
name: Breadcrumbs
category: Navigation
summary: Shows where the current page sits in the hierarchy.
react: Breadcrumbs
angular: ds-breadcrumbs
reactDir: Breadcrumbs
angularDir: breadcrumbs
related: PageHeader, Link, Tabs
---
## Overview

Breadcrumbs show the path from the top of the app to the current page: Projects › Q3 report ›
Settings. Long trails collapse in the middle (`maxItems`) behind a "…" button. `renderLink` (React)
lets crumbs use your router.

## When to use

- In apps with more than two levels of hierarchy.
- At the top of detail and settings pages, usually inside **PageHeader**.

## When not to use

- In flat apps, or for step-by-step flows: use **Steps**.

## Best practices

### Do

- Use page titles as labels, short and consistent with the navigation.
- Make every crumb except the last a link; the last is the current page.
- Collapse long trails, keeping the first and last crumbs.

### Don't

- Don't use breadcrumbs to show history ("back" trail).

## Accessibility

- WAI-ARIA Breadcrumb: a labelled `nav` with an ordered list; the current page has
  `aria-current="page"`. Separators are hidden from assistive technology.

## Use with AI

```text
With Pada, render Breadcrumbs for Projects › Q3 report › Settings with maxItems 3, using my
router's Link through renderLink (React) or routerLink (Angular).
```

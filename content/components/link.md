---
name: Link
category: Actions
summary: A text link to another page or resource.
react: Link
angular: a[dsLink]
reactDir: Link
angularDir: link
related: Button, Breadcrumbs
---
## Overview

Link is a styled native `<a>` for navigation. It supports an accent or neutral tone, underline on
hover or always, and an `external` mode that opens in a new tab and says so. In React, `asChild`
puts the Pada styles on your router's link.

## When to use

- To navigate to another page, section or site.
- Inline in body text, help text and empty states.

## When not to use

- To perform an action that changes data: use **Button**.
- For the main call to action of a page: use a Button (it can render as a link with `asChild`).

## Best practices

### Do

- Write link text that makes sense out of context: "Read the billing guide", not "Click here".
- Use `external` for links that leave your app, so people know a new tab will open.
- In React, wrap router links with `asChild`; in Angular, put `dsLink` on the `<a routerLink>`.

### Don't

- Don't use a link with an `onClick` and no `href`.
- Don't remove the underline from links inside paragraphs; colour alone isn't enough.

## Accessibility

- Native `<a href>`, so it works with the keyboard, context menus and middle-click.
- External links add visually hidden text ("opens in a new tab").

## Use with AI

```text
With Pada, render an inline Link "Read the billing guide" in the help text under the plan
selector, pointing to /docs/billing. Use my router's link component through asChild (React) or
put dsLink on the routerLink anchor (Angular).
```

---
name: Accordion
category: Display
summary: Collapsible sections that show one or several panels at a time.
react: Accordion
angular: ds-accordion
reactDir: Accordion
angularDir: accordion
related: Tabs, Tree, Card
---
## Overview

Accordion stacks sections whose content expands and collapses under a heading button. Compose
`Accordion.Root` (`type="single"`, optionally `collapsible`, or `type="multiple"`), `Item`,
`Trigger` and `Content`; the content's height animates. `<Accordion header>` (React) or
`ds-accordion-section` (Angular) is one standalone section.

## When to use

- For FAQs, settings groups and long pages where people scan headings first.

## When not to use

- When people need to compare sections side by side: show them all.
- For primary navigation: use **Tabs** or **Sidebar**.

## Best practices

### Do

- Write headings that describe the content, so the collapsed list reads as a summary.
- Use `type="single"` with `collapsible` for FAQs, `multiple` for settings.
- Set `headingLevel` to fit the page outline.

### Don't

- Don't hide critical information in a collapsed section.
- Don't nest accordions.

## Accessibility

- WAI-ARIA Accordion: each header is a button inside a heading with `aria-expanded` and
  `aria-controls`; arrow keys and Home/End move between headers.

## Use with AI

```text
With Pada, render an FAQ as an Accordion type="single" collapsible with items "Is Pada free?",
"Which browsers are supported?" and "Can I use my own styles?", headings at level 3.
```

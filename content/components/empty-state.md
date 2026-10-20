---
name: EmptyState
category: Feedback
summary: A placeholder for first use, no results and errors, with a clear next step.
react: EmptyState
angular: ds-empty-state
reactDir: EmptyState
angularDir: empty-state
related: Alert, Banner, Skeleton
---
## Overview

EmptyState fills a region that has nothing to show yet: no projects, no search results, a failed
load. It has a media slot (an icon or illustration), a title, a description and actions, in two
sizes.

## When to use

- On first use, to explain what goes here and how to start.
- When a search or filter returns nothing.
- When content failed to load and can be retried.

## When not to use

- While content is loading: use **Skeleton** or **Spinner**.
- For page-level errors that need attention elsewhere: use **Alert**.

## Best practices

### Do

- Say what is missing and why, then offer one primary action ("Create project").
- For no results, show the query and offer to clear filters.
- Use the small size inside cards and tables, the default size for whole pages.

### Don't

- Don't leave a blank area or a bare "No data".
- Don't offer more than two actions.

## Accessibility

- The title renders as a heading (`headingLevel`), so it fits the page outline.
- The media is decorative and hidden from assistive technology.

## Use with AI

```text
With Pada, when the projects list is empty, show an EmptyState with the "folder" icon, title
"No projects yet", description "Create a project to start tracking work." and a primary
"New project" button with an "add" icon.
```

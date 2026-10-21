---
name: SearchField
category: Forms
summary: A compact search input with an icon and a clear button.
react: SearchField
angular: ds-search-field
reactDir: SearchField
angularDir: search-field
related: InputText, Autocomplete, CommandPalette
---
## Overview

SearchField is a compact input with a leading search icon and a clear button that appears once there
is text. Use it to filter lists and tables in place.

## When to use

- Above a list or table to filter it.
- In headers and sidebars for searching a section.

## When not to use

- For app-wide navigation and actions: use **CommandPalette**.
- For picking a value from a list: use **Autocomplete**.

## Best practices

### Do

- Give it an accessible name (`aria-label="Search members"`) when there is no visible label.
- Filter as people type (debounced) and show the result count.
- Use a placeholder that says what is searched ("Search members").

### Don't

- Don't clear the query when the results update.

## Accessibility

- A labelled input (named "Search" unless you pass `aria-label`); the clear button is named "Clear search".
- In Angular, Escape clears too and focus returns to the input.

## Use with AI

```text
With Pada, add a SearchField with aria-label "Search members" above the members table that filters
rows by name or email (debounced 200ms) and announces the result count.
```

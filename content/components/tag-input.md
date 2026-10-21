---
name: TagInput
category: Forms
summary: Free-form tags typed into one field.
react: TagInput
angular: ds-tag-input
reactDir: TagInput
angularDir: tag-input
related: Autocomplete, Tags, TagGroup
---
## Overview

TagInput collects free-form values as tags: emails, keywords, labels. Enter or a comma adds the text
as a tag; pasting a list adds them all. `validate`, `maxTags` and `allowDuplicates` control what is
accepted.

## When to use

- For lists of values people type: email recipients, keywords.

## When not to use

- When values come from a known list: use **Autocomplete** with `multiple`.

## Best practices

### Do

- Validate each tag (`validate`) and explain rejected input in the error.
- Use `addOnBlur` so typed text isn't lost when people move on.
- Set `separators` to match the data (commas, spaces, new lines).

### Don't

- Don't accept duplicates unless they mean something.

## Accessibility

- Backspace in the empty field moves to the tags; Backspace or Delete removes one; arrow keys move
  between tags. Each tag's remove button is named "Remove <tag>".

## Use with AI

```text
With Pada, add a TagInput labelled "Invite by email" that validates each tag as an email, allows
up to 20, adds on blur, and shows an error for invalid addresses.
```

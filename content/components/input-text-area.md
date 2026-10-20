---
name: InputTextArea
category: Forms
summary: A labelled multi-line text field.
react: InputTextArea
angular: ds-input-text-area
reactDir: InputTextArea
angularDir: input-text-area
related: InputText, Field
---
## Overview

InputTextArea is a multi-line text field with Pada's label, description and error. Use it for
comments, descriptions and notes.

## When to use

- For text that can run to several sentences: descriptions, feedback, messages.

## When not to use

- For a single line: use **InputText**.
- For rich text with formatting: use a dedicated editor and wrap it in a **Field**.

## Best practices

### Do

- Make the starting height match the expected length.
- Show a character limit in the description and count as people type when there is one.

### Don't

- Don't use it for structured data that could be separate fields.

## Accessibility

- A native `<textarea>` linked to its label, description and error.

## Use with AI

```text
With Pada, add an InputTextArea labelled "Feedback" with the description "Max 500 characters",
marked optional, and show an error when the text is longer than 500 characters.
```

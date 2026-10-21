---
name: CodeSnippet
category: Display
summary: A code block with a label, syntax highlighting and a copy button.
react: CodeSnippet
angular: ds-code-snippet
reactDir: CodeSnippet
angularDir: code-snippet
related: Kbd, Text
---
## Overview

CodeSnippet shows code on a dark surface with a label, syntax highlighting and a copy button. Types:
`micro` (inline), `single-line` (a command) and `multi-line` (a block).

## When to use

- For install commands, API keys, configuration and code samples.

## When not to use

- For keyboard shortcuts: use **Kbd**.

## Best practices

### Do

- Set `language` for highlighting and a `label` that says what it is ("Install").
- Keep single-line snippets copyable as-is: no prompts (`$`) inside the code.

### Don't

- Don't show secrets in full; mask them and copy the real value.

## Accessibility

- The copy button is a labelled button that changes to "Copied" after copying. In Angular, the code block is a focusable, named
  region so keyboard users can scroll it.

## Use with AI

```text
With Pada, show the install step as a single-line CodeSnippet (language bash, label "Install")
with "npm install pada-ds", and a multi-line TSX snippet below with the quick-start code.
```

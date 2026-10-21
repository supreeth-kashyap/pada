---
name: Steps
category: Navigation
summary: A vertical list of steps in a flow, with their status.
react: Steps
angular: ds-steps
reactDir: Steps
angularDir: steps
related: Timeline, Tabs, Progress
---
## Overview

Steps show progress through a multi-step flow: checkout, onboarding, setup. Each step has a title,
a description and a status (completed, current, upcoming); completed and upcoming steps can be
selected.

## When to use

- For flows of three to seven steps where people benefit from seeing what's next.

## When not to use

- For a history of events: use **Timeline**.
- For independent sections: use **Tabs**.

## Best practices

### Do

- Name steps by their outcome ("Payment", "Review").
- Let people go back to completed steps.

### Don't

- Don't use more than about seven steps; group them.

## Accessibility

- The current step has `aria-current="step"`; each step announces its status ("Plan (current step)").

## Use with AI

```text
With Pada, add Steps for onboarding (Account, Workspace, Invite team, Done) bound to the current
step, letting people go back to completed steps.
```

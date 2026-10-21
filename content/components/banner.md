---
name: Banner
category: Feedback
summary: A wide promotional or informational strip with a visual, text and an action.
react: Banner
angular: ds-banner
reactDir: Banner
angularDir: banner
related: Alert, EmptyState, Card
---
## Overview

Banner is a full-width strip for announcements and nudges: "Invite your team", "New: dark mode",
"Scheduled maintenance". It has an optional icon or image, a title, a subtitle and one action.

## When to use

- To announce a feature, an event or a recommended next step.
- At the top of a dashboard or a list page.

## When not to use

- For errors and warnings tied to content: use **Alert**.
- For brief, transient feedback: use a **Toaster** toast.

## Best practices

### Do

- Keep it to one message and one action.
- Make the title short and the subtitle explain the benefit.
- Let people dismiss promotional banners and remember the choice.

### Don't

- Don't show more than one banner at a time.
- Don't use a banner for critical errors; it reads as marketing.

## Accessibility

- The title is a heading and the action is a real button or link.
- Decorative visuals are hidden from assistive technology; pass alt text for meaningful images.

## Use with AI

```text
With Pada, add a Banner at the top of the dashboard with the "team" icon, title "Invite your team",
subtitle "Pada is better together." and a secondary "Invite" button that opens the invite dialog.
```

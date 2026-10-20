---
name: Timeline
category: Data
summary: An ordered list of events joined by a line.
react: Timeline
angular: ds-timeline
reactDir: Timeline
angularDir: timeline
related: Steps, List
---
## Overview

Timeline shows events in order: activity feeds, audit logs, order tracking. Each event has a marker,
a title, a time and details. Events appear one after another on mount, and pending events are drawn
hollow and dashed. A compact density suits sidebars.

## When to use

- For history and status over time.

## When not to use

- For a flow the person is moving through: use **Steps**.

## Best practices

### Do

- Order events consistently (newest first for feeds, oldest first for tracking).
- Use relative times for recent events and absolute dates for older ones, with the full timestamp
  available.
- Use tones on markers sparingly: success for completed, danger for failures.

### Don't

- Don't load unbounded history; paginate or "Show more".

## Accessibility

- An ordered list; times are `<time>` elements. The entry animation respects reduced motion.

## Use with AI

```text
With Pada, show order tracking as a Timeline: Order placed, Payment confirmed, Shipped (completed),
Out for delivery (pending), each with a time; map the API's events with a toTimelineData adapter.
```

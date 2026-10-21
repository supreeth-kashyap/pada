---
name: Calendar
category: Dates
summary: A month grid for picking a day or a range.
react: Calendar
angular: ds-calendar
reactDir: Calendar
angularDir: calendar
related: DatePicker, InputDate, DateRangePicker
---
## Overview

Calendar is a keyboard-navigable month grid for picking a day or a range. It can show several months
side by side (`numberOfMonths`), mark today, and limit the selectable days. Compose your own header
from `Calendar.Root`, `Calendar.PrevButton`, `Calendar.Heading`, `Calendar.NextButton` and
`Calendar.Grid`.

## When to use

- Inline, when the calendar is the main content (booking, scheduling).
- As the building block for custom date pickers.

## When not to use

- In a form field: use **InputDate** or **DateRangePicker**, which open the calendar in a popover.
- For dates far in the past (birthdays): let people type the date.

## Best practices

### Do

- Set `min` / `max` and `isDateUnavailable` so days that can't be picked are disabled, rather than rejected later.
- Use `weekStartsOn` to match the locale.
- Show two months for ranges that often cross a month boundary.

### Don't

- Don't rely on colour alone to show availability; disable or label the days.

## Accessibility

- WAI-ARIA date grid. Arrow keys move by day and week, Home/End to the week's ends, PageUp/PageDown by
  month (Shift: by year), Enter or Space picks. Focus starts on the selected day, or today.

## Use with AI

```text
With Pada, render an inline Calendar with two months side by side for picking a stay (range),
weeks starting on Monday, and past days disabled.
```

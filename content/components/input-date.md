---
name: InputDate
category: Dates
summary: A date field that opens the date picker in a popover.
react: InputDate
angular: ds-input-date
reactDir: InputDate
angularDir: input-date
related: DatePicker, DateRangePicker, Calendar, TimePicker
---
## Overview

InputDate is a form field: a button showing the chosen date (or range with `selection="range"`)
that opens the date picker in a popover. Focus moves to the selected day; Escape closes the picker
and returns to the field.

## When to use

- For dates in forms: due dates, start dates, appointments.

## When not to use

- For start/end ranges where both ends must be picked together: use **DateRangePicker**.
- For birthdays and other far-away dates: a typed date is faster.

## Best practices

### Do

- Label with what the date means ("Due date"), not "Date".
- Show the date in the locale's format.
- Restrict the range with `minDate` and `maxDate`.

### Don't

- Don't open the picker on page load.

## Accessibility

- The field is a button that announces the current value; the popover is a dialog with the Calendar
  keyboard.

## Use with AI

```text
With Pada, add an InputDate labelled "Due date" to the task form, with past dates disabled and an
error "Pick a due date" when it is empty on submit.
```

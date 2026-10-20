---
name: DatePicker
category: Dates
summary: The date picker panel: days, months and years.
react: DatePickerDropdown
angular: ds-date-picker
reactDir: DatePicker
angularDir: date-picker
related: InputDate, Calendar, DateRangePicker
---
## Overview

DatePicker is the panel behind InputDate: a Calendar day grid whose month heading opens a month view
and whose year opens a year view, for quick jumps. In React it is exported as `DatePickerDropdown`.

## When to use

- When you build your own trigger or field and need the full picker panel.

## When not to use

- In a standard form: use **InputDate**, which wraps this panel in a field and popover.
- For a plain month grid: use **Calendar**.

## Best practices

### Do

- Limit the range with `minDate` and `maxDate`.
- Return focus to the field that opened the panel when it closes.

### Don't

- Don't show the panel permanently in a form; it takes a lot of space.

## Accessibility

- Days use the Calendar keyboard (arrows, Home/End, PageUp/PageDown); month and year views are
  keyboard-navigable grids too.

## Use with AI

```text
With Pada, open the DatePicker panel in a Popover from a custom "Due date" chip, and set the
task's due date when a day is picked.
```

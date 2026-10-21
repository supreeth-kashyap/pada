---
name: DateRangePicker
category: Dates
summary: A field that opens a two-month range calendar with optional presets.
react: DateRangePicker
angular: ds-date-range-picker
reactDir: DateRangePicker
angularDir: date-range-picker
related: InputDate, Calendar, RangeSlider
---
## Overview

DateRangePicker is a field showing the chosen range that opens a two-month range calendar (and
optional `presets`, such as Last 7 days) in a popover dialog. The first click picks the start and
the second the end; the value only changes once both ends are picked.

## When to use

- For report periods, stays and any start/end pair of dates.

## When not to use

- For a single date: use **InputDate**.

## Best practices

### Do

- Offer `presets` for common periods in reports and dashboards.
- Set `minDate` for future-only ranges (bookings) and `isDateUnavailable` for blocked days.
- Match `weekStartsOn` to the locale.

### Don't

- Don't use two separate date fields when the range is one concept.

## Accessibility

- The field is a button; the popover is a dialog. Picking the end (or a preset) closes it and returns
  focus to the field; Escape closes it and keeps the previous range.
- The calendar keyboard is Calendar's, crossing from one month's grid to the other.

## Use with AI

```text
With Pada, add a DateRangePicker labelled "Report period" with presets Last 7 days, Last 30 days
and This quarter, weeks starting Monday, that refetches the dashboard when the range changes.
```

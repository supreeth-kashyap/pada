---
name: TimePicker
category: Dates
summary: A time-of-day field in spinbutton segments, ordered by the locale.
react: TimePicker
angular: ds-time-picker
reactDir: TimePicker
angularDir: time-picker
related: InputDate, NumberInput
---
## Overview

TimePicker is a labelled field of segments (hours, minutes, optional seconds, and AM/PM on a 12-hour
clock) in the locale's order. The value is a 24-hour `"HH:mm"` (or `"HH:mm:ss"`) string, `null`
until every segment is filled. There is no dropdown: the segments are the whole control.

## When to use

- For times of day: meeting start, reminder time, opening hours.

## When not to use

- For durations: use **NumberInput** with units.

## Best practices

### Do

- Use `minuteStep` (for example 15) when only some minutes make sense.
- Set `min` / `max` for business hours; out-of-range values mark the field invalid.
- Leave `hourCycle` to the locale unless your product has a fixed convention.

### Don't

- Don't ask for seconds unless they matter (`granularity="second"`).

## Accessibility

- Each segment is a spinbutton: ArrowUp/Down step, PageUp/PageDown by a larger step, Home/End to the
  ends, digits type in, A/P set AM/PM, ArrowLeft/Right move between segments.

## Use with AI

```text
With Pada, add a TimePicker labelled "Start time" with minuteStep 15, min "08:00" and max "18:00",
bound to the meeting form as an "HH:mm" string.
```

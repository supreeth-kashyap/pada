---
name: PinInput
category: Forms
summary: A code or PIN field with one box per character.
react: PinInput
angular: ds-pin-input
reactDir: PinInput
angularDir: pin-input
related: PasswordInput, InputText
---
## Overview

PinInput collects short codes: verification codes, PINs. Typing moves to the next box, Backspace
goes back, and pasting (or a phone autofilling a code from a text message) fills every box.
`groupSize` splits long codes visually.

## When to use

- For one-time verification codes and short numeric PINs.

## When not to use

- For passwords or long tokens: use **PasswordInput** or **InputText**.

## Best practices

### Do

- Say where the code was sent in the description ("Sent to •••• 1234").
- Submit automatically when the last box is filled, and offer "Resend code".
- Keep one-time-code mode on (`otp`, the default) so phones can fill the code from a text message.

### Don't

- Don't clear the code on error without explanation.

## Accessibility

- Each box is labelled with its position ("Character 2 of 6"); the group is labelled by the field label.
- Paste works from any box.

## Use with AI

```text
With Pada, show a PinInput labelled "Verification code" with 6 digits, the description "We sent
a code to ada@example.com", auto-submit when complete and an error "That code didn't work" on
failure.
```

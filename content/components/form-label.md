---
name: FormLabel
category: Legacy
status: legacy
replacedBy: Field
summary: The 1.x form label. Use Field.
react: FormLabel
angular: none
reactDir: FormLabel
related: Field, InputText
---
## Overview

FormLabel is the Pada 1.x label. Since 2.0, use **Field** (`Field.Root`, `Field.Label`,
`Field.Control`, `Field.Description`, `Field.Error`), which also wires the control's id,
description and error. It keeps working until 3.0.

## Use with AI

```text
Replace Pada FormLabel with Field: wrap each control in Field.Root, use Field.Label, and move help
text and errors into Field.Description and Field.Error.
```

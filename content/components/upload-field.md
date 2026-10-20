---
name: UploadField
category: Forms
summary: A file picker with a drop zone and a list of files with progress.
react: UploadField
angular: ds-upload-field
reactDir: UploadField
angularDir: upload-field
related: Progress, ProgressCircle, Field
---
## Overview

UploadField is a drop zone backed by a real file input. Picked and dropped files list below with
their size, upload progress, status and View / Remove actions. `accept`, `maxFiles` and `maxSize`
constrain what is allowed.

## When to use

- For attaching documents and images to a record or message.

## When not to use

- For a single avatar image with cropping: build a dedicated picker.

## Best practices

### Do

- State accepted types and the size limit in the description ("PDF or PNG, up to 10 MB").
- Show per-file progress and a clear error for rejected files.
- Let people remove a file before submitting.

### Don't

- Don't rely on drag and drop only; the zone is also a button that opens the file browser.

## Accessibility

- The zone is a native file input: Tab to it, Space or Enter to browse.
- File statuses and errors are announced.

## Use with AI

```text
With Pada, add an UploadField labelled "Attachments" accepting PDF and PNG up to 10 MB, multiple,
max 5 files, uploading each file on add and showing its progress and status.
```

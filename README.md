# Pada Design System

![Pada Design System Demo](src/assets/pada-ds-cover-image.png)

This is a React design system built with Vite. It includes a set of reusable components and a demo application to showcase them.

[Visit Pada.design to learn more](https://supreeth-kashyap.notion.site/Pada-Design-System-2c6a6474ca5a80cea166ed78587299a2)

## Figma design file

Avail the Figma file of the design system in the community for free

[Figma file](https://www.figma.com/community/file/1619638623779328209)


## Installation

To install the design system, run:

```bash
npm install pada-ds
```

## Usage

```tsx
import 'pada-ds/tokens.css';
import 'pada-ds/styles.css';
import { Button } from 'pada-ds';
```

`pada-ds/tokens.css` only defines CSS custom properties. To also use Pada's document base styles (`body` background, color and font, and zero `p` margins), import the optional `pada-ds/base.css`:

```tsx
import 'pada-ds/base.css';
```

## Theming

By default the theme follows the operating system (`prefers-color-scheme`). To force a theme, set `data-theme="light"` or `data-theme="dark"` on `<html>` or on any container. Only that subtree is themed, so one section of a page can use a different theme:

```html
<html data-theme="dark">
  ...
  <section data-theme="light">Always light</section>
</html>
```

```ts
document.documentElement.dataset.theme = 'dark'; // or 'light'
delete document.documentElement.dataset.theme; // follow the OS again
```

## For AI coding agents

The package ships a machine-readable API description, generated from the TypeScript source by `npm run build:manifest` (part of `npm run build`):

- `pada-ds/manifest.json`: every exported component with its import path and props (name, type, required, default, JSDoc description).
- `llms.txt`: a short index: install, imports, stylesheets, theming, and one line per component.
- `llms-full.txt`: a prop table and a minimal usage example for every component.

`llms.txt` and `llms-full.txt` are also committed at the repo root. `npm test` fails if they are stale or if an exported component is missing from the manifest.

## Components

This design system includes the following components:

- **Accordion**: Collapsible sections to show/hide content.
- **Banner**: Notices and important messages display.
- **Button**: Clickable control for primary actions.
- **Card**: Container for grouped related content.
- **Carousel**: Scrollable content carousel with controls.
- **Checkbox**: Binary selection with label support.
- **CodeSnippet**: Display formatted, copyable code blocks.
- **ComboBox**: Filterable list dropdown with options.
- **DatePicker**: Select dates via calendar UI.
- **FormLabel**: Accessible labels for form fields.
- **Icon**: Reusable SVG icons for UI.
- **Indexer**: Alphabetical index navigation component.
- **InputDate**: Single-line date input field.
- **InputText**: Single-line text input field.
- **InputTextArea**: Multi-line text input area.
- **KeyValue**: Render key/value metadata pairs.
- **List**: Generic list rendering component.
- **Loader**: Indicate loading state visually.
- **Logo**: Project or brand logo component.
- **Modal**: Overlay dialog for focused tasks.
- **Notification**: Transient alert messages and toasts.
- **PageHeader**: Page title and actions area.
- **Pills**: Compact, selectable pill-style buttons.
- **Popover**: Floating container for contextual content.
- **Progress**: Visual progress indicators for tasks.
- **RadioGroup**: Grouped single-choice radio buttons.
- **SearchField**: Text search input with clear.
- **SegmentControl**: Segmented button toggle control.
- **Select**: Dropdown selection with ComboBox.
- **SideDrawer**: Slide-in side panel for navigation.
- **Sidebar**: Fixed side navigation area.
- **Slider**: Range selection slider control.
- **Steps**: Multi-step progress indicator component.
- **Switch**: Toggle between on/off states.
- **Table**: Responsive tabular data display component.
- **Tabs**: Tabbed navigation interface component.
- **Tags**: Compact label tags for metadata.
- **Text**: Typography primitives and helpers.
- **Toolbar**: Action toolbar with controls.
- **Tooltip**: Hover tooltip for extra info.
- **UploadField**: File upload field with progress.

### Examples

Here are some examples of how to use the components:

```jsx
import React from 'react';
import 'pada-ds/tokens.css';
import 'pada-ds/styles.css';
import { Button } from 'pada-ds';

const App = () => (
  <div>
    <Button variant="primary">Click me</Button>
  </div>
);
```

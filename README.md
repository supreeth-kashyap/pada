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

## Headless parts

`pada-ds/headless` ships the behaviour behind the components (state, keyboard handling, focus management, ARIA wiring and positioning) with no styles at all. Use it when you have your own visual language; every part exposes its state as `data-state`, `data-side`, `data-highlighted`, `data-disabled` and `aria-*` attributes for you to style.

```tsx
import { Dialog } from 'pada-ds/headless';

<Dialog.Root>
  <Dialog.Trigger className="my-button">Edit profile</Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Overlay className="my-overlay" />
    <Dialog.Content className="my-dialog">
      <Dialog.Title>Edit profile</Dialog.Title>
      <Dialog.Description>Changes save automatically.</Dialog.Description>
      <Dialog.Close>Done</Dialog.Close>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
```

```css
.my-dialog[data-state="open"] { animation: fade-in var(--pada-duration-slow) var(--pada-ease-emphasized); }
```

Available parts: `Dialog`, `Popover`, `Tooltip` (with `Tooltip.Provider` for shared delays) and `DropdownMenu` (items, checkbox and radio items, groups, labels, separators, submenus). Each follows the matching WAI-ARIA Authoring Practices pattern. Any part that renders an element accepts `asChild`, which merges its behaviour onto your own element (a router link, a custom button) instead of rendering a new one.

The building blocks are exported too: `Slot`, `Portal`, `VisuallyHidden`, `useControllableState`, `usePresence` (keeps an element mounted until its exit transition ends), `useDismissable` (Escape and outside clicks, layered), `useFocusScope`, `useScrollLock`, `useHideOthers`, `useFloatingPosition`, `useTypeahead` and list navigation helpers.

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

### Theme axes

Every axis is an attribute that works on `<html>` or any container, and they combine freely:

| Attribute | Values | Effect |
|---|---|---|
| `data-theme` | `light`, `dark` (none = follow the OS) | Light or dark colours |
| `data-accent` | any palette hue (`indigo` default, `violet`, `amber`, `emerald`, `rose`, `sky`, …) or `custom` | Accent colour, hovers, focus rings |
| `data-neutral` | `stone` (default), `slate`, `gray`, `zinc`, `neutral` | Surfaces, text and borders |
| `data-density` | `compact`, `comfortable`, `spacious` | Spacing and control heights |
| `data-radius` | `none`, `sm`, `md`, `lg`, `xl` | Corner radius scale |
| `data-motion` | `reduced`, `full` | Overrides the OS reduced-motion setting |
| `data-contrast` | `standard`, `more` | Stronger muted text and borders (also follows `prefers-contrast: more`) |

```html
<html data-theme="dark" data-accent="amber" data-density="compact">
```

### Knobs

Derived tokens are computed from a handful of knobs, so one change re-themes every component. Set them on any element:

```css
.brand {
  --pada-accent-hue: 160;   /* used by data-accent="custom" (OKLCH hue) */
  --pada-radius-base: 0.5rem;
  --pada-density: 0.9;
  --pada-type-base: 14px;
  --pada-type-ratio: 1.25;
}
```

Tokens use the `--pada-` prefix: `--pada-color-fg-muted`, `--pada-color-accent-solid`, `--pada-space-4`, `--pada-radius-md`, `--pada-duration-normal`, `--pada-z-modal` and so on. The full list ships as `pada-ds/tokens.json`, `pada-ds/tokens.scss` (with breakpoint mixins) and `pada-ds/tokens` (JS: `import { tokens, breakpoints } from 'pada-ds/tokens'`).

Pada 1.x token names (`--color-primary-600`, `--spacing-4`, …) still work as aliases and will be removed in 3.0.

The tokens use `light-dark()`, `color-mix()`, relative colour syntax and `pow()`, so they need a 2024-era browser (Chrome 123, Safari 18, Firefox 128 or later).

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

# Migrating from Pada 1.x to 2.0

Pada 2.0 keeps the 1.x component APIs working. Most apps can upgrade, run one codemod for their own CSS, and then move to the new compound APIs at their own pace. This guide lists everything you might notice, in the order you are likely to meet it.

> **Status:** 2.0 is not published yet. This guide tracks the `claude/pada-2` branch.

## 1. Install

```bash
npm install pada-ds@2
```

- React 19 is required (`react` and `react-dom` `^19.1.1`, unchanged from 1.1).
- New runtime dependency: `@floating-ui/react-dom`, installed automatically.

Imports:

| Import | What it is |
|---|---|
| `pada-ds` | Styled components (as before). |
| `pada-ds/styles.css` | Component styles. It includes the tokens. |
| `pada-ds/tokens.css` | The tokens alone: every `--pada-*` property, plus the 1.x names as aliases. |
| `pada-ds/base.css` | **New, optional.** `body` and `p` defaults. They used to be inside `tokens.css` and overrode your app's own styles; import this file if you relied on them. |
| `pada-ds/headless` | **New.** Unstyled, accessible parts (see §5). |
| `pada-ds/tokens`, `pada-ds/tokens.scss`, `pada-ds/tokens.json` | **New.** Token names for JS, SCSS mixins and a `pada()` function, and DTCG-style JSON for design tools. |

## 2. Tokens

Every token now has the `--pada-` prefix and comes from one generated model. **The 1.x names still work** as aliases until 3.0, so nothing breaks on upgrade.

To move your own CSS, SCSS, JS and TS onto the new names, run the codemod:

```bash
npx pada-tokens-migrate src/ --dry-run   # list the changes
npx pada-tokens-migrate src/             # rewrite in place
```

- **Exact meaning.** Each rewrite keeps the exact meaning of the 1.x name, so `--color-primary-600` becomes the same fixed colour, not a themed one.
- **`--themed`** also moves raw palette colours (`--color-red-600`) to the themed ramps, which follow dark mode. It changes how things look in dark mode, so review the diff.
- **Manual choices.** `--color-white`, `--color-black` and `--z-index-*` have no single 2.0 equivalent. The codemod lists them; replace them by hand with a role token such as `--pada-color-surface`, `--pada-color-fg` or `--pada-z-modal`.

Prefer the semantic tokens in new code:

| Role | Tokens |
|---|---|
| Surfaces | `--pada-color-surface`, `-surface-sunken`, `-surface-raised`, `-surface-overlay`, `-surface-inverse`, `--pada-color-backdrop` |
| Text | `--pada-color-fg`, `-fg-muted`, `-fg-subtle`, `-fg-disabled`, `-fg-link` |
| Borders | `--pada-color-border`, `-border-subtle`, `-border-strong` |
| Intents | `--pada-color-{accent,neutral,success,warning,danger,info}-{solid,solid-hover,solid-pressed,on-solid,subtle,subtle-hover,fg,border}` |
| Motion | `--pada-duration-*`, `--pada-ease-*`. They drop to 0 under reduced motion. |
| Layers | `--pada-z-dropdown`, `-popover`, `-modal`, `-toast`, `-tooltip` |

Visual changes that come with the new tokens:

- **Neutral palette.** Surfaces, text and borders come from one neutral palette (stone by default) instead of a mix of slate and stone.
- **Font size.** `--font-size-lg` is now 15.6px (13px × 1.2).
- **Focus ring.** It is 2px wide, and its gap uses the surface colour, so it works in dark mode.
- **Dark mode.** Themed hue ramps follow dark mode.
- **`data-theme`.** It now only switches `color-scheme`; every token carries its light and dark value through `light-dark()`. Setting `data-theme` on a container no longer wipes its tokens, and nested themes work.

## 3. Theming

There are new theme axes. Each is a `data-*` attribute on `<html>` or any container:

```html
<html data-theme="dark" data-accent="emerald" data-density="compact" data-radius="lg">
```

| Attribute | Values |
|---|---|
| `data-theme` | `light`, `dark` (unset follows the OS) |
| `data-accent` | any palette hue, or `custom` with `--pada-accent-hue` (set on the same element, or `ThemeProvider accentHue`) |
| `data-neutral` | `stone`, `slate`, `gray`, `zinc`, `neutral` |
| `data-density` | `compact`, `comfortable`, `spacious` |
| `data-radius` | `none`, `sm`, `md`, `lg`, `xl` |
| `data-motion` | `reduced`, `full` (defaults to the OS setting) |
| `data-contrast` | `standard`, `more` |

In React, use `ThemeProvider` instead of setting attributes by hand:

```tsx
<ThemeProvider target="root" defaultTheme="system" storageKey="theme">
  <App />
  <Toaster />
</ThemeProvider>
```

A `ThemeProvider` without `target="root"` themes only its subtree. Overlays opened inside it (dialogs, menus, toasts) render inside that subtree, so they keep its theme.

## 4. Deprecated APIs

These still work in 2.x and are removed in 3.0. Your editor marks them as deprecated.

| 1.x | Use instead |
|---|---|
| `Modal` | `Dialog` (`Dialog.Root`, `Dialog.Trigger`, `Dialog.Content`, `Dialog.Header`, `Dialog.Title`, `Dialog.Body`, `Dialog.Footer`, `Dialog.CloseButton`) |
| `SideDrawer` | `Drawer` (the same parts as Dialog, with `Drawer.Content side="left \| right \| top \| bottom"`) |
| `AccordionHeader`, `AccordionContent` | `Accordion.Root`, `Accordion.Item`, `Accordion.Trigger`, `Accordion.Content` (or keep the 1.x `Accordion` props) |
| `Logo`, `LogoProps` | `BrandLogo`, `BrandLogoProps` (third-party brand logos). The Pada mark is the new `PadaLogo`. |
| `Notification` | `Toaster` and `toast()`: queued, stacked, swipe to dismiss, and pause on hover |
| `Loader` | `Spinner` for inline loading, `ProgressCircle` when progress is known, `Skeleton` for content placeholders |
| `FormLabel` | `Field` (`Field.Root`, `Label`, `Control`, `Description`, `Error`), which wires any control |
| `Button` `split`, `onSplitClick` | `SplitButton.Root` with a `Button` and a `SplitButton.Splitter` (usually a `DropdownMenu.Trigger`) |
| 1.x token names (`--color-*`, `--spacing-*`, `--font-*`, …) | `--pada-*` (run `pada-tokens-migrate`) |

The following stay supported. They have 2.0 alternatives that are worth adopting:

| 1.x | 2.0 alternative |
|---|---|
| `InputText` | `Field` with `Field.Control`, for your own layout around the input |
| `ComboBox` | Still the inline listbox. For a text field with suggestions, use the new `Autocomplete`. |

## 5. Headless parts

`pada-ds/headless` provides the behaviour without styles:
- overlays: `Dialog`, `Popover`, `Tooltip`, `HoverCard`
- menus: `DropdownMenu`, `ContextMenu`
- disclosure: `Tabs`, `Accordion`, `Collapsible`
- forms: `Field`, `Toggle`, `ToggleGroup`, `Combobox`, `NumberInput`, `PinInput`, `Slider`, `TimeField`
- data: `Calendar`, `Tree`

Parts expose their state through `data-state`, `data-disabled`, `data-side` and `aria-*`, so you style them with plain CSS. `asChild` merges a part's behaviour onto your own element.

```tsx
import { Dialog } from 'pada-ds/headless';

<Dialog.Root>
  <Dialog.Trigger asChild><MyButton>Edit</MyButton></Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Overlay className="my-overlay" />
    <Dialog.Content className="my-dialog">
      <Dialog.Title>Edit profile</Dialog.Title>
      …
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
```

## 6. Behaviour and markup changes

These change behaviour or DOM output while keeping the props. Check them if you have custom CSS that targets Pada's internals, or tests that query its markup.

**Button**
- Defaults to `type="button"`. Inside a `<form>`, pass `type="submit"` on the button that submits; 1.x buttons submitted by accident.
- New `size` (`sm`, `md`, `lg`) and `loading` props.

**Tooltip**
- Opens after 300 ms on hover (`delayDuration`), and immediately on keyboard focus.
- It is only referenced from `aria-describedby` while open.
- Renders in a portal.

**Popover**
- Renders in a portal and flips to stay on screen.
- No longer follows the pointer position of the click that opened it; pass `clickPosition` for that.
- Closes when focus leaves it.

**Modal and SideDrawer**
- Render in a portal and animate in and out.
- SideDrawer is now a real modal dialog: focus is trapped and returns to the trigger, and it sets `aria-modal`.

**Select**
- The option list renders in a portal, positioned with Floating UI, as wide as the trigger. CSS that styled `.select-dropdown` as a descendant of your own container no longer matches.
- `name` now submits the value through a hidden input.
- Type-ahead matches several letters.

**Tabs**
- Ids are unique per instance, so two Tabs on a page no longer collide.
- Focus is scoped to the tab list. Home, End and disabled-tab skipping now work.

**Accordion**
- Headers are real buttons inside headings (`headingLevel`, default 3).
- Panels animate their height. Arrow keys move between headers.

**Table**
- The grid of `div`s now carries `role="table"`, `row`, `columnheader`, `rowheader` and `cell`. Give each table a `label` or `labelledBy`.
- Sortable headers set `aria-sort`.
- Column resize handles are focusable separators.

**Steps**
- Rendered as a list.
- Clickable steps are `<button>`s, and the current step has `aria-current="step"`.

**List**
- Rendered as a list.
- Reorderable lists have a drag-handle button for keyboard reordering, which is announced.
- A parent re-render no longer resets the user's order.

**Toolbar**
- `Filter` and `MoreFilter` open in a popover: Escape closes it and focus returns.
- `FilterChip`'s remove control is its own button next to the chip, instead of a clickable `span` inside it.

**ComboBox**
- The listbox is one Tab stop with arrow-key navigation.
- Multi-select lists set `aria-multiselectable`.

**UploadField**
- `description` renders, and the hints describe the input.
- Uploads show a `progressbar`.
- The "View" action calls `onView`, which by default opens the file.

**Focus restore across overlays**
- Closing an overlay returns focus to its trigger only when focus was lost with it.
- Opening one popover from another no longer pulls focus back.

**SidebarLogo**
- With no `src`, `name` or `title`, it shows the new `PadaLogo` lockup.
- The old image assets were removed.

**Reduced motion**
- Every transition and animation reads the motion tokens, so `prefers-reduced-motion` or `data-motion="reduced"` turns motion off everywhere.

## 7. Checklist

1. Upgrade, and import `pada-ds/base.css` if you relied on the `body` and `p` defaults.
2. Run `npx pada-tokens-migrate src/ --dry-run`, review the diff, then run it for real and replace the names it reports.
3. Search for `<Button` inside forms and add `type="submit"` where needed.
4. Check custom CSS aimed at Pada internals, especially the Select dropdown, Toolbar chips, Steps, List and Table rows.
5. Wrap the app in `ThemeProvider` if you switch themes, and add `<Toaster />` if you adopt `toast()`.
6. Move from `Modal`, `SideDrawer`, `Logo` and `AccordionHeader` / `AccordionContent` to their replacements before 3.0.

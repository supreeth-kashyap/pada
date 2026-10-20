# 08. React ↔ Angular parity

This file is copied verbatim into the Angular repo as `docs/roadmap/parity.md`. Update both copies together.

Legend: ✅ the 2.0 version ships (headless + styled) · 🟡 partial · ⛔ missing · **Phase** = roadmap phase where the 2.0 version (headless + styled, both frameworks) lands.

Status as of 2026-10-20. Every React component has an Angular 2.0 counterpart, and every Angular component has a React one except `ds-tag-group`. The React column records what `pada/projects/pada-ds/src/components` ships today.

## 1. Existing React components

| Component | React | Angular | Angular notes | 2.0 name | Phase |
|---|---|---|---|---|---|
| Accordion | ✅ | ✅ | | Accordion | 3 |
| Banner | ✅ | ✅ | | Banner | 3 |
| Button | ✅ | ✅ | Variants, sizes, icons, loading; split as `ds-split-button` + `dsButtonSplitter`; `ds-button-group` | Button, IconButton, ButtonGroup | 3 |
| Card | ✅ | ✅ | | Card | 3 |
| Carousel | ✅ | ✅ | | Carousel | 3 |
| Checkbox | ✅ | ✅ | Indeterminate; `ds-checkbox-group` | Checkbox | 3 |
| CodeSnippet | ✅ | ✅ | | CodeSnippet | 3 |
| ComboBox | ✅ | ✅ | `ds-combo-box`; React has no separate Listbox | Listbox | 3 |
| DatePicker | ✅ | ✅ | On Calendar | DatePicker (on Calendar) | 3 |
| FormLabel | ✅ | ✅ | `ds-field-label` | Field.Label | 3 |
| Icon | ✅ | ✅ | 154 built-in icons, `color` input; names load async through `loadIconNames()` | Icon | 3 |
| Indexer | ✅ | ✅ | | Indexer | 3 |
| InputDate | ✅ | ✅ | | InputDate | 3 |
| InputText | ✅ | ✅ | On Field | InputText (on Field) | 3 |
| InputTextArea | ✅ | ✅ | On Field | InputTextArea (on Field) | 3 |
| KeyValue | ✅ | ✅ | `ds-key-value`; record lists as `ds-description-list` | DescriptionList | 3 |
| List | ✅ | ✅ | Keyboard reorder emits `(reorder)`; the consumer renders the new order | List | 3 |
| Loader | ✅ | ✅ | | Spinner | 3 |
| Logo (brand logos) | ✅ | ✅ | | BrandLogo | 3 |
| Modal | ✅ | ✅ | | Dialog | 2 |
| Notification | ✅ | ✅ | | Toast / Toaster | 3 |
| PageHeader | ✅ | ✅ | | PageHeader | 3 |
| Pills | ✅ | ✅ | | Pills | 3 |
| Popover | ✅ | ✅ | | Popover | 2 |
| Progress | ✅ | ✅ | `ds-progress-circle` (React `ProgressCircle`) | Progress, ProgressCircle | 3 |
| RadioGroup | ✅ | ✅ | | RadioGroup | 3 |
| SearchField | ✅ | ✅ | | SearchField | 3 |
| SegmentControl | ✅ | ✅ | | SegmentControl | 3 |
| Select | ✅ | ✅ | | Select | 3 |
| SideDrawer | ✅ | ✅ | | Drawer | 2 |
| Sidebar | ✅ | ✅ | | Sidebar | 3 |
| Slider | ✅ | ✅ | | Slider | 3 |
| Steps | ✅ | ✅ | | Steps | 3 |
| Switch | ✅ | ✅ | | Switch | 3 |
| Table | ✅ | ✅ | Toolbar and pagination are parts outside `role="table"`; `[(columns)]` | Table | 3 |
| Tabs | ✅ | ✅ | | Tabs | 3 |
| Tags | ✅ | ✅ | `ds-tag-group` is Angular-only for now | Tag, TagGroup | 3 |
| Text | ✅ | ✅ | `h1`–`h6[dsHeading]` (React `<Heading level>`) | Text, Heading | 3 |
| Toolbar (+Filter, MoreFilter, FilterChip) | ✅ | ✅ | Adds `role="toolbar"` and roving focus; actions as data with `(action)` | Toolbar | 3 |
| Tooltip | ✅ | ✅ | | Tooltip | 2 |
| UploadField | ✅ | ✅ | | UploadField | 3 |

## 2. Components that started in Angular

| Component | Angular | React | 2.0 name | Phase |
|---|---|---|---|---|
| Avatar | ✅ | ✅ | Avatar, AvatarGroup | 4 |
| Badge | ✅ | ✅ | Badge | 4 |
| InfoTooltip | ✅ | ✅ (on Tooltip: portal, flips) | InfoTooltip | 2 |
| Attributes / SectionHeader / AttributeRow | ✅ (as DescriptionList) | ✅ DescriptionList (`custom` value is a React node) | DescriptionList | 3 |
| Heading, ButtonGroup, SplitButton, ProgressCircle, CheckboxGroup | ✅ | ✅ | (same) | 3 |
| TagGroup | ✅ | ⛔ | TagGroup | 3 |

React 2.0 deprecates its 1.x names, removed in 3.0: `Modal` (Dialog), `SideDrawer` (Drawer), `FormLabel` (Field), `Loader` (Spinner), `Notification` (Toaster), `Logo` (BrandLogo), `AccordionHeader` / `AccordionContent` and `Button split` (SplitButton). Angular ships only the 2.0 names. Storybook lists React's under **Legacy**.

## 3. New in 2.0

| Component | React | Angular | Phase | | Component | React | Angular | Phase |
|---|---|---|---|---|---|---|---|---|
| Field | ✅ | ✅ | 4 | | NumberInput | ✅ | ✅ | 5 |
| Stack | ✅ | ✅ | 4 | | PasswordInput | ✅ | ✅ | 5 |
| Separator | ✅ | ✅ | 4 | | PinInput | ✅ | ✅ | 5 |
| VisuallyHidden | ✅ | ✅ (`DsVisuallyHidden`) | 2 | | TagInput / MultiSelect | ✅ | ✅ | 5 |
| Toggle | ✅ | ✅ | 4 | | RangeSlider | ✅ | ✅ | 5 |
| ToggleGroup | ✅ | ✅ | 4 | | CheckboxGroup | ✅ | ✅ | 5 |
| DropdownMenu | ✅ | ✅ | 2 | | RadioCard | ✅ | ✅ (`ds-radio-card-group`) | 5 |
| AlertDialog | ✅ | ✅ | 4 | | Rating | ✅ | ✅ | 5 |
| Combobox (filterable) | ✅ (Autocomplete) | ✅ (`ds-autocomplete`) | 4 | | TimePicker | ✅ (headless `TimeField`) | ✅ (headless `dsTimeField`) | 5 |
| CommandPalette | ✅ | ✅ | 4 | | ColorPicker | ✅ | ✅ | 5 |
| Breadcrumbs | ✅ | ✅ | 4 | | ContextMenu | ✅ | ✅ | 5 |
| Pagination | ✅ | ✅ | 4 | | HoverCard | ✅ | ✅ | 5 |
| Skeleton | ✅ | ✅ | 4 | | Collapsible | ✅ (headless) | ✅ (headless) | 5 |
| Alert / Callout | ✅ | ✅ | 4 | | Menubar | ✅ | ✅ | 5 |
| EmptyState | ✅ | ✅ | 4 | | Tree | ✅ | ✅ | 5 |
| Kbd | ✅ | ✅ | 4 | | DataTable | ✅ | ✅ | 5 |
| IconButton | ✅ | ✅ (`tooltip` still uses native `title`) | 4 | | Calendar | ✅ (multi-month) | ✅ (multi-month) | 5 |
| Link | ✅ | ✅ | 4 | | DateRangePicker | ✅ | ✅ | 5 |
| ThemeProvider / ThemeToggle | ✅ | ✅ | 4 | | Timeline | ✅ | ✅ (no `Timeline.Item` children API) | 5 |
| PadaLogo | ✅ | ✅ | 7 | | Stat | ✅ | ✅ | 5 |
| | | | | | ScrollArea, AspectRatio, Grid, Container | ✅ | ✅ | 5 |
| | | | | | Sheet, Resizable | ✅ | ✅ | 5 |

## 4. Shared foundations

| Foundation | React | Angular |
|---|---|---|
| Tokens (CSS custom properties) | ✅ | ✅ synced `tokens.css` v1.2.0, enforced by `tokens:check` |
| Light/dark theming | ✅ | ✅ `ThemeService`, `[dsTheme]` scopes |
| Headless core | ✅ | ✅ `pada-ds-angular/headless` |
| Motion tokens | ✅ | ✅ (read from the synced tokens) |
| Machine-readable manifest / llms.txt | ✅ | ⛔ |
| Library test target | ✅ `npm test` (Vitest, Testing Library, axe, plus `node --test` scripts) | ✅ `npm run test:lib` (Vitest, jsdom, axe) |
| Shared component specs (`specs/<component>.md`) | ⛔ | ⛔ |
| Zoneless showcase app | n/a | ⛔ |

## 5. Process

1. **Spec first.** A component starts with `specs/<component>.md` (see [03 §4](https://github.com/supreeth-kashyap/pada/blob/main/docs/roadmap/03-headless-architecture.md#4-shared-component-spec)). The spec is reviewed once and copied to both repos.
2. **Same tests.** Interaction tests are generated from the spec's keyboard table, so both frameworks run identical scenarios.
3. **Same tokens.** Angular uses the synced `tokens.css`; component SCSS uses only `--pada-*` tokens.
4. **Done means both.** A component's row turns ✅ only when both frameworks ship the 2.0 version. Phase exit criteria in the [README](https://github.com/supreeth-kashyap/pada/blob/main/docs/roadmap/README.md#phases) depend on this table.
5. **Manifest parity.** The Angular repo gains a manifest generator that emits the same JSON shape as React's `manifest.json`, and a CI script diffs the two manifests' part and token lists.

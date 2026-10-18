# 04. Components

Three groups of work:

1. **Refactor** the 41 existing components onto the headless core with compound parts (phase 3).
2. **Port** the components that exist only in Angular to React.
3. **Add** missing components in two waves (phases 4 and 5).

Priority: **P0** = blocks other work or fixes a real bug; **P1** = high value; **P2** = nice to have.

## 1. Refactors of existing components

Each refactor: move behaviour into a headless part, expose compound parts, keep the 1.x API as a wrapper, use tier 3 tokens, add the motion from [05](./05-motion.md), and close the a11y gaps from [01](./01-current-state-audit.md).

| Component | 2.0 shape (parts) | Must fix | Priority |
|---|---|---|---|
| **Modal → Dialog** | Root, Trigger, Portal, Overlay, Content, Header, Title, Description, Body, Footer, Close | Portal; enter/exit motion; `Modal` stays as a wrapper | P0 |
| **SideDrawer → Drawer** | Same parts as Dialog plus `side` (left, right, top, bottom) | `role=dialog`, focus trap, slide motion | P0 |
| **Popover** | Root, Trigger, Anchor, Portal, Content, Arrow, Close | Unique ids, focus management, Floating UI positioning | P0 |
| **Tooltip** | Provider (shared delay), Root, Trigger, Portal, Content, Arrow | Portal, open/close delays, collision handling, motion | P0 |
| **Tabs** | Root, List, Trigger, Content, Indicator | Unique ids via `useId`, scoped focus, Home/End, `activationMode` (auto/manual), vertical orientation | P0 |
| **Select** | Root, Trigger, Value, Portal, Content, Viewport, Item, ItemText, ItemIndicator, Group, Label, Separator | Hidden native input so `name` works in forms, portal, flip | P0 |
| **ComboBox → Listbox** | Root, Item, Group, Label | Rename (it has no input); `ComboBox` name moves to the real combobox below | P1 |
| **Accordion** | Root (`type` single/multiple, `collapsible`), Item, Header, Trigger, Content | Context wiring, arrow keys between headers, height animation | P1 |
| **Notification → Toast** | `Toaster` (region), `toast()` imperative API, Toast parts: Root, Title, Description, Action, Close | Live region, queue, stacking, swipe, pause on hover/focus; `Notification` stays as a wrapper | P1 |
| **Table** | Root, Header, Body, Footer, Row, HeaderCell, Cell, Caption + `TablePagination` | Real table roles (or native `<table>` with grid layout), sort state (`aria-sort`) | P1 |
| **Checkbox** | Root, Indicator | Indeterminate state | P1 |
| **RadioGroup** | Root, Item, Indicator | Group labelling, roving focus | P1 |
| **Switch** | Root, Thumb | Keep native semantics | P2 |
| **SegmentControl** | Root, Item, Indicator | Skip disabled items, sliding indicator | P1 |
| **Pills** | Root, Item | Already close; adopt `useRovingFocus` | P2 |
| **Carousel** | Root, Viewport, Slide, Prev, Next, Dots, Dot | Pause on hover, focus and reduced motion; correct tab roles; scroll-snap | P1 |
| **DatePicker** | Built on new `Calendar` (Root, Header, Grid, Cell) | Grid keyboard navigation (arrows, PageUp/PageDown, Home/End) | P1 |
| **InputDate** | Field + Popover + Calendar | Escape, focus return, `aria-haspopup="dialog"` | P1 |
| **InputText / InputTextArea** | Built on `Field` (Root, Label, Control, Description, Error), with `Prefix` and `Suffix` slots | Label wiring when a consumer passes `id`; textarea auto-resize option | P1 |
| **Steps** | Root, Item, Indicator, Title, Description, Separator | Real buttons for clickable steps, `aria-current="step"` | P2 |
| **List** | Root, Item, DragHandle | Keyboard reorder (Space to lift, arrows to move, live announcements) | P1 |
| **Toolbar (+Filter, MoreFilter, FilterChip)** | Toolbar Root, Button, Separator, ToggleGroup; filters on DropdownMenu | APG toolbar roving focus; menus get Escape and arrows; no nested interactive elements | P1 |
| **PageHeader** | Root, Breadcrumbs, Title, Actions | Uses the new Breadcrumbs, DropdownMenu and CommandPalette | P2 |
| **Sidebar** | Keep composition API only; data API becomes a wrapper | Unique ids in collapse, chevron icon instead of the ▼ glyph | P2 |
| **Card** | Root, Header, Title, Description, Media, Body, Footer, Actions | Forward HTML attributes, `asChild` for link cards | P1 |
| **Banner** | Root, Media, Title, Description, Actions, Close | Use a real button for actions | P2 |
| **UploadField** | Root, Dropzone, Trigger, List, Item, Progress | Dropzone is a button-like region with keyboard support; wire "View" | P2 |
| **Button** | Root (+ `asChild`), Icon; `ButtonGroup`; `IconButton` | `size` prop, default `type="button"`, `loading` state | P0 |
| **Progress** | Root, Indicator, Label, Value; new `ProgressCircle` | Label association, indeterminate state | P2 |
| **Loader** | Becomes `Spinner` | Reduced-motion guard | P2 |
| **Icon** | Unchanged API | `aria-hidden` by default unless `label` is given | P2 |
| **Logo** | Rename to **`BrandLogo`** (third-party logos) to free the name for the Pada mark | | P2 |
| **Text** | Becomes `Text` + `Heading` with token-based sizes instead of inline styles | | P2 |
| **Tags** | Becomes **`Tag`** (removable, `asChild`) + `TagGroup`; drop the 9 deprecated aliases in 3.0 | | P2 |
| **KeyValue** | Merged into **`DescriptionList`** (see below) | | P2 |
| **CodeSnippet, Indexer, FormLabel, SearchField, Slider** | Tokens and motion only; Slider gains `RangeSlider` (below) | | P2 |

## 2. Port from Angular to React

| Angular component | React 2.0 | Notes |
|---|---|---|
| `ds-avatar` | **Avatar** (Root, Image, Fallback) + **AvatarGroup** | Image load state with fallback to initials, then icon |
| `ds-badge` | **Badge** | Status/count badge; separate from `Tag` |
| `ds-info-tooltip`, `ds-info-icon` | `Tooltip` + `Icon name="info"`; documented recipe `InfoTip` | Not a separate component in React |
| `ds-attributes`, `ds-section-header`, `ds-attribute-row` | **DescriptionList** (Root, Section, SectionHeader, Item, Term, Details) | Merges React `KeyValue`; supports horizontal (React today) and stacked (Angular today) layouts |

## 3. New components

### Wave 1

| Component | Purpose | Parts | APG pattern | Priority |
|---|---|---|---|---|
| **Field** | Label, control, description and error wiring for any input | Root, Label, Control, Description, Error | n/a | P0 |
| **Stack** | Flex layout primitive with token gaps | Stack (`direction`, `gap`, `align`, `justify`, `wrap`) | n/a | P1 |
| **Separator** | Visual or semantic divider | Separator (`orientation`, `decorative`) | separator | P1 |
| **VisuallyHidden** | Screen-reader-only content | VisuallyHidden | n/a | P0 |
| **Toggle** | Pressable on/off button | Toggle | button (`aria-pressed`) | P1 |
| **ToggleGroup** | Single or multi toggle set | Root, Item | toolbar / radio | P1 |
| **DropdownMenu** | Action menus | Root, Trigger, Content, Item, CheckboxItem, RadioGroup, RadioItem, Label, Separator, Sub, SubTrigger, SubContent, Shortcut | menu / menu button | P0 |
| **AlertDialog** | Confirmation that needs a decision | Dialog parts + Action, Cancel | alertdialog | P1 |
| **Toaster / Toast** | Queued notifications (replaces Notification internals) | see refactor table | status / alert live regions | P0 |
| **CommandPalette** | ⌘K search and actions (PageHeader already has a command trigger) | Root, Input, List, Group, Item, Empty, Shortcut | combobox + listbox | P1 |
| **Combobox** | Filterable input with suggestions (single and multi) | Root, Input, Trigger, Content, Item, Empty, Chip | combobox | P0 |
| **Breadcrumbs** | Location trail (pulled out of PageHeader) | Root, List, Item, Link, Separator, Ellipsis | breadcrumb | P1 |
| **Pagination** | Page navigation (pulled out of Table) | Root, Prev, Next, Item, Ellipsis, PageSize | navigation | P1 |
| **Avatar / AvatarGroup** | User or entity image with fallbacks | see port table | img | P1 |
| **Badge** | Status or count | Badge (`tone`, `variant`, `dot`) | n/a | P1 |
| **Skeleton** | Loading placeholder | Skeleton (`shape`, `lines`) | n/a | P1 |
| **Alert / Callout** | Inline, persistent message | Root, Icon, Title, Description, Actions | alert (when urgent) | P1 |
| **EmptyState** | No data, first use, error states | Root, Media, Title, Description, Actions | n/a | P1 |
| **Kbd** | Keyboard shortcut display | Kbd, KbdGroup | n/a | P2 |
| **Spinner** | Indeterminate loading (replaces Loader) | Spinner | status | P1 |
| **IconButton** | Icon-only button with required label | IconButton | button | P0 |
| **Link** | Styled anchor with `asChild` for router links | Link | link | P1 |
| **ThemeProvider / ThemeToggle** | Set theme axes for a subtree; light/dark/system switch with View Transitions reveal | ThemeProvider, ThemeToggle | n/a | P1 |

### Wave 2

| Component | Purpose | APG pattern | Priority |
|---|---|---|---|
| **NumberInput** | Numeric field with steppers, min/max, formatting | spinbutton | P1 |
| **PasswordInput** | Show/hide toggle, strength slot | n/a | P2 |
| **PinInput / OTP** | One-time codes | n/a | P2 |
| **TagInput / MultiSelect** | Free-form or constrained multi-value input with chips | combobox | P1 |
| **RangeSlider** | Two-thumb slider | slider (multi-thumb) | P2 |
| **CheckboxGroup** | Labelled group with select-all | group | P2 |
| **RadioCard** | Rich, card-shaped radio options | radio | P2 |
| **Rating** | Star or icon rating | radio group | P2 |
| **TimePicker** | Time segments | spinbutton | P2 |
| **ColorPicker** | Swatches plus OKLCH area (also powers the site playground) | slider / grid | P2 |
| **ContextMenu** | Right-click menu (shares DropdownMenu internals) | menu | P2 |
| **HoverCard** | Rich preview on hover/focus | dialog (non-modal) | P2 |
| **Collapsible** | Single show/hide region (base of Accordion) | disclosure | P1 |
| **Menubar** | Desktop-style application menu | menubar | P2 |
| **Tree** | Hierarchical navigation and selection | tree view | P1 |
| **DataTable** | Table + sorting, selection, column visibility, virtualisation (TanStack Table adapter, headless) | grid | P1 |
| **Calendar** | Standalone month grid (base of DatePicker) | grid | P1 |
| **DateRangePicker** | Two-month range selection with presets | grid + dialog | P1 |
| **Timeline** | Ordered events | list | P2 |
| **Stat** | KPI with label, value, delta, sparkline slot; number ticker motion | n/a | P2 |
| **ScrollArea** | Styled scrollbars, keeps native scrolling | n/a | P2 |
| **AspectRatio** | Media ratio box | n/a | P2 |
| **Grid / Container** | Layout primitives with container queries | n/a | P2 |
| **Sheet / BottomSheet** | Mobile-first drawer with drag to dismiss | dialog | P2 |
| **Resizable** | Split panes | window splitter | P2 |

## 4. Definition of done (every component)

- [ ] Spec in `specs/<component>.md` (parts, attributes, keyboard, tokens, motion)
- [ ] Headless parts in `pada-ds/headless` and `pada-ds-angular/headless`
- [ ] Styled skin in both frameworks, tier 3 tokens only
- [ ] Motion from [05](./05-motion.md), reduced-motion safe
- [ ] Interaction tests from the spec's keyboard table; axe clean in every state
- [ ] JSDoc on every prop and part, so `manifest.json`, `llms.txt` and `llms-full.txt` pick it up
- [ ] Docs page (Purpose, Design, Developer, Accessibility, as `DemoPage` does today) with React and Angular code tabs
- [ ] Figma component updated
- [ ] Parity matrix row set to ✅ in both repos

## 5. As built (React, phases 3 to 5)

Every component below has JSDoc for the manifest, Vitest and axe tests, and a demo page.

**Refactors done:**
- **Overlays.** Dialog, AlertDialog, Drawer and DropdownMenu (Modal and SideDrawer are now wrappers). Popover and Tooltip gained compound parts.
- **Tabs.** Headless, with a sliding indicator and a pills variant.
- **Accordion.** Built on Collapsible.
- **Table.** Table roles, `aria-sort` and keyboard column resizing.
- **Steps.** Real buttons and `aria-current="step"`.
- **List.** Keyboard reorder with announcements, and FLIP motion.
- **Toolbar filters.** On Popover and vertical Tabs, and FilterChip has no nested controls.
- **Select.** Portalled, floating and flips; dismissable inside dialogs; type-ahead; a hidden input for `name`.
- **UploadField.** Description wired up, progressbar, and a working View action.
- **DatePicker and InputDate.** On Calendar.
- **Logo.** Renamed `BrandLogo`.
- **Accessibility fixes** in Button (`size`, `loading`, `type="button"`), Checkbox (`indeterminate`), InputText and InputTextArea, Carousel (APG carousel), Notification, ComboBox (roving focus) and Breadcrumbs (focus on expand).

**Refactors not done:**
- **Not yet compound parts:** Select, Card, Banner, PageHeader, Sidebar, Progress (no `ProgressCircle`), Text (no `Heading`), Tags (no `Tag` / `TagGroup`), SegmentControl, Pills, RadioGroup and Switch. They use the 2.0 tokens and keep their 1.x APIs.
- **ComboBox not renamed.** It keeps its name; `Autocomplete` is the real combobox.
- **KeyValue not merged.** It is not yet merged into `DescriptionList`.
- **InputText and InputTextArea not moved onto Field.** Use `Field` directly for new forms.

**Ported from Angular:** Avatar and AvatarGroup, and Badge. DescriptionList is not done.

**Wave 1:** all shipped.
- Field, Stack, Separator, VisuallyHidden (headless).
- Toggle and ToggleGroup.
- DropdownMenu, AlertDialog.
- Toaster and `toast()`.
- CommandPalette, and Combobox (styled as `Autocomplete`).
- Breadcrumbs, Pagination.
- Avatar, Badge, Skeleton, Alert, EmptyState, Kbd (a `keys` prop instead of `KbdGroup`), Spinner.
- IconButton, Link.
- ThemeProvider and ThemeToggle.

**Wave 2:**
- **Shipped:** NumberInput, PasswordInput, PinInput, TagInput, RangeSlider, RadioCard (`RadioCardGroup`), Rating, ContextMenu, HoverCard, Collapsible, Tree, Calendar (range selection, also used by InputDate), Timeline, Stat, ScrollArea, AspectRatio, Grid and Container.
- **Not started:** CheckboxGroup, TimePicker, ColorPicker, Menubar, DataTable, the two-month DateRangePicker with presets, Sheet and Resizable.

**Definition of done, React side:** specs in `specs/` and Figma updates are still outstanding for every component.

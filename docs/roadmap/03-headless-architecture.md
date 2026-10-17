# 03. Headless architecture

Pada 2.0 ships in **two layers**:

```
┌──────────────────────────────────────────────────────────┐
│ Styled skin   pada-ds              (optional)            │
│   one class per part, tokens only, motion, variants      │
├──────────────────────────────────────────────────────────┤
│ Headless core pada-ds/headless                           │
│   state, keyboard, focus, ARIA, positioning, presence    │
│   exposes state via data-* / aria-* attributes           │
└──────────────────────────────────────────────────────────┘
```

- Teams with their own visual language use only the **core** and style it however they want (CSS, Tailwind, CSS modules).
- Teams that want the Pada look use the **styled skin**, and can still restyle it through tokens.
- Both layers are in the same package with separate entry points, so there is one version to manage.

## 1. Principles

1. **State lives in attributes.** Every part exposes its state as `data-state="open|closed|checked|unchecked|on|off"`, `data-disabled`, `data-highlighted`, `data-orientation`, `data-side`, `data-align`, plus the correct `aria-*`. Styles key off attributes, never class toggles (this generalises `instructions.md`).
2. **Compound parts, not prop soup.** `Dialog.Root`, `Dialog.Trigger`, `Dialog.Content` … Each part renders one element and accepts all native props plus `ref`.
3. **`asChild` composition.** Any part can merge its behaviour onto a consumer element (`<Dialog.Trigger asChild><MyButton/></Dialog.Trigger>`), so routers' `Link` components and custom buttons just work.
4. **Controlled and uncontrolled everywhere**, through one `useControllableState` hook (`value`/`defaultValue`/`onValueChange`, `open`/`defaultOpen`/`onOpenChange`).
5. **Scoped DOM access.** Focus and query logic is always scoped to the component root (`instructions.md` §6.a). No `document.getElementById`.
6. **No styles in the core.** The core may set only functional inline styles (positioning coordinates, `--pada-*-available-height` style variables for the skin to use).

## 2. React core: `pada-ds/headless`

### Utilities

| Utility | Purpose | Built from |
|---|---|---|
| `useControllableState` | Controlled/uncontrolled state | Replaces the hand-written `isControlled` blocks |
| `useId` (re-export of `React.useId` with prefixing) | Stable ids for ARIA wiring | Fixes Tabs, Popover, SidebarCollapse |
| `FocusScope` / `useFocusTrap` | Trap, auto-focus, restore | Extracted from `Modal.tsx` |
| `useDismissable` | Escape, outside pointer, focus outside; layered so only the top layer closes | Replaces 5 copies of click-outside and Escape |
| `useRovingFocus` | Roving tabindex for toolbars, tabs, radio groups, toggle groups | Generalised from Pills |
| `useListNavigation` | Arrow keys, Home/End, typeahead, skip disabled | Generalised from `Select/selectNavigation.ts` |
| `useFloating` | Anchored positioning with flip, shift, size, arrow | Wraps `@floating-ui/react-dom`; replaces `Popover.tsx` manual maths |
| `usePresence` / `Presence` | Keeps an element mounted until its exit animation ends | Generalised from `Notification.tsx` |
| `Portal` | Render into `document.body` or a container | New; fixes clipping and z-index for overlays |
| `Slot` | Implements `asChild` (merges props, refs, handlers) | New |
| `VisuallyHidden` | Screen-reader-only content | New |
| `useScrollLock` | Body scroll lock with scrollbar-gap compensation | Extracted from `Modal.tsx` |
| `DirectionProvider` | RTL support for arrow-key logic | New |

### Compound part example

```tsx
import { Dialog } from 'pada-ds/headless';

<Dialog.Root open={open} onOpenChange={setOpen}>
  <Dialog.Trigger asChild><button>Edit profile</button></Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Overlay className="my-overlay" />          {/* data-state="open|closed" */}
    <Dialog.Content className="my-dialog">             {/* role="dialog" aria-modal aria-labelledby */}
      <Dialog.Title>Edit profile</Dialog.Title>
      <Dialog.Description>Changes save automatically.</Dialog.Description>
      <Dialog.Close>Done</Dialog.Close>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
```

### Styled skin over the core

```tsx
import { Dialog } from 'pada-ds';  // styled parts: same names, classes and tokens applied

<Dialog.Root>
  <Dialog.Trigger asChild><Button>Edit profile</Button></Dialog.Trigger>
  <Dialog.Content size="md">          {/* Portal + Overlay included by default in the skin */}
    <Dialog.Header>
      <Dialog.Title>Edit profile</Dialog.Title>
      <Dialog.Close />
    </Dialog.Header>
    <Dialog.Body>…</Dialog.Body>
    <Dialog.Footer>…</Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
```

### Backward compatibility

The 1.x convenience APIs stay as **wrappers over the parts** for all of 2.x:

```tsx
// 1.x API keeps working in 2.x
<Modal open={open} onOpenChange={setOpen} title="Edit profile">…</Modal>
// is implemented as
<Dialog.Root open={open} onOpenChange={setOpen}>
  <Dialog.Content><Dialog.Header><Dialog.Title>Edit profile</Dialog.Title>…</Dialog.Header>…</Dialog.Content>
</Dialog.Root>
```

They are marked `@deprecated` in 2.x (with the replacement in the JSDoc, so the manifest and llms files carry it) and removed in 3.0.

### Package layout

```
src/
├── headless/            pada-ds/headless entry (no CSS imports)
│   ├── utils/           hooks above
│   └── <component>/     parts, context, state machine
├── components/          pada-ds entry: styled parts + 1.x wrappers
└── styles/              tokens (generated) + base
```

`package.json` gains `"./headless": "./dist/headless.js"`. The headless bundle must not import any CSS (checked in `component-manifest.test.mjs`).

## 3. Angular core: `pada-ds-angular/headless`

Angular gets the same model built on `@angular/cdk`, which is already a dependency.

| React core | Angular core |
|---|---|
| Compound parts with context | Directives on the consumer's own elements, coordinated through DI (parent directive injected by children) |
| `useFloating` + `Portal` | CDK `Overlay` with flexible connected position strategy |
| `FocusScope` | CDK `FocusTrap`, `FocusMonitor` |
| `useListNavigation` / `useRovingFocus` | CDK `ActiveDescendantKeyManager` / `FocusKeyManager` |
| Live regions | CDK `LiveAnnouncer` |
| `useControllableState` | `model()` signal inputs (two-way binding) |
| `usePresence` | Native `animate.enter` / `animate.leave` (Angular 20.2+) |
| `asChild` | Not needed: directives attach to any element |

```html
<!-- headless: directives on your own markup -->
<button dsDialogTrigger [dsDialogTriggerFor]="editDialog">Edit profile</button>
<ng-template #editDialog>
  <div dsDialogContent>        <!-- role="dialog", focus trap, data-state -->
    <h2 dsDialogTitle>Edit profile</h2>
    <button dsDialogClose>Done</button>
  </div>
</ng-template>

<!-- styled: components that compose the directives through hostDirectives -->
<ds-dialog-content size="md"> … </ds-dialog-content>
```

Styled Angular components compose headless directives with `hostDirectives` (a brain/helm split, as in Spartan). The data-driven `input.required<XData>()` pattern from the Angular `CLAUDE.md` stays for "data components" such as Attributes and Table rows. A proposed `CLAUDE.md` amendment is in the Angular repo (`docs/roadmap/claude-md-amendment.md`).

## 4. Shared component spec

Each component has one spec (`specs/<component>.md`), copied into both repos with the tokens. Template:

```md
# Dialog
APG pattern: Dialog (Modal)
## Parts
| Part | Element | Role / ARIA | State attributes |
| Root | none | n/a | n/a |
| Trigger | button | aria-haspopup="dialog", aria-expanded, aria-controls | data-state |
| Overlay | div | n/a | data-state |
| Content | div | role="dialog", aria-modal="true", aria-labelledby, aria-describedby | data-state |
| Title | h2 | n/a | n/a |
| Description | p | n/a | n/a |
| Close | button | aria-label="Close" when icon-only | n/a |
## Keyboard
| Key | Action |
| Tab / Shift+Tab | Cycle within Content |
| Escape | Close, return focus to Trigger |
## Props / inputs
open, defaultOpen, onOpenChange (React) · open (model) (Angular) · modal (default true)
## Component tokens
--pada-dialog-bg, --pada-dialog-radius, --pada-dialog-width-{sm,md,lg}, --pada-dialog-pad, --pada-dialog-shadow
## Motion
Overlay: fade, duration-normal. Content: scale 0.96 → 1 + fade, ease-emphasized.
```

## 5. Testing the core

- **Interaction tests** (Vitest + Testing Library in React, Vitest + TestBed in Angular) generated from the spec's keyboard table, so both frameworks run the same scenarios.
- **axe** checks on every part in every state.
- **Playwright** keyboard tests against the docs site for overlay stacking, focus restore and scroll lock.
- **Headless purity test:** the headless bundle has no CSS imports and sets no visual inline styles.

## 6. As built (phase 2)

- `pada-ds/headless` ships `Dialog`, `Popover`, `Tooltip` and `DropdownMenu` (with submenus, checkbox and radio items), plus the utilities in §2. Parts use React 19 ref-as-prop; there is no `forwardRef`.
- Positioning uses `@floating-ui/react-dom` with `top`/`left` (not `transform`), so the styled layer can animate `transform` freely. Floating parts get `data-side`, `data-align` and the CSS variables `--pada-floating-available-width/height`, `--pada-floating-anchor-width/height` and `--pada-floating-transform-origin`.
- Every open layer carries `data-pada-layer`. The dismiss stack, the focus trap and `useHideOthers` use it so nested overlays (a menu inside a dialog) behave as one stack.
- `usePresence` keeps a closing part mounted for its longest transition or animation, read from computed styles, so exit motion needs CSS only. With reduced motion every duration is 0 and parts unmount at once.
- Not done yet: `DirectionProvider` (a `dir` prop exists on `DropdownMenu.Root`), pointer "safe triangle" for submenus, and manifest/llms entries for the headless parts (they are described in the llms introduction for now).
- Tests: Vitest + Testing Library + axe-core in jsdom, 28 tests across the four components covering the APG keyboard maps, focus movement and return, layering and ARIA.

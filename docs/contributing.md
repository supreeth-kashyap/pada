# Building a Pada component for React

[`CLAUDE.md`](../CLAUDE.md) has the rules; this page has the patterns. Dialog, Popover, Field,
InputText and Button are the reference implementations. Every component has an Angular twin in
[`pada-ds-angular`](https://github.com/supreeth-kashyap/pada-ds-angular) with the same parts,
attributes, keyboard map and tokens.

## Layout

```
projects/pada-ds/src/
├── headless/<Name>/<Name>.tsx (+ .test.tsx, index.ts)            pada-ds/headless
├── headless/utils/                                                shared behaviour (see below)
├── components/<Name>/<Name>.tsx, .css, .stories.tsx, .test.tsx    pada-ds
└── index.ts, headless/index.ts                                    export lists
```

Export new headless parts from `src/headless/index.ts` and styled components from `src/index.ts`.
`npm test` fails when an exported component is missing from the manifest or the llms files are
stale; run `npm run build` to regenerate them.

## Headless utilities

| Utility | Use |
|---|---|
| `useControllableState` | Controlled and uncontrolled values in one place |
| `Slot` | `asChild`: merges props, refs and handlers onto the child element |
| `usePresence` | Keeps an element mounted until its exit transition ends |
| `floating.ts` | `side`, `align`, offsets and collisions; sets `data-side` / `data-align` |
| `useDismissable` | Escape and outside interactions, with layer stacking |
| `focus.ts`, `modal.ts` | Focus scope, trap and restore; scroll lock and `hideOthers` |
| `navigation.ts`, `useTypeahead` | Roving focus and type-ahead over item lists |
| `Portal`, `VisuallyHidden`, `useIsClient` | Top layer, screen-reader-only content, SSR-safe client checks |

## CSS

Order the file root, variant tokens, children, then states:

```css
/* Root */
.tabs {
  --pada-tabs-pad: var(--pada-space-2) var(--pada-space-3);
}

/* Variants only reassign component tokens */
.tabs[data-size="sm"] {
  --pada-tabs-pad: var(--pada-space-1) var(--pada-space-2);
}

/* Children read the tokens */
.tab {
  padding: var(--pada-tabs-pad);
}

/* States come from attributes */
.tab[aria-selected="true"] {}
.tab:disabled {}
.tab:focus-visible {}
```

- One structural class per semantic element, no BEM modifiers, no state suffixes.
- If a component has a global disabled or read-only state, expose it once on the root as a
  `data-*` attribute; children keep their native `disabled` / `aria-*`.
- Model size with a root `data-size` even when only one size exists today.
- Enter motion uses `@starting-style`; exit motion uses `usePresence`. Durations and easings come
  from the motion tokens, so `data-motion="reduced"` turns them off.

## Checklist

- [ ] At most two CSS classes per component element, no visual conditionals in JSX
- [ ] Variants only modify component tokens; a new variant touches one CSS block
- [ ] ARIA attributes drive styling
- [ ] Tests cover behaviour, keyboard, ARIA and axe; stories cover every variant
- [ ] The Angular twin matches (or the difference is documented)
- [ ] A content page exists in `content/components/<name>.md` (docs site and Storybook), and
      `npm run docs:data` has been run

## Before you push

```bash
npm run lint && npm test && npm run tokens:check && npm run build
```

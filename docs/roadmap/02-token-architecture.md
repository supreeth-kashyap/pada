# 02. Token architecture

Goal: a token system where **a few knobs drive everything**. Changing the accent hue, base radius, density, type ratio or motion scale should cascade through derived tokens to every component, in both frameworks, with no component CSS changes.

## 1. Source and build pipeline

```
tokens/                       (this repo, DTCG JSON: the single source)
├── ref/                      tier 0: colour ramps, space, radius, type, motion, elevation
├── sys/                      tier 1: semantic, one file per theme
│   ├── light.json
│   ├── dark.json
│   └── high-contrast.json
├── derived.json              tier 2: calc() / color-mix() formulas
└── component/                tier 3: one file per component
        │
        ▼  Style Dictionary v4 (scripts/build-tokens.mjs)
dist/
├── tokens.css                CSS custom properties, all themes
├── tokens.scss               SCSS maps and variables (breakpoints, mixins)
├── tokens.ts                 typed token names and values for TS consumers
└── tokens.json               flat resolved values (Figma sync, docs, llms)
        │
        ▼  scripts/sync-tokens-angular.mjs
pada-ds-angular/projects/pada-ds/src/styles/
├── tokens.css                copied, with a header: /* pada-tokens v2.0.0 sha256:… */
└── tokens.scss
```

- **Format:** [DTCG](https://design-tokens.github.io/community-group/format/) (`$value`, `$type`, `$description`), so the same files can be imported into Figma (Tokens Studio or Figma Variables) later.
- **Sync to Angular (decision: copy, not a package).** `npm run tokens:sync -- ../pada-ds-angular` copies the built files and writes the version and content hash in a header comment. The Angular repo adds `npm run tokens:check`, which fails CI when the header does not match the hash of the file body, so hand edits are caught. The Angular roadmap also records the React version the copy came from.
- **Prefix:** every token is `--pada-*`, so it cannot collide with Tailwind or consumer variables.
- **Docs and AI:** `tokens.json` feeds the docs site, the marketing playground and a new tokens section in `llms-full.txt`.

## 2. The five tiers

```
 knobs ──► tier 0 reference ──► tier 1 semantic ──► tier 2 derived ──► tier 3 component ──► tier 4 local
 (5)       raw ramps/scales     themed meaning      calc/color-mix     per-part vars        consumer overrides
```

### Tier 0: reference (`--pada-ref-*`)

Raw values. **Components never use these directly** (enforced by a lint rule).

| Group | Example | Notes |
|---|---|---|
| Colour ramps | `--pada-ref-indigo-500` | 11 steps (50 to 950), generated in **OKLCH** so lightness steps are perceptually even. Hues: neutral (stone), indigo, amber, purple, green, red, sky, plus the existing extra hues kept for `data-accent`. |
| Space unit | `--pada-ref-space-unit: 4px` | Base for the spacing scale |
| Radius base | `--pada-ref-radius-base: 6px` | Base for the radius scale |
| Type | `--pada-ref-font-size-base: 13px`, `--pada-ref-type-ratio: 1.2` | Keeps today's compact 13px base |
| Durations | `--pada-ref-duration-200: 200ms` | See [05](./05-motion.md) |
| Easings | `--pada-ref-ease-out-quint: cubic-bezier(0.22, 1, 0.36, 1)` | |
| Elevation | `--pada-ref-shadow-color`, offsets, blurs | Shadows built from parts so dark mode can change only the colour |

### Tier 1: semantic (`--pada-color-*`, `--pada-font-*` …)

Meaning-based tokens. **Themes swap only this tier.**

| Group | Tokens |
|---|---|
| Surfaces | `surface`, `surface-sunken`, `surface-raised`, `surface-overlay`, `backdrop` |
| Foreground | `fg`, `fg-muted`, `fg-subtle`, `fg-disabled`, `fg-on-solid`, `fg-link` |
| Borders | `border`, `border-strong`, `border-subtle` |
| Intents | `accent`, `neutral`, `success`, `warning`, `danger`, `info`, each with `-solid`, `-subtle`, `-fg`, `-border` |
| Focus | `focus-ring`, `focus-ring-offset` |
| Typography | `font-sans`, `font-mono`, `font-display`, `font-weight-regular/medium/semibold/bold` |
| Elevation | `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-overlay` |

Example:

```css
:root, [data-theme="light"] {
  --pada-color-surface: var(--pada-ref-neutral-0);
  --pada-color-fg-muted: var(--pada-ref-neutral-600);
  --pada-color-accent-solid: oklch(0.58 0.2 var(--pada-accent-hue));
  --pada-color-danger-solid: var(--pada-ref-red-600);
}
```

### Tier 2: derived (computed from tier 1 and the knobs)

This is where the "multi-level derivative" behaviour lives. Derived tokens are formulas, not values, so changing one knob updates hundreds of tokens.

**The knobs**

| Knob | Default | Drives |
|---|---|---|
| `--pada-accent-hue` | `277` (indigo) | Every accent colour, hover, pressed, subtle, focus ring |
| `--pada-radius-base` | `6px` | Radius scale `xs` to `xl`; `full` stays `9999px` |
| `--pada-density` | `1` | Spacing scale, control heights, padding |
| `--pada-type-ratio` | `1.2` | Font-size scale |
| `--pada-motion-scale` | `1` (set to `0` for reduced motion) | Every duration |

**Formulas**

```css
:root {
  /* interaction states, derived from the solid colour */
  --pada-color-accent-solid-hover:   color-mix(in oklch, var(--pada-color-accent-solid), black 8%);
  --pada-color-accent-solid-pressed: color-mix(in oklch, var(--pada-color-accent-solid), black 16%);
  --pada-color-accent-subtle-hover:  color-mix(in oklch, var(--pada-color-accent-subtle), var(--pada-color-accent-solid) 8%);
  --pada-color-focus-ring:           color-mix(in oklch, var(--pada-color-accent-solid), transparent 40%);

  /* spacing from a unit and a density multiplier */
  --pada-space-1: calc(1 * var(--pada-ref-space-unit) * var(--pada-density));
  --pada-space-2: calc(2 * var(--pada-ref-space-unit) * var(--pada-density));
  --pada-space-3: calc(3 * var(--pada-ref-space-unit) * var(--pada-density));
  /* … 4, 5, 6, 8, 10, 12, 16 */

  /* control heights follow density too */
  --pada-control-height-sm: calc(28px * var(--pada-density));
  --pada-control-height-md: calc(32px * var(--pada-density));
  --pada-control-height-lg: calc(40px * var(--pada-density));

  /* radius scale from one base */
  --pada-radius-xs: calc(var(--pada-radius-base) * 0.5);
  --pada-radius-sm: calc(var(--pada-radius-base) * 0.75);
  --pada-radius-md: var(--pada-radius-base);
  --pada-radius-lg: calc(var(--pada-radius-base) * 1.5);
  --pada-radius-xl: calc(var(--pada-radius-base) * 2);

  /* modular type scale */
  --pada-font-size-sm: calc(var(--pada-ref-font-size-base) / var(--pada-type-ratio));
  --pada-font-size-md: var(--pada-ref-font-size-base);
  --pada-font-size-lg: calc(var(--pada-ref-font-size-base) * var(--pada-type-ratio));
  --pada-font-size-xl: calc(var(--pada-font-size-lg) * var(--pada-type-ratio));

  /* motion */
  --pada-duration-fast:   calc(120ms * var(--pada-motion-scale));
  --pada-duration-normal: calc(200ms * var(--pada-motion-scale));
}

@media (prefers-reduced-motion: reduce) {
  :root { --pada-motion-scale: 0; }
}
```

**Browser support:** `color-mix()` and OKLCH are Baseline 2023. The build also emits a static fallback (pre-computed hex values) for each derived colour, placed before the formula so older browsers keep the fallback and newer ones use the formula.

**Text contrast:** `--pada-color-fg-on-solid` is chosen per theme and per accent by the build, which checks WCAG contrast against the solid colour and fails the build when no candidate reaches 4.5:1.

### Tier 3: component (`--pada-<component>-*`)

Each component declares its own variables, defaulting to tiers 1 and 2. **Variants only reassign component tokens**, as `instructions.md` §3 already requires.

```css
.pada-button {
  --pada-button-bg: var(--pada-color-accent-solid);
  --pada-button-bg-hover: var(--pada-color-accent-solid-hover);
  --pada-button-fg: var(--pada-color-fg-on-solid);
  --pada-button-height: var(--pada-control-height-md);
  --pada-button-pad-x: var(--pada-space-3);
  --pada-button-radius: var(--pada-radius-md);

  background: var(--pada-button-bg);
  color: var(--pada-button-fg);
  height: var(--pada-button-height);
  padding-inline: var(--pada-button-pad-x);
  border-radius: var(--pada-button-radius);
}
.pada-button[data-variant="secondary"] {
  --pada-button-bg: var(--pada-color-neutral-subtle);
  --pada-button-bg-hover: var(--pada-color-neutral-subtle-hover);
  --pada-button-fg: var(--pada-color-fg);
}
.pada-button[data-size="sm"] {
  --pada-button-height: var(--pada-control-height-sm);
  --pada-button-pad-x: var(--pada-space-2);
}
```

The component tokens are listed in each component's spec and in `manifest.json`, so consumers (and AI agents) know exactly which variables are supported.

### Tier 4: local

Consumers override any tier 3 token on an element or a scoped class. This is the supported escape hatch:

```html
<button class="pada-button" style="--pada-button-radius: 9999px">Pill button</button>
```

## 3. Theme axes

Axes are independent attributes that can be set on `<html>` or any subtree, and they combine freely.

| Attribute | Values | Changes |
|---|---|---|
| `data-theme` | `light`, `dark`, `high-contrast`; none = follow the OS | Tier 1 colours and shadows |
| `data-accent` | `indigo` (default), `violet`, `amber`, `emerald`, `rose`, `sky`, … | `--pada-accent-hue` (and chroma where needed) |
| `data-density` | `compact` (0.85), `comfortable` (1), `spacious` (1.15) | `--pada-density` |
| `data-radius` | `none`, `sm`, `md`, `lg`, `full` | `--pada-radius-base` |
| `data-motion` | `reduced`, `full` | `--pada-motion-scale` (an in-app override of the OS setting) |

```html
<html data-theme="dark" data-accent="amber" data-density="compact">
  <aside data-theme="light">Always light</aside>
</html>
```

## 4. New token categories

| Category | Tokens |
|---|---|
| Motion | Durations, easings, `motion-scale` (see [05](./05-motion.md)) |
| z-index (semantic) | `--pada-z-base: 0`, `dropdown: 1000`, `sticky: 1100`, `overlay: 1200`, `modal: 1300`, `popover: 1400`, `toast: 1500`, `tooltip: 1600` |
| Breakpoints | `sm 640`, `md 768`, `lg 1024`, `xl 1280`, `2xl 1536`, shipped as SCSS variables, `@custom-media` (with PostCSS) and a TS object. Components prefer **container queries** |
| Opacity | `disabled: 0.5`, `muted: 0.7`, `backdrop: 0.6` |
| Border width | `thin: 1px`, `thick: 2px`, `focus: 2px` |
| Focus ring | `--pada-focus-ring-width`, `-offset`, `-color`, composed into `--pada-shadow-focus` and working in dark mode |
| Control sizes | `control-height-sm/md/lg`, `icon-size-sm/md/lg` |

## 5. Migration from 1.x

1. **Aliases for one major.** `dist/tokens-legacy.css` maps every 1.x name to its 2.0 equivalent (`--color-primary-500: var(--pada-ref-indigo-500)`, `--color-bg: var(--pada-color-surface)` …). It is imported automatically by `tokens.css` in 2.x and removed in 3.0.
2. **Deprecation table** in the migration guide: every old name, its replacement, and whether the mapping is exact or approximate.
3. **Codemod** (`npx pada-codemod tokens`) rewrites `var(--color-…)` references in consumer CSS.
4. **Bug fixes** from [01 §3](./01-current-state-audit.md#3-token-layer-bugs) land in phase 0, before the rename, so 1.x users get them too.
5. **Lint:** `scripts/check-tokens.mjs` fails when component CSS uses an undefined `var(--…)`, a tier 0 token, a literal colour, z-index or duration.

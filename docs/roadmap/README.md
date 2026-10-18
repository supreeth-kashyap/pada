# Pada 2.0 Roadmap

> **pāda** (पाद), Sanskrit for *foot*: the part that carries weight and stands on the ground.
> Pada should be **the foundation your product stands on**.

This folder is the master plan for Pada 2.0. It covers the React package (`pada-ds`, this repo) and the Angular package ([`pada-ds-angular`](https://github.com/supreeth-kashyap/pada-ds-angular)). The Angular repo keeps its own [`docs/roadmap/`](https://github.com/supreeth-kashyap/pada-ds-angular/tree/main/docs/roadmap) with the Angular-specific plan and a copy of the parity matrix.

| # | Document | What it covers |
|---|---|---|
| 01 | [Current state audit](./01-current-state-audit.md) | What exists today, with file:line references and known bugs |
| 02 | [Token architecture](./02-token-architecture.md) | Five-tier token system with derived tokens, theme axes, migration |
| 03 | [Headless architecture](./03-headless-architecture.md) | Headless core plus styled skin, for React and Angular |
| 04 | [Components](./04-components.md) | Refactors, missing components, delivery waves |
| 05 | [Motion](./05-motion.md) | Motion tokens and the micro-animation catalogue |
| 06 | [Brand and logo](./06-brand-and-logo.md) | Logo concepts based on *pāda*, brand kit |
| 07 | [Marketing site](./07-marketing-site.md) | `pada-site` repo, landing page structure, draft copy, blog scaffold |
| 08 | [Parity](./08-parity.md) | React and Angular parity matrix and process |

---

## Vision

Pada 1.x is a styled React component set. Pada 2.0 becomes a **headless design system with an optional styled skin**, shipped for **React and Angular at parity**:

1. **Headless first.** Behaviour, accessibility, keyboard handling and state live in an unstyled core. Teams with their own visual language use the core directly.
2. **Styled skin as a default.** The `pada-ds` styled layer is a thin skin on top of the core. It is driven entirely by tokens, so it can be re-themed without forking.
3. **Composable.** Components are built from parts (`Dialog.Root`, `Dialog.Content`, …) rather than wide prop lists. The convenience APIs from 1.x stay as wrappers.
4. **Derived tokens.** A handful of knobs (accent hue, radius, density, type ratio, motion scale) cascade through tiers of derived tokens down to every component.
5. **Motion with intent.** Small, consistent micro-animations built on motion tokens. Reduced motion is respected everywhere.
6. **AI-agent ready.** `manifest.json`, `llms.txt` and `llms-full.txt` already ship. 2.0 extends them to the headless parts, tokens and Angular.

## Decisions

| Topic | Decision |
|---|---|
| Headless model | **Two layers:** a headless core (React hooks and unstyled compound parts; Angular directives on `@angular/cdk`) plus an optional styled skin. See [03](./03-headless-architecture.md). |
| Token source | **Generated in this repo** from DTCG JSON, then **copied** into the Angular repo by a sync script with a staleness check. See [02](./02-token-architecture.md). |
| Marketing site and blog | **New separate repo** `pada-site`. See [07](./07-marketing-site.md). |
| Versioning | React goes to **2.0.0** (breaking: token rename, compound APIs). Angular aligns its version to 2.0 when it reaches parity. |
| npm names | React keeps `pada-ds`. The Angular library, also called `pada-ds` in its repo, is renamed **`pada-ds-angular`** to avoid the collision. |

## Phases

Phases are ordered by dependency. Angular parity (phase 6) runs alongside phases 2 to 5, not after them.

| Phase | Scope | Exit criteria |
|---|---|---|
| **0. Hygiene** | Fix the token bugs in [01](./01-current-state-audit.md#3-token-layer-bugs). Angular infrastructure cleanup (see the Angular roadmap). | No undefined `var(--…)` references (enforced by a lint script). Angular `ng build pada-ds` and the library tests pass in CI. |
| **1. Tokens v2** | DTCG source, Style Dictionary build, five tiers, motion, z-index and breakpoint tokens, `--pada-` prefix, aliases for 1.x names, Angular sync script. | `dist/tokens.{css,scss,ts,json}` built. Every component CSS uses only tier 1 to 3 tokens. Angular consumes the synced CSS. Old names still resolve. |
| **2. Headless core** | React `pada-ds/headless` utilities. Angular `pada-ds-angular/headless` directives. Overlays first: Dialog, Popover, Tooltip, Menu. | Overlay parts are exported in both frameworks, meet APG keyboard maps, and pass a11y tests. |
| **3. Refactor** | Rebuild the existing components on the core with compound parts. Fix the a11y gaps from [01](./01-current-state-audit.md). Add motion from [05](./05-motion.md). | All 41 existing components run on the core. 1.x prop APIs still work. No a11y gaps from the audit remain. |
| **4. Wave 1** | High-value new components (see [04](./04-components.md#wave-1)). | Shipped in React and Angular with specs, docs, manifest entries. |
| **5. Wave 2** | The rest of the new components. | As for wave 1. |
| **6. Angular parity** | Port everything to Angular, starting once phase 2 ships. | The [parity matrix](./08-parity.md) is all ✅. |
| **7. Brand** | New mark, wordmark, lockups, favicon, animated mark. | Assets in both repos and in Figma; Sidebar default logo updated. |
| **8. Site** | `pada-site` repo: landing page, docs entry, blog scaffold. | Deployed, with the live token playground. |
| **9. Release 2.0** | Migration guide, codemods (prop renames, token renames), changelog, Figma kit update. | `pada-ds@2.0.0` and `pada-ds-angular@2.0.0` published. |

## Progress

As of 2026-10-18, on the React branch `claude/pada-2` (unreleased). Each document has an "As built" section with the details and what is still open.

| Phase | React | Angular |
|---|---|---|
| 0. Hygiene | ✅ | not started |
| 1. Tokens v2 | ✅ | not started (sync script ready) |
| 2. Headless core | ✅ | not started |
| 3. Refactor | 🟡 overlays, Tabs, Accordion, Table, Steps, List, Select, Toolbar filters, UploadField, DatePicker and InputDate done; Card, Banner, PageHeader, Sidebar, Progress, Text, Tags, SegmentControl, Pills, RadioGroup and Switch still to move to parts | not started |
| 4. Wave 1 | ✅ | not started |
| 5. Wave 2 | 🟡 22 of 25 shipped and DateRangePicker partly (range selection, no two-month view or presets); TimePicker and CheckboxGroup to do | not started |
| 7. Brand | 🟡 `PadaLogo`, favicon and Sidebar default done; exports, social card and Figma to do | not started |
| 8. Site | not started | n/a |
| 9. Release 2.0 | 🟡 [migration guide](../migration-2.0.md) and token codemod written; not published | not started |

## How parity is kept

Every component gets a **spec** (`specs/<component>.md`, shared by both repos) before it is built. A spec lists:

- the parts and their HTML elements and roles
- the state attributes (`data-state`, `data-disabled`, `aria-*`)
- the keyboard map (from the WAI-ARIA Authoring Practices pattern)
- the component tokens (tier 3)
- the motion used

Both implementations must satisfy the same spec. A component is "done" for a phase only when **both** frameworks ship it. See [08](./08-parity.md).

## Glossary

| Term | Meaning |
|---|---|
| **Headless core** | Behaviour and a11y with no styles. React: hooks plus unstyled parts. Angular: directives. |
| **Styled skin** | The default look: one class per part, styled only with tokens. |
| **Part** | One element of a compound component, e.g. `Dialog.Title`. |
| **Reference token (tier 0)** | Raw value: a colour ramp step, a spacing unit. Never used by components directly. |
| **Semantic token (tier 1)** | Meaning-based token that themes swap, e.g. `--pada-color-fg-muted`. |
| **Derived token (tier 2)** | Computed from other tokens with `calc()` or `color-mix()`, e.g. hover colours. |
| **Component token (tier 3)** | Per-component variable, e.g. `--pada-button-bg`. Variants only reassign these. |
| **APG** | WAI-ARIA Authoring Practices Guide, the keyboard and role reference for each pattern. |

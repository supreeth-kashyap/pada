# Design System Blueprint

## Introduction

This document outlines the structure and purpose of our design system. The goal is to create a consistent, reusable, and maintainable set of components and styles for our applications. The longer-term plan is in [`docs/roadmap`](../../docs/roadmap/README.md).

## Token Pipeline

Every token is defined once, in `tokens/index.mjs`, and generated into CSS by `scripts/build-tokens.mjs` (`npm run build:tokens`). Tokens are layered in tiers:

| Tier | Prefix | Example | Role |
|---|---|---|---|
| 0 Reference | `--pada-ref-*` | `--pada-ref-indigo-500` | Raw ramps and scales. Components never read these. |
| 1 Semantic | `--pada-color-*`, `--pada-font-*` … | `--pada-color-fg-muted`, `--pada-color-danger-solid` | Meaning-based tokens. Light and dark values live in one `light-dark()` value. |
| 2 Derived | same | `--pada-color-accent-solid-hover`, `--pada-space-3` | Computed with `calc()` / `color-mix()` from tier 1 and the knobs. |
| 3 Component | `--pada-<component>-*` | `--pada-button-bg` | Declared at the top of each component's CSS; variants only reassign these. |

**Knobs** (`--pada-accent-hue`, `--pada-radius-base`, `--pada-density`, `--pada-type-base`, `--pada-type-ratio`, `--pada-motion-scale`, `--pada-contrast`) drive the derived tiers. **Theme axes** are HTML attributes that set knobs or palettes for a subtree: `data-theme`, `data-accent`, `data-neutral`, `data-density`, `data-radius`, `data-motion`, `data-contrast`.

Components use tier 1 to 3 tokens only. `npm test` fails when component CSS reads a custom property nothing defines, or when the generated CSS is stale.

## Folder Structure

-   `tokens/`: The token model.
    -   `index.mjs`: Every token, knob, palette, theme axis and the Pada 1.x aliases.
    -   `palette.mjs`: Reference colour ramps (Tailwind v3 palette).
    -   `legacy-names.json`: Every token name Pada 1.x defined; each one stays available as an alias.
-   `src/styles`:
    -   `tokens.generated.css`: Generated from `tokens/`; do not edit. Published as `pada-ds/tokens.css`.
    -   `base.css`: Optional `body`/`p` base styles, shipped separately as `pada-ds/base.css`.
-   `src/docs`: This file.
-   `src/demo`: The demo application for showcasing the design system.
-   `scripts`: Build, check and sync scripts (`build-tokens.mjs`, `check-tokens.mjs`, `sync-tokens-angular.mjs`, the manifest generator).

## Accessibility & Review Checklist

(Placeholder for accessibility guidelines and review checklists.)

# 07. Marketing site (`pada-site`)

The landing page, docs entry point and blog live in a **new, separate repo**: `supreeth-kashyap/pada-site`.

## 1. Stack

| Concern | Choice | Why |
|---|---|---|
| Framework | **Astro** | Content-first, ships zero JS by default, MDX built in, React islands where needed |
| Interactive parts | React islands using `pada-ds` itself | The site is the best demo of the system |
| Angular demos | Embedded StackBlitz projects | Real Angular code without a second framework in the site |
| Content | MDX with typed content collections | Blog, case studies, changelog |
| Styling | `pada-ds/tokens.css` plus site-only CSS | Dogfoods the token system |
| Search | Pagefind | Static, no service |
| Analytics | Plausible or similar, cookie-free | No consent banner needed |
| Hosting | Vercel or Netlify, preview deploy per PR | |
| OG images | Generated per page from the social card template | |

The component docs can stay in the existing demo app (`src/demo`) at first, linked from the site, and move into the site later.

## 2. Landing page structure

Visual direction: a dark, calm canvas (stone 950) with soft indigo and amber glows, generous whitespace, large type, real components rendered live rather than screenshots, and subtle motion that uses Pada's own tokens.

| # | Section | Content | Interaction |
|---|---|---|---|
| 1 | **Nav** | Mark, Docs, Components, Tokens, Blog, GitHub stars, theme toggle | Sticky, blurs on scroll |
| 2 | **Hero** | Headline, subhead, `npm i pada-ds` copy box, CTAs: *Get started*, *View on GitHub*, *Figma kit* | Animated mark "steps in"; floating cluster of live components behind the headline |
| 3 | **Framework switch** | "One system. React and Angular." Same component in both frameworks | Tabs switch the code; the rendered result stays identical |
| 4 | **Token playground** | "Five knobs. Every component." | Sliders for accent hue, radius, density, type ratio and motion; a bento grid of real components re-themes live; "Copy CSS" exports the overrides |
| 5 | **Headless or styled** | Side by side: the same Dialog with the Pada skin and with a custom skin | Toggle between them |
| 6 | **Component gallery** | Bento grid of key components (Dialog, Command palette, DataTable, DatePicker, Toast, Tabs) | Each tile is live and links to its docs |
| 7 | **Motion** | "Motion with footing." Short loops of the micro-animations | Replay buttons; a reduced-motion toggle shows the fallback |
| 8 | **Accessibility** | APG patterns, keyboard maps, axe-tested, reduced motion, high-contrast theme | Keyboard-only demo: "Try it with Tab" |
| 9 | **AI-agent ready** | `manifest.json`, `llms.txt`, `llms-full.txt`; typed props, component tokens and specs that agents can read | Shows a prompt and the generated, correct code |
| 10 | **Figma** | Community file, variables mapped to tokens | Link |
| 11 | **Comparison** | Pada vs. typical headless libraries vs. typical styled kits | Table |
| 12 | **Testimonials / used by** | Placeholder until there are real ones (do not invent quotes) | |
| 13 | **FAQ** | Licensing, browser support, SSR, theming, migration from 1.x | Accordion |
| 14 | **Final CTA** | Install snippet, *Read the docs* | |
| 15 | **Footer** | Docs, components, blog, changelog, GitHub, Figma, licence, the पाद story | |

## 3. Draft copy

### Headline options

1. **The foundation your product stands on.**
   Pada is a headless design system for React and Angular: accessible behaviour you can trust, a styled skin you can make your own.
2. **Every great interface stands on something.**
   Headless components, derived tokens and considered motion, for React and Angular.
3. **Steady footing for fast teams.**
   Start with Pada's look or bring your own. The behaviour, accessibility and keyboard handling are already done.

### Section copy

- **Framework switch:** *One system, two frameworks.* The same parts, the same keyboard maps, the same tokens. Your React and Angular teams finally ship the same product.
- **Token playground:** *Five knobs. Every component.* Change the accent hue, radius, density, type scale or motion, and watch hundreds of derived tokens follow. No overrides, no forks.
- **Headless or styled:** *Use our skin, or your own.* Every component is a headless core with an optional styled layer. Take the behaviour and leave the look, or take both and re-theme it in minutes.
- **Motion:** *Motion with footing.* Quick, settled, purposeful animation built on tokens, and it switches off when your users ask it to.
- **Accessibility:** *Accessible by default, not by checklist.* Every component follows the WAI-ARIA Authoring Practices, ships its keyboard map, and is tested with axe in every state.
- **AI-agent ready:** *Built for the way you build now.* Pada ships a machine-readable manifest of every component, prop and token, so coding agents write correct Pada code the first time.
- **The name:** *pāda, पाद: Sanskrit for foot.* The part that carries the weight and meets the ground. That is what a design system should do for your product.

## 4. Blog

Content strategy will be planned separately. This section only sets up the structure.

### Categories

- **Engineering:** how Pada is built (headless core, tokens pipeline, testing)
- **Design:** tokens, motion, accessibility, the brand
- **Guides:** how-tos for teams adopting Pada
- **Releases:** release notes and migration guides
- **Stories:** case studies, community

### Frontmatter schema

```yaml
title: string
description: string          # used for meta and OG
date: 2026-11-01
updated: 2026-11-10          # optional
authors: [supreeth]
category: engineering | design | guides | releases | stories
tags: [tokens, angular]
cover: ./cover.png           # optional; otherwise generated OG image
draft: false
```

### Seed backlog (titles only)

1. Why we rebuilt Pada as a headless design system
2. Five knobs: how derived tokens let one change re-theme everything
3. One spec, two frameworks: keeping React and Angular at parity
4. Motion with footing: the principles behind Pada's micro-animations
5. `@starting-style` and `allow-discrete`: exit animations without JavaScript
6. Designing the Pada mark: from two soles to a foundation
7. Making design systems readable by AI coding agents with `llms.txt` and a manifest
8. Angular signals and CDK as a headless foundation
9. Migrating from Pada 1.x to 2.0
10. OKLCH colour ramps for accessible themes

## 5. Repo setup

```
pada-site/
├── src/
│   ├── pages/            index.astro, blog/[...slug].astro, brand.astro
│   ├── content/blog/     *.mdx
│   ├── components/       site-only Astro components
│   └── islands/          React islands (playground, gallery, framework switch)
├── public/               favicon, OG templates, brand downloads
└── astro.config.mjs
```

- `pada-ds` is a normal npm dependency, so the site always shows a published version.
- A "canary" preview deploy builds against `pada-ds@next` to catch regressions before release.
- Lighthouse budget in CI: performance ≥ 95, accessibility 100.

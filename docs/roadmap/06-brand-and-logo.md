# 06. Brand and logo

## 1. The idea

**pāda** (पाद) is Sanskrit for *foot*. A foot is the part of the body that **carries weight** and **meets the ground**: the foundation everything else stands on. In Sanskrit verse a *pāda* is also a quarter-verse, one measured part of a whole: a building block.

Both meanings describe a design system: a stable base that carries a product, made of measured parts.

**Brand attributes:** grounded, dependable, quietly confident, precise, warm.

## 2. Starting point

The current mark (`src/components/Sidebar/assets/pada-logo-mark.svg`) is two mirrored shapes, amber on the left and indigo on the right, wide at the top and tapering to a rounded point at the bottom, with a narrow gap between them. Seen from above, the pair already reads as **two soles side by side**. The redesign should build on that recognition rather than discard it.

What to improve:

- The shapes taper to a point at the bottom, so the mark looks like it is balancing rather than standing. A foundation should sit **flat on a baseline**.
- The two halves read as a "V" or open book at small sizes.
- There is no wordmark beyond "Pada . design" in grey, no favicon (the site uses `vite.svg`), and no motion version.

## 3. Concepts

These are briefs for a designer (or a first SVG pass), not finished art.

### A. Twin Soles (recommended)

- Two abstract soles, mirrored, standing on a **shared flat baseline**: broad at the ball of the foot, a slight waist at the arch, a rounded heel resting on the line.
- The negative space between them forms a narrow **upward pillar**: the thing being carried.
- Keep the two-colour split (amber left, indigo right) as the default, with an all-indigo and a monochrome version.
- Optional detail: a single toe dot above each sole, used only at large sizes.
- **Why:** continuity with the current mark, reads as feet at every size, and the baseline makes "foundation" literal.

### B. Footing

- Two simplified feet seen from the side, standing on a thick ground line.
- The space under the arches and between the feet forms a lowercase **"p"**.
- **Why:** stronger letter link to the name, works as a monogram. **Risk:** more detail, weaker at 16px.

### C. Stride

- Two footprints offset vertically, one a step ahead of the other, inside a rounded square.
- Suggests progress, one step at a time (matches the Steps and versioning story).
- **Why:** energetic and distinctive. **Risk:** suggests movement more than stability.

### D. पाद monogram

- The Devanagari word पाद set in a custom geometric style, with the vertical stroke of प turned into a foot shape standing on the shirorekha (headline) reversed into a baseline.
- **Why:** honours the origin; distinctive in a crowded market. **Risk:** less legible to an international audience; best as a secondary mark.

**Recommendation:** concept A as the primary mark, with D as a secondary "heritage" mark for the about page, merchandise and conference material.

## 4. Wordmark

- Lowercase **"pada"**, geometric sans, slightly wide, medium weight.
- The two "a"s are single-storey and match the round heel of the soles.
- The "p" descender is shortened so the word sits on the same baseline as the mark.
- The ".design" suffix is dropped from the primary lockup; the domain is used only in URLs.

## 5. Brand kit deliverables

| Asset | Formats | Notes |
|---|---|---|
| Mark | SVG (colour, mono, inverse), PNG @1x/2x/3x | `currentColor` version for the component |
| Wordmark | SVG | Outlined paths, no font dependency |
| Lockups | Horizontal, stacked | Mark height = cap height × 1.6 |
| Favicon / app icon | SVG favicon with dark-mode media query, ICO 32px, PNG 180/192/512, maskable | Replaces `vite.svg`; also fix the "myapp" page title |
| Social card | 1200×630 template | For the site and blog posts |
| Animated mark | Lottie or CSS/SVG | "Steps in": the left sole drops onto the baseline, then the right, then the baseline draws out; ~900ms, plays once. Static under reduced motion |
| Loader variant | CSS/SVG | Soles alternate lifting, as a branded alternative to `Spinner` |
| Rules | One page | Clear space = width of one sole; minimum size 16px (mark), 64px (lockup); don't rotate, recolour outside the palette, or add effects |

## 6. Brand colours

- **Primary:** indigo (accent hue 277 in OKLCH), the default `data-accent`.
- **Secondary:** amber, for the left sole and warm highlights.
- **Neutral:** stone, matching today's neutral scale.
- The marketing site may use a darker, richer canvas (near-black stone with subtle indigo glow) while the components keep their product palette.

## 7. Product changes

- New **`PadaLogo`** component (mark, wordmark, lockup; `variant`, `size`, `animated`), exported from both packages.
- The existing `Logo` component (third-party brand logos) is renamed to **`BrandLogo`**, with `Logo` kept as a deprecated alias in 2.x.
- `SidebarLogo` defaults to the new `PadaLogo`.
- Figma: brand page with the mark, lockups and rules.

## 8. As built (React)

**`PadaLogo`** (`src/components/PadaLogo`) implements concept A in code: two mirrored soles on a shared ground bar.
- Variants: `mark`, `wordmark` and `lockup`.
- `tone`:
  - `color`: amber left sole, accent right sole, so it follows `data-accent`.
  - `accent`.
  - `mono` (`currentColor`).
- `size`: `sm` to `xl`, or a pixel height. Toes appear from 48px up.
- `animated`: steps in once; `animated="loop"` is the branded loader, with `role="status"`.
- It is an image named "Pada" unless `decorative`.
- The wordmark is drawn with strokes, so it needs no font.

Product changes:
- `Logo` is now `BrandLogo`, with the old name kept as a deprecated alias.
- `SidebarLogo` defaults to the lockup.
- The demo has `public/favicon.svg`, whose ground bar adapts to dark mode, the title "Pada Design System" and a Foundation → Brand page.

**Not done yet:**
- PNG and ICO exports and maskable icons.
- The social card.
- The stacked lockup.
- The पाद heritage mark.
- The rules page and Figma.
- The Angular `PadaLogo`.

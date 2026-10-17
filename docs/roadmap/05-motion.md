# 05. Motion

Motion in Pada should feel **grounded**: quick, settled and never bouncy for its own sake. Like a foot finding its footing, things arrive, settle and stay put.

## 1. Principles

1. **Purposeful.** Motion explains a change: where something came from, where it went, what state it is in. No decorative loops.
2. **Fast.** Most micro-interactions are 120 to 200ms. Nothing in a component exceeds 480ms.
3. **Origin-aware.** Overlays grow from their trigger (`transform-origin` follows `data-side`).
4. **Interruptible.** Use CSS transitions (which reverse mid-flight) over keyframe animations for state changes.
5. **Cheap.** Animate `transform` and `opacity`. Height uses `interpolate-size` or the grid `0fr → 1fr` technique, never measured JS heights.
6. **Optional.** Every duration is multiplied by `--pada-motion-scale`. Reduced motion sets it to `0`, and anything with travel (slides, shakes, staggers) falls back to a plain fade or nothing.

## 2. Motion tokens

### Durations

| Token | Value | Used for |
|---|---|---|
| `--pada-duration-instant` | 50ms | Colour changes on press |
| `--pada-duration-fast` | 120ms | Hover, focus ring, tooltips, small icons |
| `--pada-duration-normal` | 200ms | Popovers, menus, toggles, tabs indicator |
| `--pada-duration-slow` | 320ms | Dialogs, drawers, accordions |
| `--pada-duration-slower` | 480ms | Toast stack, page-level transitions |

Each one is `calc(<ms> * var(--pada-motion-scale))`.

### Easings

| Token | Value | Used for |
|---|---|---|
| `--pada-ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` | Most state changes |
| `--pada-ease-enter` | `cubic-bezier(0, 0, 0.2, 1)` | Things appearing (decelerate) |
| `--pada-ease-exit` | `cubic-bezier(0.4, 0, 1, 1)` | Things leaving (accelerate) |
| `--pada-ease-emphasized` | `cubic-bezier(0.22, 1, 0.36, 1)` | Dialogs, drawers, indicators |
| `--pada-ease-spring` | `linear(0, 0.5 7%, 0.94 19%, 1.04 27%, 1.01 36%, 1)` | Small physical motion: switch thumb, radio dot, check |

### Distances and scales

| Token | Value |
|---|---|
| `--pada-motion-distance-sm` | 4px |
| `--pada-motion-distance-md` | 8px |
| `--pada-motion-scale-enter` | 0.96 |
| `--pada-motion-scale-press` | 0.97 |

### Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  :root:not([data-motion="full"]) { --pada-motion-scale: 0; }
}
[data-motion="reduced"] { --pada-motion-scale: 0; }
```

Components with travel also check `@media (prefers-reduced-motion: reduce)` (or `[data-motion="reduced"]`) to drop the transform and keep only opacity.

## 3. Techniques

| Need | Technique | Fallback |
|---|---|---|
| Overlay enter/exit (Dialog, Popover, Menu, Tooltip) | CSS `@starting-style` + `transition-behavior: allow-discrete` on `display` / `overlay`, keyed by `data-state` | `usePresence` (React) / `animate.leave` (Angular) keeps the element mounted until `transitionend` |
| Height (Accordion, Collapsible) | `interpolate-size: allow-keywords` with `height: auto` | `display: grid; grid-template-rows: 0fr → 1fr` |
| Sliding indicators (Tabs, SegmentControl, Pills) | Indicator element positioned with `--pada-indicator-x/width` set by the core | CSS anchor positioning when it reaches Baseline |
| List reorder | FLIP (measure, invert, play) in the core | Instant reorder |
| Theme switch | View Transitions API circular reveal from the toggle | Instant swap |
| Angular enter/leave | Native `animate.enter` / `animate.leave` (Angular 20.2+) with the same CSS classes; **not** the deprecated `@angular/animations` | n/a |

## 4. Micro-animation catalogue

| Component | Interaction | Animation | Tokens |
|---|---|---|---|
| **Button** | Press | Scale to 0.97, back on release | instant, standard |
| | Loading | Label fades out, spinner fades in, width kept | fast |
| | Trailing arrow icon | Nudges 2px right on hover | fast, standard |
| **IconButton** | Hover | Background circle grows from 0.8 to 1 | fast |
| **Checkbox** | Check | Check mark path draws in (`stroke-dashoffset`) | normal, spring |
| | Indeterminate | Bar scales in from centre | fast |
| **Radio** | Select | Dot scales from 0 with spring | normal, spring |
| **Switch** | Toggle | Thumb slides with spring; track colour crossfades | normal, spring |
| | Press | Thumb stretches 4px towards travel direction | fast |
| **Input / Field** | Focus | Focus ring grows from 0 to its width | fast |
| | Error | 2px horizontal shake, 3 cycles (none under reduced motion); error text slides down 4px and fades in | normal |
| | Clear button | Fades and scales in when there is a value | fast |
| **Tabs** | Change | Indicator slides and resizes to the new tab; panel crossfades | normal, emphasized |
| **SegmentControl / Pills / ToggleGroup** | Change | Thumb slides to the selected item | normal, emphasized |
| **Accordion / Collapsible** | Open/close | Height animates; chevron rotates 180° | slow, emphasized |
| **Dialog** | Open | Overlay fades in; content scales 0.96 → 1 and fades | slow, emphasized / enter |
| | Close | Reverse, faster | normal, exit |
| **AlertDialog** | Open | As Dialog | |
| **Drawer / Sheet** | Open | Slides in from its side; overlay fades | slow, emphasized |
| | Drag (Sheet) | Follows the pointer, settles with spring | spring |
| **Popover / DropdownMenu / HoverCard** | Open | Scales 0.96 → 1 and fades, from the trigger side | normal, enter |
| | Submenu | Slides 4px from the parent side | fast |
| **Tooltip** | Open | Fades and moves 4px from the trigger side after a delay; instant when moving between tooltips (shared delay group) | fast |
| **Select / Combobox** | Open | As Popover; first 6 items stagger by 15ms (capped) | normal |
| | Highlight | Highlight background slides between items | fast |
| **Toast** | Enter | Slides in from the edge and fades | slow, emphasized |
| | Stack | Toasts stack with scale and offset; expand on hover or focus | normal |
| | Dismiss | Swipe follows the pointer, past a threshold it flies out | spring |
| | Timer | Thin bar shrinks over the toast's duration; pauses on hover | linear |
| **Progress** | Value change | Width transitions | normal |
| | Indeterminate | Bar sweeps | linear, 1.2s loop |
| **ProgressCircle** | Value change | Stroke dash transitions | normal |
| **Skeleton** | Loading | Shimmer gradient sweep (static under reduced motion) | 1.5s loop |
| **Spinner** | Loading | Rotation; under reduced motion becomes a slow opacity pulse | |
| **Steps** | Complete step | Connector fills; check draws in | slow |
| **Tag** | Remove | Scales to 0.9 and fades, then width collapses | fast then normal |
| **Badge** | Count change | Bumps to 1.15 and back | fast, spring |
| **List** | Reorder | Items move with FLIP; dragged item lifts (shadow and scale 1.02) | normal, emphasized |
| **Table** | Sort | Sort icon flips; rows fade in | fast |
| | Row expand | Height animates as Collapsible | slow |
| **Carousel** | Slide change | Scroll-snap smooth scrolling; active dot widens | slow, emphasized |
| **CodeSnippet** | Copy | Copy icon morphs into a check, back after 1.5s | fast |
| **UploadField** | Drag over | Dropzone border pulses and the background tints | normal |
| | Upload success | Check draws in; progress fades out | normal |
| **Sidebar** | Collapse | Width animates; labels fade out before the width shrinks | slow |
| **Stat** | Value change | Number ticks up to the new value | slower |
| **ThemeToggle** | Switch | Circular View Transition reveal from the toggle; icon rotates sun ↔ moon | slower |
| **Avatar** | Image load | Image fades in over the fallback | fast |
| **Link** | Hover | Underline grows from left | fast |

## 5. Implementation notes

- Motion styles live in the styled skin, never in the headless core. The core only provides `data-state`, `data-side` and the indicator position variables.
- Each component's spec lists the motion it uses, and the docs page shows it with a "replay" control.
- A Playwright test runs every component with `prefers-reduced-motion: reduce` and checks that computed `transition-duration` is `0s` and no `transform` animation runs.

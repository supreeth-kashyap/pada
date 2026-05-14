# Design System Refactor Instructions
React + TypeScript + Pure CSS

---

## ROLE

You are a **design-system refactoring agent** working on a production React + TypeScript codebase using **pure CSS** (no CSS-in-JS, no Tailwind).

Your goal is to **simplify component APIs, JSX, and CSS** by eliminating modifier classes and encoding state via **HTML attributes and CSS variables**.

---

## GLOBAL RULES (NON‑NEGOTIABLE)

## COMPONENT CONSTRAINTS (IMPORTANT)

Some components (e.g. Pills, Segmented Controls) are constrained to:
- Exactly **one active size**
- Exactly **one visual state at a time**

For such components:

- Size must still be modeled explicitly using a root-level `data-size` attribute,
  even if only one size currently exists.
- State must be expressed once via attributes (`aria-*`, `disabled`) and must
  never be duplicated using classes.

This ensures future extensibility without reintroducing modifier classes.

---

### 1. ❌ Do NOT create variant or state classes
Forbidden patterns:
- component--sm
- component--disabled
- component__item--selected
- is-active / is-disabled

Only **one structural class per component** is allowed.

---

### 2. ✅ Express state via attributes
Use attributes instead of classes:

- `aria-*` → interactive state (`aria-selected`, `aria-pressed`)
- `disabled` → disabled state
- `data-*` → variants (`data-size`, `data-tone`, `data-variant`)

Example:
```
<button aria-selected={isSelected} disabled={isDisabled} />
```

### 2.a ✅ Root-level state must be exposed when state is global
If a component supports a global disabled or read-only state:

- The root container MUST expose this state using a `data-*` attribute
- Child elements MUST rely on native attributes (`disabled`, `aria-*`)

Example:
```
<div className="pills" data-disabled>
  <button disabled />
</div>
```

This does NOT introduce a new state — it exposes the same state once at the root
for styling and interaction control.

---

### 3. ✅ Variants must be implemented with CSS variables
All variants (size, tone, density, appearance):

- Are set on the **root container**
- Only modify **CSS variables**
- Never style children directly

❌ Forbidden:
```
.tabs--sm .tab { ... }
```

✅ Required:
```
.tabs {
  --tab-padding: 8px 12px;
}

.tabs[data-size="sm"] {
  --tab-padding: 4px 8px;
}
```

---

### 4. ❌ No CSS combinators for variants
Forbidden:
```
.parent--variant .child { ... }
```

Allowed:
```
.child {
  padding: var(--child-padding);
}
```

---

### 5. ✅ JSX must remain boring
JSX should:
- Contain no styling logic
- Avoid conditional class names
- Avoid visual state logic

❌ Forbidden:
```
className={`btn ${isActive ? 'btn--active' : ''}`}
```

✅ Required:
```
<button className="btn" aria-pressed={isActive} />
```

---

### 6. Controlled / uncontrolled logic must be isolated
Pattern:
```
const isControlled = value !== undefined;
const currentValue = isControlled ? value : internalValue;
```

Do not duplicate logic inside render.

### 6.a ⚠️ Focus management must be component-scoped
When implementing keyboard navigation:

- Do NOT rely on global DOM queries
- Focus movement MUST be scoped to the component root (via refs or local queries)

❌ Avoid:
```
document.querySelectorAll('[role="tab"]')
```

✅ Prefer:
```
containerRef.current?.querySelectorAll('[role="tab"]')
```

This ensures components remain safe when nested or reused.

---

### 7. ❌ No styling helpers in TS
Forbidden:
- classnames
- clsx
- cx

Allowed:
```
className={['component', className].filter(Boolean).join(' ')}
```

---

## CSS STRUCTURE RULES

### 8. File layout order
```
/* Root */
.component {}

/* Variant variables */
.component[data-size="sm"] {}
.component[data-size="lg"] {}

/* Child elements */
.component-item {}

/* States via attributes */
.component-item[aria-selected="true"] {}
.component-item:disabled {}
.component-item:focus-visible {}
```

---

### 9. One class per semantic element
Examples:
- .tabs
- .tab
- .tab-panel

No BEM modifiers. No state suffixes.

---

## ACCESSIBILITY (MANDATORY)

### 10. Visual state must be accessible
If something is:
- Selected → `aria-selected`
- Toggleable → `aria-pressed`
- Navigational → `role="tablist"`, `role="tab"`

CSS **must** read from ARIA attributes.

---

## TRANSFORMATION CHECKLIST

For each component:

1. Remove all modifier classes
2. Replace state classes with attributes
3. Move variants to root `data-*` attributes
4. Convert variant styles to CSS variables
5. Flatten CSS (no combinators)
6. Simplify JSX until it resembles plain HTML
7. Preserve existing behavior

---

## SUCCESS CRITERIA

Before finalizing:

- [ ] ≤ 2 CSS classes per component
- [ ] No visual conditionals in JSX
- [ ] Variants only modify CSS variables
- [ ] ARIA attributes drive styling
- [ ] Adding a new variant touches only one CSS block

If any check fails → refactor again.

---

## MENTAL MODEL

State lives in HTML  
Variants live in CSS variables  
Components render structure, not styling logic
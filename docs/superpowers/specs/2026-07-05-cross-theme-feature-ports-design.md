# Cross-Theme Feature Ports — Design Doc

## Goal
Port standout features from Capital and Impact themes into PHANTOM (Impulse-based) and PHANTOM Luxe (Prestige-based) without breaking existing functionality.

## Strategy
- **Capital (Eight) → PHANTOM (Impulse/Archetype)** — feature-level ports adapted to PHANTOM's architecture
- **Impact (Maestrooo) → PHANTOM Luxe (Prestige/Maestrooo)** — near-drop-in ports (same architecture)
- Skip features already present in the target theme

## Phase 1 — Small Wins

### 1a. Scrolling Banner with Images → PHANTOM
**Source:** Capital's `scrolling-banner.liquid` + `scrolling-banner-component.js`
**Target:** PHANTOM theme (new section, replacing/extending text-only scrolling-text)
**Approach:**
- Create new `scrolling-banner.liquid` section with text, image, and icon blocks
- Use pure CSS animation (PHANTOM already has CSS marquee via `scrolling-text`). No JS dependency — the Capital JS component only handles keyboard focus on duplicated links, which is trivial
- Adapt to PHANTOM's CSS class conventions
- **Files to create:** `sections/scrolling-banner.liquid`
- **Files to modify:** none

### 1b. Revealed Image on Scroll → PHANTOM Luxe
**Source:** Impact's `revealed-image-on-scroll.liquid` + `<revealed-image>` custom element in `theme.js`
**Target:** PHANTOM Luxe theme
**Approach:**
- Create section (drop-in of Impact's Liquid — same Maestrooo patterns like `surface` snippet, `bg-custom`, `prose`)
- Rewrite JS component using native Intersection Observer + Luxe's existing animation patterns (avoid Motion One dependency from Impact)
- Add CSS to Luxe's `theme.css`
- **Files to create:** `sections/revealed-image-on-scroll.liquid`
- **Files to modify:** `assets/theme.js` (add custom element), `assets/theme.css` (add styles)

## Phase 2 — Differentiators

### 2a. Offers Drawer → PHANTOM
**Source:** Capital's `offers-drawer.liquid` + `sticky-offers-button.liquid` + JS components
**Target:** PHANTOM theme
**Approach:**
- Port as two new sections
- Adapt from Capital's `wetheme` patterns to PHANTOM's patterns
- Use PHANTOM's existing drawer/modal infrastructure if available

### 2b. Product Recommendation Quiz → PHANTOM
**Source:** Capital's `quiz.liquid` + `quiz-product-card.liquid` + `quiz-component.js` + `quiz-modal-component.js`
**Target:** PHANTOM theme
**Approach:**
- Create section + snippet + JS assets
- Quiz engine with multi-step questions, image options, product filtering

## Phase 3 — Nice-to-Have

### 3a. Hot Spots → PHANTOM Luxe
**Source:** Impact's `hot-spots.liquid` + custom element in `theme.js`
**Target:** PHANTOM Luxe

### 3b. Comparison Table → PHANTOM Luxe
**Source:** Impact's `comparison-table.liquid` section
**Target:** PHANTOM Luxe

## Files Map

### PHANTOM theme (new/changed)
```
sections/
  scrolling-banner.liquid       [NEW] — Phase 1a
  offers-drawer.liquid           [NEW] — Phase 2a
  sticky-offers-button.liquid    [NEW] — Phase 2a
  quiz.liquid                    [NEW] — Phase 2b
snippets/
  quiz-product-card.liquid       [NEW] — Phase 2b
assets/
  quiz-component.js              [NEW] — Phase 2b
  quiz-modal-component.js        [NEW] — Phase 2b
  offers-drawer-component.js     [NEW] — Phase 2a
  sticky-offers-button-component.js [NEW] — Phase 2a
```

### PHANTOM Luxe theme (new/changed)
```
sections/
  revealed-image-on-scroll.liquid  [NEW] — Phase 1b
  hot-spots.liquid                 [NEW] — Phase 3a
  comparison-table.liquid          [NEW] — Phase 3b
assets/
  theme.js                         [MODIFY] — add custom elements
  theme.css                        [MODIFY] — add styles
```

## Verification
- Each section must render in Customizer without Liquid errors
- Each section must appear in section picker
- No console errors in JS
- Zero references to source theme author names (Eight, Archetype, Maestrooo, wetheme)

# PHANTOM Motion System — Phase 3 Design Spec

**Date:** 2026-07-07
**Theme:** PHANTOM v2.2.0 (rebranded Impulse v8.2.0)
**Status:** Approved design

---

## Problem

Two gaps in the existing PHANTOM Motion System:

1. **`ph_motion_entrance_speed` is non-functional** — The theme setting (range 0.3–1.5, default 0.7) is defined in `settings_schema.json`, persisted in `settings_data.json`, and exposed in `window.phMotionSettings.entranceSpeed` — but the CSS hardcodes `transition-duration: 0.7s` and never reads the value. Users who change this setting see no effect.

2. **No stagger delays for grid sections** — Multi-item sections (featured-collection, blog-posts, product-recommendations, etc.) animate all items simultaneously. There is no cascading entrance effect, making the animations feel flat compared to the per-item staggered patterns common in premium themes.

---

## Scope

- Wire `entranceSpeed` to actually control animation duration
- Add a stagger delay system for grid-based sections
- Add two new theme settings to enable/control stagger
- No new assets, no section schema changes, no skeleton changes

---

## 1. Fix `entranceSpeed`

### Mechanism

CSS custom property set by the JS bridge at runtime. The CSS uses `var()` fallback so the system degrades gracefully even if JS fails.

### Changes

**`assets/ph-motion.css.liquid`** (line 27):
```css
/* Before */
transition-duration: 0.7s;

/* After */
transition-duration: var(--ph-duration, 0.7s);
```

This single change covers all 6 animation types (ph-fade-up, ph-scale-in, ph-blur-in, ph-slide-left, ph-slide-right, ph-rotate-in) because they all share the base `[data-aos^="ph-"]` rule on line 24-31.

**`assets/ph-motion.js.liquid`** (in the IIFE, after guard checks):
```javascript
var speed = (window.phMotionSettings || {}).entranceSpeed;
if (speed && typeof speed === 'number') {
  document.documentElement.style.setProperty('--ph-duration', speed + 's');
}
```

### Constraint

The speed value is a number (e.g., 0.7). The JS appends `'s'` to produce a valid CSS duration value (e.g., `'0.7s'`). The `settings_schema.json` defines the range as 0.3–1.5 with step 0.1, default 0.7 — all valid CSS duration values.

---

## 2. Stagger Delay System

### Mechanism

The JS bridge auto-detects grid containers and applies `data-aos-delay` attributes to child items based on their position. AOS's built-in delay system respects `data-aos-delay` natively. The existing CSS stagger helper classes (`[data-aos-delay="100"]` through `[data-aos-delay="600"]`) work without modification.

### New Theme Settings

Two settings added to `settings_schema.json` in the existing `ph_motion` settings group:

```json
{
  "type": "checkbox",
  "id": "ph_motion_stagger_enable",
  "label": "t:settings_schema.ph_motion.settings.ph_motion_stagger_enable.label",
  "default": true
},
{
  "type": "range",
  "id": "ph_motion_stagger_amount",
  "label": "t:settings_schema.ph_motion.settings.ph_motion_stagger_amount.label",
  "default": 100,
  "min": 50,
  "max": 300,
  "step": 10,
  "unit": "ms"
}
```

### Theme.liquid Addition

Insert `staggerEnabled` and `staggerAmount` into `window.phMotionSettings` in `layout/theme.liquid` (line 324, after `entranceDefault`):

```javascript
window.phMotionSettings = {
  entranceSpeed: {{ settings.ph_motion_entrance_speed | default: 0.7 }},
  entranceDefault: "{{ settings.ph_motion_entrance_default | default: 'ph-fade-up' }}",
  staggerEnabled: {{ settings.ph_motion_stagger_enable | default: true }},
  staggerAmount: {{ settings.ph_motion_stagger_amount | default: 100 }},
  viewTransitionsEnabled: {{ settings.ph_motion_viewtransitions_enable | default: false }},
  skeletonsEnabled: {{ settings.ph_motion_skeletons_enable | default: false }}
};
```

### JS Bridge Logic

Added to `ph-motion.js.liquid` (inside the IIFE):

```javascript
var settings = window.phMotionSettings || {};
var staggerEnabled = settings.staggerEnabled;
var staggerAmount = settings.staggerAmount || 100;

var applyStagger = function() {
  if (!staggerEnabled) return;
  var containers = document.querySelectorAll('.grid, .grid--uniform, .grid-overflow-wrapper');
  for (var c = 0; c < containers.length; c++) {
    var items = containers[c].querySelectorAll('.grid__item[data-aos^="ph-"]');
    if (items.length < 2) continue;
    for (var i = 0; i < items.length; i++) {
      if (items[i].hasAttribute('data-aos-delay')) continue;
      var delay = Math.min(i * staggerAmount, 600);
      items[i].setAttribute('data-aos-delay', delay.toString());
    }
  }
};
```

Called on init and inside the debounced MutationObserver callback.

### Sections Affected (auto-detected)

The stagger applies to `.grid__item` elements with `data-aos^="ph-"` inside standard Impulse grid containers:
- `.grid`, `.grid--uniform`, `.grid-overflow-wrapper`

This covers: featured-collection, blog-posts, product-recommendations, recently-viewed, featured-collections, testimonials, text-columns, logo-list, map, footer-promotions, background-image-text, background-video-text, text-and-image, hero-video.

No schema changes needed per section — the stagger is purely runtime JS.

### Constraint

- Sequential stagger (index × staggerAmount): no per-row computation needed — simpler and works across all grid layouts
- Delay cap at 600ms matches the existing CSS helper classes (`data-aos-delay="100"` through `data-aos-delay="600"`)
- Items with a manual `data-aos-delay` already set in Liquid are skipped via `hasAttribute()` guard
- Only `.grid__item` elements are targeted — avoids applying stagger to nested child elements inside grid cards
- Reduced motion guard at the top of the IIFE prevents all animation if `prefers-reduced-motion: reduce`

---

## 3. Locales

### New Locale Keys

Added to all 6 locale schema files (`en.default.schema.json`, `de.schema.json`, `es.schema.json`, `fr.schema.json`, `it.schema.json`):

```json
"ph_motion_stagger_enable": {
  "label": "Enable stagger delays",
  "info": "When enabled, grid items animate in sequence rather than all at once."
},
"ph_motion_stagger_amount": {
  "label": "Stagger delay amount",
  "info": "Milliseconds between each item's animation start."
}
```

For non-English locales, the label/info use English as a placeholder (consistent with existing locale pattern where translations may be incomplete).

---

## Success Criteria

- Changing `ph_motion_entrance_speed` in theme editor changes actual animation speed in the browser
- Grid sections show cascading entrance animations when `ph_motion_stagger_enable = true`
- Setting `ph_motion_stagger_enable = false` removes all stagger delays
- Changing `ph_motion_stagger_amount` changes the inter-item delay
- `prefers-reduced-motion: reduce` disables all animations (both speed and stagger)
- No console errors from new JS code
- No breaking changes to existing entrance_animation behavior
- Settings that have `entrance_animation = "existing"` still fall back to the global default via JS bridge

---

## Non-Goals

- Adding entrance_animation to additional sections (that's a separate phase)
- CSS easing curve changes (keeping `cubic-bezier(0.25, 0.46, 0.45, 0.94)`)
- Parallax, hover effects, custom cursor, or other advanced interactions
- Per-section speed overrides (global only)
- Stagger for non-grid sections (single-item sections like rich-text, text-with-icons only have one `data-aos` element)

---

## File Manifest

### Edit (6 files)

| # | File | Changes |
|---|------|---------|
| 1 | `assets/ph-motion.css.liquid` | 1 line: hardcoded `0.7s` → `var(--ph-duration, 0.7s)` |
| 2 | `assets/ph-motion.js.liquid` | Add speed→CSS var + stagger computation + re-run on mutation |
| 3 | `config/settings_schema.json` | Add 2 settings (stagger_enable, stagger_amount) |
| 4 | `layout/theme.liquid` | Add 2 stagger settings to phMotionSettings |
| 5 | `locales/*.schema.json` (×6) | Add locale entries for 2 new settings |

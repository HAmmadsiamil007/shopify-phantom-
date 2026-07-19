# PHANTOM Motion System — Phase 2 Design Spec

**Date:** 2026-07-07
**Theme:** PHANTOM v2.2.0 (rebranded Impulse v8.2.0)
**Status:** Approved design · Pending implementation

---

## Architecture

PHANTOM Motion System v2 modular file layout:

```
assets/
├── ph-motion.css.liquid       (Layer 1 — CSS transitions)       ✅ exists
├── ph-skeleton.css            (Layer 2 — skeleton loaders)       ✅ exists
├── ph-transitions.css.liquid  (Layer 2 — view transitions CSS)  ✅ exists
├── ph-transitions.js          (Layer 2 — view transitions JS)    ✅ exists
└── ph-motion.js.liquid        (Phase 2 — JS bridge: NEW)         ❌ create

snippets/
├── ph-skeleton-product.liquid  ✅ exists
├── ph-skeleton-image.liquid    ✅ exists
├── ph-skeleton-section.liquid  ✅ exists
├── ph-skeleton-text.liquid     ✅ exists

sections/ (7 to edit + 1 for skeletons)
layout/
├── theme.liquid (wire new assets)                               ❌ edit
config/
├── settings_schema.json                                         ✅ done (Phase 1)
├── settings_data.json                                           ✅ done (Phase 1)
```

---

## 1. Add `entrance_animation` to 7 Sections

Each section receives a standard `entrance_animation` select setting following the identical pattern used in the 13 existing sections (e.g., featured-collection, blog-posts).

### Pattern

**Schema block** (inserted into `settings` array):

```liquid
{
  "type": "select",
  "id": "entrance_animation",
  "label": "t:sections.common.settings.entrance_animation.label",
  "default": "ph-fade-up",
  "options": [
    { "value": "existing", "label": "t:sections.common.settings.entrance_animation.options.existing.label" },
    { "value": "ph-fade-up", "label": "ph-fade-up" },
    { "value": "ph-scale-in", "label": "ph-scale-in" },
    { "value": "ph-blur-in", "label": "ph-blur-in" },
    { "value": "ph-slide-left", "label": "ph-slide-left" },
    { "value": "ph-slide-right", "label": "ph-slide-right" },
    { "value": "ph-rotate-in", "label": "ph-rotate-in" }
  ]
}
```

**data-aos attribute** (added to the section/block wrapper):

```liquid
data-aos="{% if section.settings.entrance_animation and section.settings.entrance_animation != 'existing' %}{{ section.settings.entrance_animation }}{% else %}<existing-class>{% endif %}"
```

### Per-section Details

| # | Section File | Wrapper Element | Fallback Class | Notes |
|---|-------------|----------------|---------------|-------|
| 1 | `slideshow.liquid` | `<div class="slideshow-wrapper">` (line ~37) | `slideshow__animation` | Entrance animation on outer wrapper only, NOT on individual slides (slider has own transition system) |
| 2 | `featured-collections.liquid` (plural) | `<div class="grid grid--uniform">` or outer section wrapper | `overflow__animation` | Grid container for collection items. Note: `featured-collection.liquid` (singular) already has entrance_animation — do not re-add. |
| 3 | `featured-product.liquid` | Outer section wrapper (delegates to `product-template` snippet) | `overflow__animation` | Block-based section that renders via `product-template` snippet. Add data-aos to the `section--divider` wrapper (line 1) or wrap content in a `<div>` with data-aos. |
| 4 | `media-text.liquid` | `<div class="media-text__wrapper">` | `overflow__animation` | Image + text side-by-side |
| 5 | `text-with-icons.liquid` | Outer section wrapper | `overflow__animation` | Icon/text grid items |
| 6 | `promo-grid.liquid` | Outer promo wrapper | `overflow__animation` | Grid of promo items |
| 7 | `rich-text.liquid` | Outer section wrapper | `overflow__animation` | Simple text content |

### Constraint

- The fallback CSS animation class (`overflow__animation`, `slideshow__animation`, etc.) must continue to work so that when `entrance_animation = "existing"`, the original Impulse animation plays.

---

## 2. JS Bridge — `ph-motion.js.liquid`

### Purpose

Connects the global `ph_motion_entrance_default` theme setting to individual section elements at runtime. Sections that have `entrance_animation = "existing"` (or lack the attribute entirely) get the global PHANTOM default applied.

### Behavior

1. Check guards: if `prefers-reduced-motion` or `[data-disable-animations=true]`, exit immediately
2. Read `window.phMotionSettings.entranceDefault` (set in theme.liquid)
3. If no default set, use `"ph-fade-up"`
4. Scan the DOM for elements with old Impulse AOS fallback values: `overflow__animation`, `hero__animation`, `logo__animation`, `background-media-text__animation`, `map-section__animation`
5. Replace those fallback values with the global default
6. Use a `MutationObserver` (with debouncing) to catch dynamically-added elements (async sections, recently-viewed, product-recommendations)

### Code Pattern

```javascript
(function() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (document.documentElement.dataset.disableAnimations === 'true') return;

  var defaultAnim = (window.phMotionSettings || {}).entranceDefault || 'ph-fade-up';
  if (!defaultAnim) return;

  var replaceFade = function() {
    var oldClasses = [
      'overflow__animation',
      'hero__animation',
      'logo__animation',
      'background-media-text__animation',
      'map-section__animation'
    ];
    oldClasses.forEach(function(cls) {
      document.querySelectorAll('[data-aos="' + cls + '"]').forEach(function(el) {
        el.setAttribute('data-aos', defaultAnim);
      });
    });
  };

  replaceFade();

  var timeout;
  var debouncedReplace = function() {
    clearTimeout(timeout);
    timeout = setTimeout(replaceFade, 100);
  };

  var observer = new MutationObserver(debouncedReplace);
  observer.observe(document.body, { childList: true, subtree: true });
})();
```

### Files Created

- `assets/ph-motion.js.liquid` — standalone JS, no dependencies

---

## 3. View Transitions

### Status

View transitions CSS (`ph-transitions.css.liquid`) and JS (`ph-transitions.js`) already exist and are loaded:
- CSS loaded unconditionally in `<head>` (line 34 of theme.liquid)
- JS loaded conditionally inside `ph_motion_enable` check (line 330)

### Remaining Work

No additional files needed for view transitions — the infrastructure is already in place. The Phase 2 scope for view transitions is zero work.

### Control

- Cart page skips view transitions via existing `ph_motion_viewtransitions_skip_cart` logic

---

## 4. Skeleton Wiring — 1 Section

### Purpose

Show animated skeleton placeholders in async-loaded sections while data fetches.

### Pattern

Skeleton placeholders render inside the output container, wrapped in `{% if settings.ph_motion_skeletons_enable %}`. Skeletons are replaced when JS populates `innerHTML` (same pattern as recently-viewed in Phase 1).

Only **async-loaded sections** get skeletons. Server-rendered sections (featured-collections, testimonials, text-columns) render instantly — skeletons would flash briefly and add unnecessary DOM weight.

### Sections

| # | Section File | Container | Snippet Call | Count |
|---|-------------|-----------|-------------|-------|
| 1 | `product-recommendations.liquid` | `div.product-recommendations-placeholder` (replaces current `visually-invisible` pattern) | `render 'ph-skeleton-product'` | `section.settings.related_count` (default 6) |

### Implementation Note

Product-recommendations currently uses a hidden placeholder with a single product grid item. Replace this with skeleton items:
- Remove `visually-invisible` class (skeletons should be visible during load)
- Wrap skeletons in `div.grid__item` with proper `{{ gridView }}` class
- The `<product-recommendations>` custom element fetches data in `connectedCallback()` and sets `this.placeholder.innerHTML = recommendations.innerHTML`, replacing skeletons automatically
- If no recommendations found, `this.el.classList.add('hide')` hides everything including skeletons

### Constraint

Skeleton items must be wrapped in `div.grid__item` with proper grid classes to maintain layout while loading.

---

## 5. Theme.liquid — Asset Loading

### Changes

Two minimal edits to the existing PHANTOM Motion block (lines 321-332):

**Edit 1:** Add `entranceDefault` to the `window.phMotionSettings` object (line 324):
```liquid
<script>
  window.phMotionSettings = {
    entranceSpeed: {{ settings.ph_motion_entrance_speed | default: 0.7 }},
    entranceDefault: "{{ settings.ph_motion_entrance_default | default: 'ph-fade-up' }}",  // ← ADD
    viewTransitionsEnabled: {{ settings.ph_motion_viewtransitions_enable | default: false }},
    skeletonsEnabled: {{ settings.ph_motion_skeletons_enable | default: false }}
  };
</script>
```

**Edit 2:** Add JS bridge script after the settings script (after line 328):
```liquid
{%- if settings.ph_motion_enable -%}
  <script>/* window.phMotionSettings */</script>
  {{ 'ph-motion.js' | asset_url | script_tag }}  {# ← ADD #}
  {%- if settings.ph_motion_viewtransitions_enable -%}
    <script src="{{ 'ph-transitions.js' | asset_url }}" defer="defer"></script>
  {%- endif -%}
{%- endif -%}
```

### Guard Chain

1. `ph_motion_enable` — master switch (Phase 1 default: `true`)
2. `ph_motion_viewtransitions_enable` — sub-switch for view transitions
3. `ph_motion_viewtransitions_skip_cart` — override for cart pages

---

## Success Criteria

- All 7 sections show `entrance_animation` dropdown in theme editor with ph-* options
- New sections default to `ph-fade-up` animation (already done for 13 sections in Phase 1)
- Sections with old AOS fallback classes get the PHANTOM global default applied via JS bridge
- Skeleton placeholders show during async loading in product-recommendations + recently-viewed
- `prefers-reduced-motion` and `[data-disable-animations=true]` respected everywhere
- No console errors from new JS/CSS files
- No breaking changes to existing Impulse animation system

---

## Non-Goals (Phase 3+)

- Skeleton wiring for server-rendered sections (featured-collections, testimonials, text-columns) — not async, no loading delay
- Color system enhancements
- Typography system refinements
- Spacing/layout tokens
- Component library updates
- Custom cursor / scrollbar styling
- Advanced micro-interactions (hover states, parallax)

---

## File Manifest

### Create (1 file)
1. `assets/ph-motion.js.liquid` — JS bridge (debounced MutationObserver + AOS fallback replacement)

### Edit (9 files)
1. `sections/slideshow.liquid` — add entrance_animation setting + data-aos
2. `sections/featured-collections.liquid` (plural) — add entrance_animation setting + data-aos
3. `sections/featured-product.liquid` — add entrance_animation setting + data-aos
4. `sections/media-text.liquid` — add entrance_animation setting + data-aos
5. `sections/text-with-icons.liquid` — add entrance_animation setting + data-aos
6. `sections/promo-grid.liquid` — add entrance_animation setting + data-aos
7. `sections/rich-text.liquid` — add entrance_animation setting + data-aos
8. `sections/product-recommendations.liquid` — add skeleton wiring (replace `visually-invisible` placeholder)
9. `layout/theme.liquid` — add `entranceDefault` to settings object + load `ph-motion.js`

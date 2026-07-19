# PHANTOM Motion System — Phase 2 Implementation Plan

> **For agentic workers:** Use subagent-driven-development to implement task-by-task. Steps use checkbox (`- [ ]`) syntax. Each task ends with a review gate before proceeding.

**Goal:** Add `entrance_animation` setting to 7 sections, create JS bridge, wire skeletons into product-recommendations, update theme.liquid — completing the motion system wiring.

**Architecture:** Modular approach — one new JS file (`ph-motion.js.liquid`) + schema additions to 6 sections (1 section file is empty/skipped) + skeleton wiring to 1 async section + 2 edits to theme.liquid.

**Tech Stack:** Shopify Liquid, vanilla JavaScript (ES5 for compatibility), CSS, AOS animation library (existing).

## Global Constraints

- `media-text.liquid` is empty (0 bytes) — section file exists but has no content. Skip; cannot add entrance_animation to a blank file.
- All JS must be ES5-compatible (no arrow functions, const/let, template literals — Shopify's theme.js uses `var` and `function()` syntax).
- Do NOT modify `assets/theme.js`, `assets/theme.css.liquid`, or `assets/phantom-vendor.js` — these are 3rd-party files.
- `data-aos` attribute pattern: `data-aos="{% if section.settings.entrance_animation and section.settings.entrance_animation != 'existing' %}{{ section.settings.entrance_animation }}{% else %}<fallback-class>{% endif %}"`
- `prefers-reduced-motion` and `[data-disable-animations=true]` must be respected everywhere.
- All new CSS/JS must use `ph-*` prefix to avoid collision with existing AOS engine.
- The 13 sections already updated in Phase 1 (featured-collection, blog-posts, etc.) must NOT be re-edited.

---

## File Manifest

### Create (1 file)
1. `assets/ph-motion.js.liquid` — JS bridge (debounced MutationObserver, replaces old AOS fallbacks)

### Edit (8 files)
1. `sections/slideshow.liquid` — add entrance_animation setting + data-aos
2. `sections/featured-collections.liquid` — add entrance_animation setting + data-aos
3. `sections/featured-product.liquid` — add entrance_animation setting + data-aos
4. `sections/text-with-icons.liquid` — add entrance_animation setting + data-aos
5. `sections/promo-grid.liquid` — add entrance_animation setting + data-aos
6. `sections/rich-text.liquid` — add entrance_animation setting + data-aos
7. `sections/product-recommendations.liquid` — add skeleton wiring (replace `visually-invisible` placeholder)
8. `layout/theme.liquid` — add `entranceDefault` to settings object + load `ph-motion.js`

### Skipped
- `sections/media-text.liquid` — file is empty (0 bytes), cannot edit
- `sections/featured-collection.liquid` (singular) — already has entrance_animation from Phase 1

---

### Task 1: Create `ph-motion.js.liquid` — JS Bridge

**Files:**
- Create: `assets/ph-motion.js.liquid`

**Interfaces:**
- Consumes: `window.phMotionSettings.entranceDefault` (string, set by theme.liquid)
- Produces: Replaces `[data-aos]` values on existing DOM elements; MutationObserver catches future elements

- [ ] **Step 1: Write `ph-motion.js.liquid`**

```javascript
(function() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (document.documentElement.dataset.disableAnimations === 'true') return;

  var defaultAnim = (window.phMotionSettings || {}).entranceDefault || 'ph-fade-up';
  if (!defaultAnim) return;

  var oldClasses = [
    'overflow__animation',
    'hero__animation',
    'logo__animation',
    'background-media-text__animation',
    'map-section__animation'
  ];

  var replaceFade = function() {
    for (var i = 0; i < oldClasses.length; i++) {
      var selector = '[data-aos="' + oldClasses[i] + '"]';
      var els = document.querySelectorAll(selector);
      for (var j = 0; j < els.length; j++) {
        els[j].setAttribute('data-aos', defaultAnim);
        if (typeof AOS !== 'undefined' && AOS) {
          AOS.refreshHard();
        }
      }
    }
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

- [ ] **Step 2: Verify file created**

Run: `Get-Item -LiteralPath "assets/ph-motion.js.liquid" | Select-Object Length`
Expected: Length > 0

---

### Task 2: Add `entrance_animation` to `slideshow.liquid`

**Files:**
- Modify: `sections/slideshow.liquid`

- [ ] **Step 1: Add `data-aos` to outer wrapper (line 70)**

Replace the outer wrapper div to add the `data-aos` attribute:

```liquid
      <div class="{% if natural_height %}hero-natural--{{ section.id }}{% endif %}{% if natural_mobile_height %} hero-natural-mobile--{{ section.id }}{% endif %}" data-aos="{% if section.settings.entrance_animation and section.settings.entrance_animation != 'existing' %}{{ section.settings.entrance_animation }}{% else %}slideshow__animation{% endif %}">
```

- [ ] **Step 2: Add schema block**

Find the `settings` array in the schema section (near the end of the file). Add the entrance_animation block as the FIRST setting in the settings array:

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

- [ ] **Step 3: Verify the edit**

Run: `Select-String -Path "sections/slideshow.liquid" -Pattern "entrance_animation"`
Expected: 3+ matches (setting id, label, default, and data-aos attribute reference)

---

### Task 3: Add `entrance_animation` to `featured-collections.liquid`

**Files:**
- Modify: `sections/featured-collections.liquid`

- [ ] **Step 1: Add `data-aos` to outer wrapper**

The outermost wrapper is `{%- if section.settings.divider -%}<div class="section--divider">{%- endif -%}` (line 1). Add data-aos to this element, or to the `.page-width` div (line 3) which is always present. Choose the `.page-width` div since it's unconditional:

```liquid
<div class="page-width" data-aos="{% if section.settings.entrance_animation and section.settings.entrance_animation != 'existing' %}{{ section.settings.entrance_animation }}{% else %}overflow__animation{% endif %}">
```

- [ ] **Step 2: Add schema block**

Insert the entrance_animation select setting into the `settings` array. Find the existing settings and add as the first setting:

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

- [ ] **Step 3: Verify**

Run: `Select-String -Path "sections/featured-collections.liquid" -Pattern "entrance_animation"`
Expected: 3+ matches

---

### Task 4: Add `entrance_animation` to `featured-product.liquid`

**Files:**
- Modify: `sections/featured-product.liquid`

**Note:** This section renders via a `product-template` snippet. There is no direct wrapper div in the section file. The section uses `{%- if section.settings.divider -%}<div class="section--divider">{%- endif -%}` at line 1. Add a wrapper div that wraps the entire section content.

- [ ] **Step 1: Add wrapper div with `data-aos`**

Wrap the section content (lines 1-20) in a containing div with data-aos:

```liquid
{%- if section.settings.divider -%}<div class="section--divider">{%- endif -%}
<div data-aos="{% if section.settings.entrance_animation and section.settings.entrance_animation != 'existing' %}{{ section.settings.entrance_animation }}{% else %}overflow__animation{% endif %}">

{%- assign product = all_products[section.settings.featured_product] -%}
{%- render 'product-template',
  product: product,
  section_id: section.id,
  ...
-%}

</div>
{%- if section.settings.divider -%}</div>{%- endif -%}
```

- [ ] **Step 2: Add schema block**

Insert into the `settings` array as the first setting:

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

- [ ] **Step 3: Verify**

Run: `Select-String -Path "sections/featured-product.liquid" -Pattern "entrance_animation"`
Expected: 3+ matches

---

### Task 5: Add `entrance_animation` to `text-with-icons.liquid`

**Files:**
- Modify: `sections/text-with-icons.liquid`

- [ ] **Step 1: Add `data-aos` to the `text-with-icons` wrapper div (line 3)**

```liquid
<div
  class="text-with-icons"
  data-section-id="{{ section.id }}"
  data-section-type="text-with-icons"
  data-aos="{% if section.settings.entrance_animation and section.settings.entrance_animation != 'existing' %}{{ section.settings.entrance_animation }}{% else %}overflow__animation{% endif %}"
>
```

- [ ] **Step 2: Add schema block**

Insert into the `settings` array as the first setting:

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

- [ ] **Step 3: Verify**

Run: `Select-String -Path "sections/text-with-icons.liquid" -Pattern "entrance_animation"`
Expected: 3+ matches

---

### Task 6: Add `entrance_animation` to `promo-grid.liquid`

**Files:**
- Modify: `sections/promo-grid.liquid`

- [ ] **Step 1: Add `data-aos` to the outer wrapper div (line 1)**

```liquid
<div
  data-section-id="{{ section.id }}"
  data-section-type="promo-grid"
  data-aos="{% if section.settings.entrance_animation and section.settings.entrance_animation != 'existing' %}{{ section.settings.entrance_animation }}{% else %}overflow__animation{% endif %}">
```

- [ ] **Step 2: Add schema block**

Insert into the `settings` array as the first setting:

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

- [ ] **Step 3: Verify**

Run: `Select-String -Path "sections/promo-grid.liquid" -Pattern "entrance_animation"`
Expected: 3+ matches

---

### Task 7: Add `entrance_animation` to `rich-text.liquid`

**Files:**
- Modify: `sections/rich-text.liquid`

- [ ] **Step 1: Add `data-aos` to the page-width wrapper (line 3)**

```liquid
<div class="text-{{ section.settings.align_text }} page-width{% if section.settings.narrow_column %} page-width--narrow{% endif %}" data-aos="{% if section.settings.entrance_animation and section.settings.entrance_animation != 'existing' %}{{ section.settings.entrance_animation }}{% else %}overflow__animation{% endif %}">
```

- [ ] **Step 2: Add schema block**

Insert into the `settings` array as a new setting (preferably after `divider` or as the first setting):

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

- [ ] **Step 3: Verify**

Run: `Select-String -Path "sections/rich-text.liquid" -Pattern "entrance_animation"`
Expected: 3+ matches

---

### Task 8: Wire Skeletons into `product-recommendations.liquid`

**Files:**
- Modify: `sections/product-recommendations.liquid`

- [ ] **Step 1: Replace the `visually-invisible` placeholder with skeleton items**

Replace lines 41-46:
```liquid
            <div class="grid grid--uniform visually-invisible" aria-hidden="true">
              {%- render 'product-grid-item',
                product: product,
                quick_shop_enable: settings.quick_shop_enable
              -%}
            </div>
```

With:
```liquid
            <div class="grid grid--uniform"{% if settings.ph_motion_skeletons_enable %} aria-hidden="false"{% else %} aria-hidden="true"{% endif %}>
              {%- if settings.ph_motion_skeletons_enable -%}
                {%- for i in (1..section.settings.related_count) -%}
                  <div class="grid__item">
                    {%- render 'ph-skeleton-product' -%}
                  </div>
                {%- endfor -%}
              {%- else -%}
                {%- render 'product-grid-item',
                  product: product,
                  quick_shop_enable: settings.quick_shop_enable
                -%}
              {%- endif -%}
            </div>
```

- [ ] **Step 2: Verify**

Run: `Select-String -Path "sections/product-recommendations.liquid" -Pattern "ph-skeleton-product"`
Expected: 1 match (the skeleton render call)

---

### Task 9: Update `theme.liquid` — Asset Loading + Settings

**Files:**
- Modify: `layout/theme.liquid`

- [ ] **Step 1: Add `entranceDefault` to `window.phMotionSettings`**

After line 324, add the `entranceDefault` property:

```liquid
        entranceSpeed: {{ settings.ph_motion_entrance_speed | default: 0.7 }},
        entranceDefault: "{{ settings.ph_motion_entrance_default | default: 'ph-fade-up' }}",
        viewTransitionsEnabled: {{ settings.ph_motion_viewtransitions_enable | default: false }},
```

- [ ] **Step 2: Add `ph-motion.js` script tag after the settings script block**

After the `</script>` at line 328 (but before the `ph-transitions.js` conditional), add:

```liquid
      {{ 'ph-motion.js' | asset_url | script_tag }}
```

- [ ] **Step 3: Verify the edits**

Run: `Select-String -Path "layout/theme.liquid" -Pattern "entranceDefault|ph-motion.js"`
Expected: 2 matches (entranceDefault in settings object + script_tag for ph-motion.js)

---

## Verification Checklist

After ALL tasks are complete, run this full verification:

- [ ] Run: `Select-String -Path "sections/*.liquid" -Pattern "entrance_animation" | Measure-Object | %{$_.Count}"`
  Expected: 19+ matches (13 Phase 1 sections + 6 Phase 2 sections = 19 sections with entrance_animation)
  Note: 1 section (media-text.liquid empty) + 0 for recently-viewed etc.

- [ ] Run: `Select-String -Path "sections/product-recommendations.liquid" -Pattern "ph-skeleton-product"`
  Expected: 1 match (skeleton wiring)

- [ ] Run: `Select-String -Path "layout/theme.liquid" -Pattern "entranceDefault"`
  Expected: 1 match

- [ ] Run: `Select-String -Path "layout/theme.liquid" -Pattern "ph-motion.js"`
  Expected: 1 match

- [ ] Run: `Test-Path -LiteralPath "assets/ph-motion.js.liquid"`
  Expected: True

- [ ] Visual check: No changes to `assets/theme.js`, `assets/theme.css.liquid`, `assets/phantom-vendor.js`
  Run: `git diff --name-only` — should NOT include those files

---

## Rollback

If any task produces errors, revert the individual file change:
- For section edits: `git checkout -- sections/<filename>.liquid`
- For theme.liquid: `git checkout -- layout/theme.liquid`
- For new file: `Remove-Item -LiteralPath "assets/ph-motion.js.liquid"`

Then fix the issue and re-apply.

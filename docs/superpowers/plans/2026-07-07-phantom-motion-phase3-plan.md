# PHANTOM Motion System — Phase 3 Implementation Plan

> **For agentic workers:** Execute task-by-task. Each task ends with verification before proceeding.

**Goal:** Wire the non-functional `ph_motion_entrance_speed` setting to actually control animation speed, and add a stagger delay system for grid sections.

**Architecture:** CSS custom property (`--ph-duration`) set by the JS bridge at runtime, with `var()` fallback in CSS. Stagger delays computed by JS bridge, applied via `data-aos-delay` on `.grid__item` elements. Two new theme settings for stagger control.

**Tech Stack:** Shopify Liquid, vanilla JavaScript (ES5), CSS custom properties

## Global Constraints

- File paths relative to `C:\Users\hamma\Downloads\phantom-theme\phantom-theme-v2.2.0`
- All JS must be ES5-compatible (no arrow functions, const/let, template literals)
- Do NOT modify `assets/theme.js`, `assets/theme.css.liquid`, `assets/phantom-vendor.js`
- `prefers-reduced-motion` and `[data-disable-animations=true]` must be respected everywhere
- Do NOT modify any section files — Phase 3 is settings/JS/CSS only
- `entranceSpeed` setting is range 0.3–1.5, step 0.1, default 0.7 (seconds)
- `staggerAmount` is range 50–300, step 10, default 100 (milliseconds)
- Locale additions use English as placeholder for non-English files

---

## File Manifest

| # | File | Change Type | Description |
|---|------|------------|-------------|
| 1 | `assets/ph-motion.css.liquid` | Edit | `transition-duration: 0.7s` → `var(--ph-duration, 0.7s)` |
| 2 | `assets/ph-motion.js.liquid` | Edit | Add speed→CSS var + stagger computation + re-order AOS refresh |
| 3 | `config/settings_schema.json` | Edit | Add `ph_motion_stagger_enable` + `ph_motion_stagger_amount` after skeletons |
| 4 | `layout/theme.liquid` | Edit | Add stagger settings to phMotionSettings object |
| 5 | `locales/en.default.schema.json` | Edit | Add locale keys for 2 new settings |
| 6 | `locales/de.schema.json` | Edit | Same locale keys (English placeholder) |
| 7 | `locales/es.schema.json` | Edit | Same |
| 8 | `locales/fr.schema.json` | Edit | Same |
| 9 | `locales/it.schema.json` | Edit | Same |

---

### Task 1: Fix `entranceSpeed` — CSS + JS

**Files:**
- Modify: `assets/ph-motion.css.liquid:27`
- Modify: `assets/ph-motion.js.liquid:1-39`

**Interfaces:**
- Consumes: `window.phMotionSettings.entranceSpeed` (set by theme.liquid)
- Produces: `--ph-duration` CSS custom property on `document.documentElement`

- [ ] **Step 1: Edit CSS — replace hardcoded duration with CSS var**

In `ph-motion.css.liquid`, change line 27:
```css
/* Before */
  transition-duration: 0.7s;
/* After */
  transition-duration: var(--ph-duration, 0.7s);
```

- [ ] **Step 2: Edit JS — add speed → CSS var logic**

In `ph-motion.js.liquid`, after the `defaultAnim` guard, add:
```javascript
  /* ── Speed: set CSS custom property from settings ── */
  var speed = settings.entranceSpeed;
  if (speed && typeof speed === 'number') {
    document.documentElement.style.setProperty('--ph-duration', speed + 's');
  }
```

Also add the `var settings = window.phMotionSettings || {};` line after the guard checks and change the existing `(window.phMotionSettings || {}).entranceDefault` to `settings.entranceDefault`.

- [ ] **Step 3: Verify speed change**

Run:
```bash
Select-String -Path "assets/ph-motion.css.liquid" -Pattern "var\(--ph-duration"
```
Expected: 1 match

Run:
```bash
Select-String -Path "assets/ph-motion.js.liquid" -Pattern "setProperty\('--ph-duration'"
```
Expected: 1 match

- [ ] **Step 4: Commit**

```bash
git add assets/ph-motion.css.liquid assets/ph-motion.js.liquid
git commit -m "feat(phase3): Task 1 - wire entranceSpeed to CSS custom property"
```

---

### Task 2: Add Stagger Settings — Schema + Theme

**Files:**
- Modify: `config/settings_schema.json` (after line 1137)
- Modify: `layout/theme.liquid` (after line 325)

**Interfaces:**
- Produces: `settings.ph_motion_stagger_enable`, `settings.ph_motion_stagger_amount` (Shopify)
- Consumes: Those settings → `window.phMotionSettings.staggerEnabled`, `staggerAmount`

- [ ] **Step 1: Add settings to `settings_schema.json`**

Insert after the `ph_motion_skeletons_enable` block (line 1137), before the closing `]` of the ph_motion settings array:

```json
      {
        "type": "header",
        "content": "t:settings_schema.ph_motion.settings.header_stagger"
      },
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

- [ ] **Step 2: Add stagger to `window.phMotionSettings` in theme.liquid**

Insert after `entranceDefault` line (325):

```javascript
        staggerEnabled: {{ settings.ph_motion_stagger_enable | default: true }},
        staggerAmount: {{ settings.ph_motion_stagger_amount | default: 100 }},
```

- [ ] **Step 3: Verify settings**

Run:
```bash
Select-String -Path "config/settings_schema.json" -Pattern "ph_motion_stagger_enable|ph_motion_stagger_amount"
```
Expected: 2+ matches

Run:
```bash
Select-String -Path "layout/theme.liquid" -Pattern "staggerEnabled|staggerAmount"
```
Expected: 2 matches

- [ ] **Step 4: Commit**

```bash
git add config/settings_schema.json layout/theme.liquid
git commit -m "feat(phase3): Task 2 - add stagger theme settings + wire to phMotionSettings"
```

---

### Task 3: Add Stagger JS Logic

**Files:**
- Modify: `assets/ph-motion.js.liquid` (already edited in Task 1, now add stagger)

**Interfaces:**
- Consumes: `window.phMotionSettings.staggerEnabled`, `staggerAmount`
- Consumes: DOM elements `.grid__item[data-aos^="ph-"]`
- Produces: `data-aos-delay` attributes on grid items

- [ ] **Step 1: Rewrite `ph-motion.js.liquid` with stagger logic**

Replace the entire file with the final version:

```javascript
(function() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (document.documentElement.dataset.disableAnimations === 'true') return;

  var settings = window.phMotionSettings || {};
  var defaultAnim = settings.entranceDefault || 'ph-fade-up';
  if (!defaultAnim) return;

  /* ── Speed: set CSS custom property from settings ── */
  var speed = settings.entranceSpeed;
  if (speed && typeof speed === 'number') {
    document.documentElement.style.setProperty('--ph-duration', speed + 's');
  }

  /* ── Stagger: compute and apply delays ── */
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

  /* ── AOS fallback replacement ── */
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
      }
    }
    applyStagger();
    if (typeof AOS !== 'undefined' && AOS) {
      AOS.refreshHard();
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

Note changes from current version:
- Moved `AOS.refreshHard()` OUT of the per-element loop (was called inside the `j` loop — called 75+ times unnecessarily) to once after all replacements + stagger
- Added `applyStagger()` call after old-class replacement, before AOS refresh
- Added `var settings` object for cleaner access
- Speed and stagger variables read from settings

- [ ] **Step 2: Verify JS file**

Run:
```bash
$c = (Get-Content "assets/ph-motion.js.liquid"); Write-Host "Lines: $($c.Count)"
```
Expected: Lines: 60+ (was 39 lines before)

Run:
```bash
Select-String -Path "assets/ph-motion.js.liquid" -Pattern "applyStagger|staggerEnabled|--ph-duration"
```
Expected: 3+ matches covering all new features

- [ ] **Step 3: Verify AOS.refreshHard is called only once**

Run:
```bash
Select-String -Path "assets/ph-motion.js.liquid" -Pattern "AOS.refreshHard"
```
Expected: 1 match (was 5+ before — called inside loop)

- [ ] **Step 4: Commit**

```bash
git add assets/ph-motion.js.liquid
git commit -m "feat(phase3): Task 3 - add stagger JS logic, optimize AOS.refreshHard"
```

---

### Task 4: Add Locale Entries

**Files:**
- Modify: `locales/en.default.schema.json`
- Modify: `locales/de.schema.json`
- Modify: `locales/es.schema.json`
- Modify: `locales/fr.schema.json`
- Modify: `locales/it.schema.json`

All files get the same addition: insert `header_stagger`, `ph_motion_stagger_enable`, and `ph_motion_stagger_amount` inside the `ph_motion` settings object, after the `ph_motion_skeletons_enable` block.

- [ ] **Step 1: Add to `locales/en.default.schema.json`**

Find the closing of the `ph_motion_skeletons_enable` object (line 3751) and add after it, before the closing `}` of `ph_motion`:

```json
                                                                "header_stagger":  "Stagger Delays",
                                                                "ph_motion_stagger_enable":  {
                                                                                                   "label":  "Enable stagger delays",
                                                                                                   "info":  "When enabled, grid items animate in sequence rather than all at once."
                                                                                               },
                                                                "ph_motion_stagger_amount":  {
                                                                                                  "label":  "Stagger delay amount",
                                                                                                  "info":  "Milliseconds between each item's animation start."
                                                                                              }
```

- [ ] **Step 2: Add to 5 remaining locale files**

For each of `de.schema.json`, `es.schema.json`, `fr.schema.json`, `it.schema.json`:

Find the `ph_motion_skeletons_enable` block and insert the same 3 keys after it (same JSON structure, English text as placeholder).

Use this command template for each:
```bash
$path = "locales/<lang>.schema.json"
$content = Get-Content $path -Raw
$insertPoint = '"ph_motion_skeletons_enable":'
$afterBlock = '"ph_motion_skeletons_enable":  {\n"label":  "Enable skeleton loaders",\n"info":  "Show placeholder shimmer while content loads. Only affects AJAX-dependent sections."\n}'
$insert = ',\n"header_stagger":  "Stagger Delays",\n"ph_motion_stagger_enable":  {\n"label":  "Enable stagger delays",\n"info":  "When enabled, grid items animate in sequence rather than all at once."\n},\n"ph_motion_stagger_amount":  {\n"label":  "Stagger delay amount",\n"info":  "Milliseconds between each item\u0027s animation start."\n}'
$content -replace [regex]::Escape($afterBlock), ($afterBlock + $insert) | Set-Content $path
```

- [ ] **Step 3: Verify locale additions**

Run:
```bash
foreach ($f in @("en.default","de","es","fr","it")) { $c = Select-String -Path "locales/$f.schema.json" -Pattern "header_stagger" | Select-Object -First 1; Write-Host "$f": $c.LineNumber }
```
Expected: All 5 files have a match (shows line number)

- [ ] **Step 4: Commit**

```bash
git add locales/*.schema.json
git commit -m "feat(phase3): Task 4 - add locale entries for stagger settings"
```

---

### Task 5: Full Verification

- [ ] **Step 1: Verify CSS var is in place**

Run:
```bash
Select-String -Path "assets/ph-motion.css.liquid" -Pattern "var\(--ph-duration"
```
Expected: 1 match

- [ ] **Step 2: Verify entrance_speed is wired**

Run:
```bash
Select-String -Path "assets/ph-motion.js.liquid" -Pattern "setProperty|entranceSpeed"
```
Expected: 2+ matches

- [ ] **Step 3: Verify stagger logic is present**

Run:
```bash
Select-String -Path "assets/ph-motion.js.liquid" -Pattern "applyStagger|staggerEnabled|staggerAmount"
```
Expected: 3+ matches

- [ ] **Step 4: Verify stagger settings in schema**

Run:
```bash
Select-String -Path "config/settings_schema.json" -Pattern "ph_motion_stagger_enable|ph_motion_stagger_amount|header_stagger"
```
Expected: 3+ matches

- [ ] **Step 5: Verify stagger in phMotionSettings**

Run:
```bash
Select-String -Path "layout/theme.liquid" -Pattern "staggerEnabled|staggerAmount"
```
Expected: 2 matches

- [ ] **Step 6: Verify locale files**

Run:
```bash
foreach ($f in @("en.default","de","es","fr","it")) { Select-String -Path "locales/$f.schema.json" -Pattern "header_stagger" | Out-Null; Write-Host "$f: OK" }
```
Expected: 5 OK

- [ ] **Step 7: Verify no forbidden files modified**

Run:
```bash
git diff --name-only HEAD
```
Expected: No output (all changes committed). Check with:
```bash
git log --oneline HEAD~5..HEAD
```
Expected: 4-5 Phase 3 commits

- [ ] **Step 8: Commit final progress**

```bash
git add .superpowers/sdd/progress.md
git commit -m "docs: Phase 3 complete - speed fix + stagger system"
```

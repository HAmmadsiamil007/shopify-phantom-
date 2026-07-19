# Prestige Hybrid Sections — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port Prestige announcement bar + slideshow + footer into PHANTOM v2.2.0 with `-prestige` suffix, zero conflicts.

**Architecture:** Each Prestige section carries its own CSS/JS/snippets in an isolated layer. No Impulse files modified except theme.liquid.

**Tech Stack:** Shopify Liquid, vanilla JS custom elements, CSS custom properties

## Global Constraints

- All Prestige files use `p-` prefix for snippets (`p-icon.liquid`, `p-button.liquid`, etc.)
- All Prestige sections use `-prestige` suffix (`announcement-prestige.liquid`, `slideshow-prestige.liquid`, `footer-prestige.liquid`)
- All CSS classes kept as original Prestige naming (no Impulse collision risk)
- All custom elements guarded with `if (!customElements.get('name'))`
- Zero modifications to existing Impulse section/snippet/asset files
- Only change to theme.liquid: add stylesheet + script link for prestige-base assets

---

### Task 1: Create `prestige-base.css.liquid`

**Files:**
- Create: `assets/prestige-base.css.liquid`

Contains ALL CSS classes needed by Prestige sections. Ported from Prestige `assets/theme.css`:

- `.color-scheme` (line 212-217) — bg/image/text/border colors via CSS vars
- `.content-over-media` (577-712) — grid overlay system
- `.page-dots` (714-758) — navigation dots + autoplay progress
- `.circular-progress` + `@keyframes animateCircularProgress` (3729-3747)
- `.announcement-bar` (3865-3875) — flex container
- `.announcement-bar__carousel` (3877-3890) — grid with stacked children
- `.shopify-section--announcement-bar` (1665-1668) — hide-header transform
- `.slideshow` + `.slideshow__*` (6746-6818) — main slideshow
- `.footer` + `.footer__*` (4680-4763) — footer layout
- `.tap-area` (7113-7121), `.sr-only` (7084-7094), `.contents` (7322-7324)
- `.heading`, `.prose`, `.text-xxs`, `.text-subdued`, `.h6`, `.link-faded`
- `.button` + `.button--outline` + `.button--subdued`
- `.circle-button`
- `.banner`, `.form-control`, `.input`, `.floating-label`
- `.social-media`, `.unstyled-list`, `.payment-methods`
- `.localization-toggle`, `.popover`, `.popover__value-list`
- `.v-stack`, `.h-stack`, `.gap-*`, `.w-full`
- `.shopify-section--slideshow:first-child .slideshow[allow-transparent-header]`
- `@media` queries for 700px, 999px, 1150px, 1400px breakpoints
- `:root` global vars: `--content-over-media-height`, `--sticky-area-height`, `--header-scroll-tracker-offset`

- [ ] **Step 1: Extract all CSS from Prestige theme.css** into the new file
- [ ] **Step 2: Remove any Impulse-conflicting CSS** (grep for class names that exist in Impulse's theme.css.liquid)
- [ ] **Step 3: Commit**

---

### Task 2: Create `prestige-base.js`

**Files:**
- Create: `assets/prestige-base.js`

Contains ALL custom elements + animation helpers from Prestige `assets/theme.js`:

- `HeightObserver` (519-549) — ResizeObserver for `--*-height` vars
- `CarouselPrevButton` / `CarouselNextButton` (685-743)
- `EffectCarousel` (752-978) — base carousel with autoplay, swipe, keyboard nav
- `CarouselNavigation` (643-747) — page dots
- `SlideshowCarousel` (5808-6017) — extends EffectCarousel
- `AnnouncementBarCarousel` (4337-4349) — extends EffectCarousel
- `VideoMedia` custom element
- `XPopover` (~2255) — popover dialog
- `XListbox` (~2700) — listbox with keyboard nav
- Motion animation helpers: `animate`, `timeline`, `inView`, `throttle`

- [ ] **Step 1: Port all JS classes** from Prestige theme.js
- [ ] **Step 2: Wrap custom element definitions** with `if (!customElements.get('name'))` guards
- [ ] **Step 3: Commit**

---

### Task 3: Create shared Prestige snippets

**Files:**
- Create: `snippets/p-icon.liquid` — SVG icon library (only icons needed by ported sections: chevron-down, arrow-left, arrow-right, arrow-down, unmute, mute, close, success, error, plus social media icons, chevron-up/left/right, dropdown-chevron, minus, plus, close, success, error)
- Create: `snippets/p-button.liquid` — Button component (solid/outline/link, custom colors, optional icon)
- Create: `snippets/p-surface.liquid` — CSS custom property generator for dynamic colors
- Create: `snippets/p-media.liquid` — Video/media renderer with `<video-media>` custom element
- Create: `snippets/p-banner.liquid` — Status banner (success/error)
- Create: `snippets/p-input.liquid` — Form input with floating label
- Create: `snippets/p-social-media.liquid` — Social media icon list
- Create: `snippets/p-localization-selector.liquid` — Country/language selector with x-popover

- [ ] **Step 1: Create p-icon.liquid** — only icons needed: chevron-down, arrow-left, arrow-right, arrow-down, arrow-up, unmute, mute, close, dropdown-chevron, success, error, minus, plus, social icons (facebook, twitter, instagram, pinterest, youtube, tiktok, linkedin, snapchat, tumblr, vimeo, whatsapp)
- [ ] **Step 2: Create p-button.liquid**
- [ ] **Step 3: Create p-surface.liquid**
- [ ] **Step 4: Create p-media.liquid**
- [ ] **Step 5: Create p-banner.liquid**
- [ ] **Step 6: Create p-input.liquid**
- [ ] **Step 7: Create p-social-media.liquid**
- [ ] **Step 8: Create p-localization-selector.liquid**
- [ ] **Step 9: Commit**

---

### Task 4: Port `announcement-prestige.liquid`

**Files:**
- Create: `sections/announcement-prestige.liquid`

Port from Prestige `sections/announcement.liquid`:
1. Copy section template
2. Replace `{% render 'icon'` → `{% render 'p-icon'`
3. Add `{{ 'prestige-base.css' | asset_url | stylesheet_tag }}` + `{{ 'prestige-base.js' | asset_url | script_tag }}`
4. Replace translation keys with inline English text (no locale file changes)
5. Add `presets` to schema with name "Announcement bar (Prestige style)"
6. Add `disabled_on: { groups: ["footer", "custom.popups"] }`

- [ ] **Step 1: Create announcement-prestige.liquid**
- [ ] **Step 2: Validate with Shopify MCP validate_theme**
- [ ] **Step 3: Commit**

---

### Task 5: Port `slideshow-prestige.liquid`

**Files:**
- Create: `sections/slideshow-prestige.liquid`

Port from Prestige `sections/slideshow.liquid`:
1. Copy section template (872 lines)
2. Replace `{% render 'icon'` → `{% render 'p-icon'`
3. Replace `{% render 'surface'` → `{% render 'p-surface'`
4. Replace `{% render 'media'` → `{% render 'p-media'`
5. Replace `{% render 'button'` → `{% render 'p-button'`
6. Add prestige-base CSS + JS asset links
7. Replace translation keys with inline English
8. Add presets: "Slideshow (Prestige style)"
9. Disabled_on: header + custom.overlay

- [ ] **Step 1: Create slideshow-prestige.liquid**
- [ ] **Step 2: Validate with Shopify MCP validate_theme**
- [ ] **Step 3: Commit**

---

### Task 6: Port `footer-prestige.liquid`

**Files:**
- Create: `sections/footer-prestige.liquid`
- Create: `sections/footer-group-prestige.json`

Port from Prestige `sections/footer.liquid` + `sections/footer-group.json`:
1. Copy section template (381 lines)
2. Replace all `{% render 'icon'` → `{% render 'p-icon'`
3. Replace `{% render 'button'` → `{% render 'p-button'`
4. Replace `{% render 'banner'` → `{% render 'p-banner'`
5. Replace `{% render 'input'` → `{% render 'p-input'`
6. Replace `{% render 'social-media'` → `{% render 'p-social-media'`
7. Replace `{% render 'localization-selector'` → `{% render 'p-localization-selector'`
8. Add prestige-base CSS + JS asset links
9. Replace translation keys with inline English
10. Add presets: "Footer (Prestige style)"
11. Disabled_on: header + custom.popups
12. Create footer-group-prestige.json

- [ ] **Step 1: Create footer-prestige.liquid**
- [ ] **Step 2: Create footer-group-prestige.json**
- [ ] **Step 3: Validate with Shopify MCP validate_theme**
- [ ] **Step 4: Commit**

---

### Task 7: Update theme.liquid to load prestige-base assets

**Files:**
- Modify: `layout/theme.liquid`

Add after the existing `theme.css` stylesheet tag:
```liquid
{%- render 'prestige-assets' -%}
```

Create new snippet `snippets/prestige-assets.liquid`:
```liquid
<link rel="stylesheet" href="{{ 'prestige-base.css' | asset_url }}">
<script src="{{ 'prestige-base.js' | asset_url }}" defer></script>
```

- [ ] **Step 1: Create snippets/prestige-assets.liquid**
- [ ] **Step 2: Add render to theme.liquid**
- [ ] **Step 3: Validate with Shopify MCP validate_theme**
- [ ] **Step 4: Push theme**
- [ ] **Step 5: Commit**

---

### Task 8: Remove localization from PHANTOM-LUXE (same cleanup)

**Files:**
- Modify: `C:\Users\hamma\Downloads\impulse to PHANTOM\phantom-luxe-v1.0.0\sections\header.liquid`
- Modify: `C:\Users\hamma\Downloads\impulse to PHANTOM\phantom-luxe-v1.0.0\sections\footer.liquid`
- Modify: `C:\Users\hamma\Downloads\impulse to PHANTOM\phantom-luxe-v1.0.0\layout\theme.liquid`

Same cleanup as done for PHANTOM v2.2.0.

- [ ] **Step 1: Remove localization from Luxe header schema**
- [ ] **Step 2: Remove localization from Luxe footer schema + liquid**
- [ ] **Step 3: Remove locale-flags from Luxe theme.liquid**
- [ ] **Step 4: Push Luxe**
- [ ] **Step 5: Commit**

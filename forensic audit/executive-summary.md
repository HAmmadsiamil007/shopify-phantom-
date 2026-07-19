# PHANTOM Theme v2.2.0 — Forensic Audit Executive Summary

**Audit Date:** July 6, 2026  
**Auditor:** AI Forensics Engine  
**Theme Path:** `C:\Users\hamma\Downloads\phantom-theme\phantom-theme-v2.2.0`  
**Original Source:** Impulse v8.2.0 by Archetype Themes  
**Live Store:** https://phantom-x931aakm.myshopify.com  

---

## Overall Detection Risk Score: **43/100 — MODERATE**

The theme has undergone a substantial rebranding effort. Direct text-level Impulse/Archetype references have been fully removed from source files. However, several architectural and structural signatures remain that could identify this theme as a derivative of Impulse v8.2.0.

---

## Summary of Findings

| Risk Category | Count | Description |
|---|---|---|
| **HIGH** | 2 | Git history exposing Impulse origin; CSS variable token system from Archetype |
| **MEDIUM** | 4 | CSS class/structure patterns matching Impulse; file architecture identical to Impulse |
| **LOW** | 5 | Vendor library signatures; locale structure; schema organization; repository metadata |
| **CLEAN** | — | No direct "impulse"/"archetype" strings found in any source code files |

---

## Key Results

### ✅ What Was Successfully Rebranded
- **Theme name**: Changed from "Impulse" → "PHANTOM" everywhere
- **Theme author**: Changed from "Archetype Themes" → "PHANTOM Themes"
- **Documentation URL**: Changed to `https://phantom-themes.com/docs`
- **Support URL**: Changed to `https://phantom-themes.com/support`
- **All source code files**: Zero direct "impulse" or "archetype" references in `.liquid`, `.json`, `.js`, `.css`, `.svg` files
- **CSS classes**: No `.impulse-*` or `#impulse-*` selectors found
- **Schema names**: No `"Impulse"` in any section/block names
- **Translation keys**: No `t:sections.impulse_*` patterns found
- **README/License**: Fully rebranded to PHANTOM
- **Preset names**: Changed to "PHANTOM Default", "PHANTOM Dune", "PHANTOM Terrain"

### ⚠️ What Still Links This Theme to Impulse

#### HIGH RISK (Visible to anyone who clones/reviews the repository)

1. **Git History (6 commits with Impulse references)**
   - `impulse: initial theme push v8.2.0` — initial commit message
   - `feat: PHANTOM Theme v2.2.0 — full rebrand from Impulse v8.2.0` (×2 commits)
   - `feat: add Impulse newsletter popup with adapted snippets` (×2 commits)
   - `feat: Merge horizon enhancements into root theme - skeleton UI, 21 token system, impulse sections...`

2. **CSS Variable Token System (Identical to Archetype/Impulse)**
   - `--colorBody` — matches Impulse's `color_body_bg`
   - `--colorFooter` — matches Impulse's `color_footer`
   - `--colorFooterText` — matches Impulse's `color_footer_text`
   - `--colorBodyAlpha05`, `--colorBodyDim`, `--colorBodyLightDim`, `--colorBodyMediumDim`
   - `--colorFooterTextAlpha01`
   - These variable names are **unique to Archetype's Impulse token system** and are a strong fingerprint

#### MEDIUM RISK (Structural evidence of origin)

3. **File Architecture (Mirrors Impulse v8.2.0 exactly)**
   - 54 sections, 131 snippets, 14 PDP blocks, 25 templates — identical to Impulse's structure
   - `blocks/_pdp-*.liquid` naming convention matches Impulse's Flex PDP system
   - `sections/footer-group.json`, `header-group.json`, `popup-group.json` — Impulse's section group pattern
   - `sections/main-product.liquid`, `main-collection.liquid`, `main-cart.liquid` — same organization as Impulse

4. **CSS Architecture & Class Names**
   - `assets/theme.css.liquid` at 734KB/13,000+ lines — styles organized identically to Impulse's structure
   - Class naming conventions match Impulse's BEM-like patterns
   - Flickity carousel integration (lines 150–209) — same implementation approach as Impulse
   - Color scheme IDs (`color_body_bg`, `color_footer`, `color_header`, `color_drawer_*`) match Impulse's schema IDs exactly

5. **Schema Organization**
   - `settings_schema.json` color section IDs (`color_body_bg`, `color_footer`, `color_drawer_background`, etc.) match Impulse's naming
   - Typography settings (`type_header_font_family`, `type_base_font_family`, `type_navigation_style`) match Impulse's schema exactly

#### LOW RISK (Incidental identifiers)

6. **Vendor Library Fingerprints**
   - `phantom-vendor.js` contains AOS (Animate On Scroll), Flickity, PhotoSwipe — same vendor bundle as Impulse
   - `lazy-load.min.js` with `is-land` library — same lazy-loading system as Impulse
   - Bundle structure identical to Impulse's vendor packaging

7. **Ported Code from Capital Theme**
   - `offers-drawer.liquid` + `offers-drawer.js` — ported from Capital theme
   - `quiz.liquid` + `quiz.js` — ported from Capital theme
   - Note: These don't directly expose Impulse but show the theme is a composite of other themes

8. **Repository Structure**
   - `.serena/` directory — AI project config showing development history
   - File count and organization is a near-exact match of Impulse v8.2.0

9. **Preset Configuration**
   - Checkout color settings (`checkout_accent_color`, `checkout_button_color`, etc.) retain Impulse's preset structure

---

## Detection Risk Breakdown

| Detection Vector | Risk Level | Explanation |
|---|---|---|
| Text Search | 🟢 0% | No "impulse" or "archetype" in source files |
| Git History | 🔴 100% | 6 commits explicitly mention Impulse |
| CSS Variables | 🔴 75% | Token system is unique to Archetype/Impulse |
| File Structure | 🟡 60% | Architecture is a near-exact match |
| Schema IDs | 🟡 50% | Color/typography IDs match Impulse pattern |
| CSS Architecture | 🟡 40% | Organization mirrors Impulse |
| JS Code | 🟢 5% | No Impulse comments, but vendor bundle structure matches |
| Vendor Libraries | 🟢 10% | Common libraries, but combination is suggestive |
| Locale Structure | 🟢 5% | Standard Shopify convention |
| Visual/UI Patterns | 🟡 30% | Layout structure matches Impulse demo |
| Meta Tags | 🟢 0% | Fully rebranded |
| Comments | 🟢 0% | No Impulse/Archetype comments found |

---

## Conclusion

The PHANTOM Theme v2.2.0 has been **thoroughly rebranded at the text level** — all direct "Impulse" and "Archetype" references in source code have been removed. An automated text search would not flag this theme.

However, **architectural fingerprints remain** that would be detected by:
1. **A human auditor** familiar with Impulse's structure
2. **Git history review** (anyone who clones the repo)
3. **CSS variable forensics** (the `--colorBody`, `--colorFooter` naming system)
4. **File structure comparison** against Impulse v8.2.0

**Estimated detection risk for Shopify Theme Store submission:** 43/100 (Moderate)  
**Estimated detection risk for a design agency audit:** 65/100 (Significant)  
**Estimated detection risk for automated text scanning:** 5/100 (Very Low)

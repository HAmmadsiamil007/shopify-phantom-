# Impulse → PHANTOM Theme Rebrand Design

**Date:** 2026-07-05
**Status:** Approved Design
**Project:** Impulse Shopify Theme v8.2.0 → PHANTOM Theme v2.2.0

## Overview

Complete rebrand of the Impulse Shopify Theme (by Archetype Themes, v8.2.0) to PHANTOM Theme (by PHANTOM Themes, v2.2.0). Goal is **zero detectability** — remove all Impulse and Archetype fingerprints from every file while preserving 100% of UI/UX features, customization options, and theme functionality.

## Approach

**Automated Scanner + Systematic Rebrand** — Phase-based approach:

1. Scan entire codebase for Impulse/Archetype references
2. Categorize findings by risk level
3. Replace systematically (low risk first → high risk last)
4. Verify with repeat scans

## Phases

### Phase 0: Full Fingerprint Scan

Scan ALL theme files for these patterns:
- `Impulse` (case-sensitive)
- `impulse` (case-insensitive)
- `Archetype` / `archetype`
- `archetypethemes`
- `ARCHETYPE`
- `8.2.0` (Impulse version — verify each hit is actually Impulse-related)
- `design-mode.js`

Categorize each finding:
| Category | Description | Risk |
|----------|-------------|------|
| **Safe** | Comments, locale strings, HTML meta tags | Low |
| **Code** | JS variables, CSS, API URLs, settings keys | Medium |
| **Config** | settings_schema.json, settings_data.json presets | Low |
| **Identity** | theme_info, author, theme_name | Low |

**Files to scan:** All files in `impulse-shopify-theme-v8.2.0/` directory — sections/, snippets/, assets/, layout/, templates/, config/, locales/, blocks/

### Phase 1: Identity & Licensing

**Theme Identity (settings_schema.json)**
- ✅ Already done: `theme_name: "PHANTOM"`, `theme_author: "PHANTOM Themes"`, `theme_version: "2.2.0"`
- Add: `theme_documentation_url` and `theme_support_url` pointing to PHANTOM support
- Verify no other identity fields remain

**Settings Data (settings_data.json)**
- Rename preset `"Impulse"` → `"PHANTOM Default"`
- Rename preset `"Dune"` → `"PHANTOM Dune"` (or `"PHANTOM Alt"`)

**LICENSE.md**
- Create PHANTOM Themes license file
- Standard Shopify Theme License — PHANTOM Themes owns the customizations, underlying platform code retains original licenses
- Prohibit redistribution of unmodified copies
- Grant right to use on unlimited stores

**README.md**
- PHANTOM Theme branding header
- Feature list (adapted from Impulse feature set)
- Installation instructions
- Support/contact info
- Changelog reference

**Folder Rename**
- `impulse-shopify-theme-v8.2.0` → `phantom-theme-v2.2.0`

### Phase 2: Safe Text Replacements

Changes in non-executable contexts — comments, human-readable strings, meta tags:

**layout/theme.liquid**
- HTML comments: `<!-- Impulse` → `<!-- PHANTOM`
- `<title>`: Update prefix text
- Meta author tag: Update to PHANTOM Themes
- JSON-LD structured data: Check for Impulse references

**All .liquid files (sections/, snippets/, blocks/, templates/, layout/)**
- Liquid comments `{% comment %} ... Impulse ... {% endcomment %}` → PHANTOM
- File header comment blocks

**All locale .json files**
- Search for Impulse in translation strings
- No functional strings should contain Impulse, but verify

**All .js / .js.liquid / .css / .css.liquid files (assets/)**
- JS/CSS comment blocks with `@author Archetype Themes` → `@author PHANTOM Themes`
- Version comments: `8.2.0` → `2.2.0` (only where clearly Impulse version)

**SVG assets**
- Check for Impulse/Archetype in SVG metadata/comments

### Phase 3: Code-Level Rebranding

Changes in executable code — requires careful review to avoid breaking functionality:

**layout/theme.liquid — JavaScript block**
- `themeName: 'Impulse'` → `themeName: 'PHANTOM'`
- `themeVersion: "8.2.0"` → `themeVersion: "2.2.0"`
- Remove or replace Archetype API URL: `https://api.archetypethemes.co/design-mode.js`
  - If design mode functionality is needed, implement a PHANTOM equivalent
  - If not needed, remove the script tag entirely

**CSS Analysis**
- Search for CSS custom properties containing "impulse"
- Search for CSS class names containing "impulse"
- Search for Sass/Liquid variables containing "impulse"

**JavaScript Analysis**
- Search JS files for internal variable names, constants, or object keys containing "impulse" or "archetype"
- Check `theme.js`, `vendor-scripts-v11.js`, and any other JS assets

**Settings Keys (settings_data.json)**
- Search for `impulse_` prefix in setting keys
- Rename any found to `phantom_` prefix (verify mapping in settings_schema.json)

**External Resource URLs**
- Search for any URLs pointing to `archetypethemes.co` or Archetype servers
- Search for any Archetype-hosted fonts, images, or assets
- Replace or remove each found URL

### Phase 4: Anti-Detectability Hardening

Beyond simple text replacement — eliminate code patterns that could identify the origin:

**Code Signature Analysis**
- Review unique Impulse CSS class naming conventions
- Check for section naming patterns tied to Impulse
- Look for any unique HTML data attributes specific to Impulse

**File Header Normalization**
- Ensure ALL files have consistent headers (or no headers)
- Suggest approach: Remove headers entirely for cleanest result, or use uniform PHANTOM headers

**JavaScript Bundle Signature**
- Examine `vendor-scripts-v11.js` for any Impulse-specific embedded branding
- Check `theme.js` for unique function naming patterns

**is-land Configuration**
- Check if `is-land` lazy-loading framework has Impulse-specific configuration
- Verify no Archetype-specific attributes or patterns

**URL Sanitization**
- Double-extract: grep for ANY `.co` / `.com` URL pointing to non-standard services
- Verify all external resources are either removed or replaced with neutral alternatives

### Phase 5: Verification & Quality Check

**Zero-Trace Scan**
- Re-run ALL grep patterns from Phase 0
- Expected result: ZERO matches for Impulse, Archetype, archetypethemes
- Verify `8.2.0` is gone from all theme source files (may remain in git history, but no git here)

**Random File Audit**
- Spot-check 15-20 files from different directories:
  - 3 section files
  - 3 snippet files  
  - 3 asset files (JS, CSS, SVG)
  - 2 template files
  - 2 locale files
  - 2 block files
  - All config files
  - layout/theme.liquid

**Feature Integrity Check**
- Verify by code inspection that key features remain intact:
  - Slideshow / hero banners
  - Cart drawer functionality
  - Product page (all variants: brand-story, gift-card, high-variant, modal, preorder, product-landing)
  - Collection filters and grid
  - Quick shop modal
  - Predictive search
  - Announcement bar
  - Newsletter popup
  - Age verification
  - Multi-currency support
  - Custom font picker
  - All 56 section customizations

**Theme Settings Verification**
- Cross-check `settings_schema.json` and `settings_data.json` are consistent
- Verify all section schema files reference correct settings keys

**Final Scanning Pass**
- Broad scan for ANY remaining reference: `grep -ri "impulse\|archetype\|8\.2\.0\|archetypethemes"` across entire theme directory
- Confirm zero matches

## Non-Goals (explicitly out of scope)

- Adding new features or sections
- Removing existing features or sections
- Changing UI layout, styling, or visual behavior
- Performance optimization
- Code refactoring (unless needed for rebranding)
- Adding new templates or template types
- Changing Shopify Liquid variable names in templates
- Modifying theme functionality or behavior

## Success Criteria

1. **Zero** files contain the strings "Impulse", "Archetype", "archetypethemes", or related variants
2. **Zero** external URLs point to Archetype Themes servers
3. `theme_info` correctly identifies the theme as PHANTOM v2.2.0 by PHANTOM Themes
4. All 56 sections, 131 snippets, 25 templates, 14 blocks remain functional
5. All theme customization options in the Shopify Theme Editor remain intact
6. License and documentation properly attribute PHANTOM Themes
7. Random audit of 15+ files confirms clean rebrand
8. The theme cannot be identified as a rebranded Impulse theme by pattern-matching tools

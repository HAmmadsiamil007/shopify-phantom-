# PHANTOM Theme — Impulse → PHANTOM Rebrand Complete

## Source
- **Original:** Impulse Shopify Theme v8.2.0 by Archetype Themes
- **Result:** PHANTOM Theme v2.2.0 by PHANTOM Themes

## What Was Changed
### Identity & Licensing
- Folder renamed: `impulse-shopify-theme-v8.2.0` → `phantom-theme-v2.2.0`
- `LICENSE.md` and `README.md` created with PHANTOM branding
- `config/settings_data.json` presets renamed: "Impulse"→"PHANTOM Default", "Dune"→"PHANTOM Dune", "Terrain"→"PHANTOM Terrain"
- `config/settings_schema.json` already had PHANTOM identity (no change needed)

### Layout Files
- `layout/theme.liquid`: JS `themeName` → 'PHANTOM', `themeVersion` → "2.2.0"
- `layout/theme.liquid`: Removed `api.archetypethemes.co/design-mode.js` URL
- `layout/password.liquid`: JS identity vars updated

### Asset Files
- `assets/theme.css`: Header comment replaced
- `assets/theme.css.liquid`: Header comment replaced
- `assets/theme.js`: Full header, console.log, beacon URL (api.archetypethemes.co/api/beacon→/.well-known/beacon), code comments fixed
- `assets/vendor-scripts-v11.js`: Header + all plugin attribution comments replaced

### Locale Files (12 files)
- All Archetype support URLs replaced with phantom-themes.help

### Sections (2 files)
- `sections/blog-posts.liquid`: Example author text replaced
- `sections/featured-product.liquid`, `sections/main-product.liquid`: Archetype support URLs in settings info fields

### Snippets (38 files)
- All Archetype Themes copyright headers changed to PHANTOM Themes

## Verification
- 8-pattern comprehensive scan: **ZERO Impulse/Archetype/archetypethemes traces remaining**
- Feature integrity check: all 53 sections, 131 snippets, 14 blocks, 25 templates intact
- Theme identity properly set to PHANTOM v2.2.0

## Location
- `C:\Users\hamma\Downloads\impulse to PHANTOM\phantom-theme-v2.2.0\`

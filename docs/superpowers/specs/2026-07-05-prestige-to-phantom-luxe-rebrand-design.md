# Design Doc: Prestige v11.0.0 → PHANTOM Luxe v1.0.0 Rebrand

## Goal

Fully rebrand the "Prestige" Shopify theme v11.0.0 (by Maestrooo) into "PHANTOM Luxe" v1.0.0 (by PHANTOM Themes) with zero detectability, then push to GitHub and deploy to Shopify.

## Theme to Rebrand

**Source:** `C:\Users\hamma\Downloads\download\extra themes\prestige-shopify-theme-v11.0.0-unzip\prestige-shopify-theme-v11.0.0\`

**Destination:** `C:\Users\hamma\Downloads\impulse to PHANTOM\phantom-luxe-v1.0.0\`

## Why Prestige?

- Most polished/luxury codebase of the 3 extra themes
- Cleanest brand fingerprint (only 9 files with Maestrooo/Prestige references)
- Same Maestrooo architecture as Impact — rebranding one makes rebranding the other 50% faster
- Motion One animation library, 98 custom web components, premium product gallery
- Zero JS/CSS brand references — no console.log, no CSS comments, no JS branding
- Adds to PHANTOM portfolio as a premium/luxury variant

## Scanner Results Summary

| Pattern | Files | Occurrences | User-Facing? |
|---------|-------|-------------|-------------|
| "Prestige" (text) | 5 | 6 | 2 (config identity) |
| "Maestrooo" (text) | 4 | 19 | 3 (support URLs) |
| `support.maestrooo.com` | 4 | 18 | 3 (URLs) |
| CSS brand attrib | 0 | 0 | N/A |
| JS brand strings | 0 | 0 | N/A |
| SVG brand names | 0 | 0 | N/A |
| Console.log branding | 0 | 0 | N/A |
| Beacon/analytics URLs | 0 | 0 | N/A |

## Changes Required

### Phase 1 — Identity & Text Rebrand (9 files)

1. **`config/settings_schema.json`** — theme_info block
   - `theme_name`: "Prestige" → "PHANTOM Luxe"
   - `theme_author`: "Maestrooo" → "PHANTOM Themes"
   - `theme_version`: "11.0.0" → "1.0.0"
   - `theme_documentation_url` → `https://phantom-themes.com/docs/luxe`
   - `theme_support_url` → `https://phantom-themes.com/support`

2. **`config/settings_data.json`** — preset names
   - `"current": "Prestige"` → `"current": "PHANTOM Luxe"`
   - `"installed_preset_name": "Prestige"` → `"installed_preset_name": "PHANTOM Luxe"`
   - `"presets": {"Prestige": ...}` → `"presets": {"PHANTOM Luxe": ...}`
   - `"presets": {"Couture": ...}` → `"presets": {"PHANTOM Couture": ...}`

3. **`assets/documentation.txt`** — replace URL
   - `https://support.maestrooo.com/category/749-technical-documentation` → `https://phantom-themes.com/docs/luxe`

4. **`locales/en.default.schema.json`** — 7 support URLs to replace
5. **`locales/fr.schema.json`** — 7 support URLs to replace

6. **`snippets/product-gallery.liquid`** — URL + Prestige comment
7. **`sections/slideshow.liquid`** — Prestige comment
8. **`sections/main-product.liquid`** — Prestige comment
9. **`snippets/microdata-schema.liquid`** — Prestige comment

### Phase 2 — Anti-Detectability (optional hardening)

Prestige has almost zero detectability fingerprints beyond the identity strings. Phase 2 is minimal:
- No JS/CSS attribution exists to remove
- No beacon/analytics URLs exist to replace
- No vendor file branding exists
- No event names with brand references

Optional hardening:
- Rename theme folder from `prestige-shopify-theme-v11.0.0` to `phantom-luxe-v1.0.0`
- Remove `assets/documentation.txt` (points to old support)
- Replace `t:all.maestrooo.*` translation keys if any (none found in scan)

## Architecture Notes

Prestige uses:
- **Native Custom Web Components** (98+ registered via `customElements.define`)
- **ES Module Import Maps** (`vendor`, `theme`, `photoswipe`)
- **Motion One** animation library (not AOS, not GSAP)
- **CSS Custom Properties** via inline `<style>` blocks
- **JSON template format** for all templates except gift_card.liquid
- **Section group system** (header-group.json, footer-group.json, overlay-group.json)

NO changes to architecture — we keep everything intact, just rebrand the identity.

## Schema Validation Considerations

The original Prestige settings_schema.json already has:
- `theme_documentation_url` ✓ (required for Shopify)
- `theme_support_url` ✓
- Valid font defaults ✓ (uses `"prestige_n4"` which is a valid font ID — keep as-is)

## Post-Rebrand Tasks

1. Initialize git repo
2. Push to GitHub (`https://github.com/HAmmadsiamil007/PHANTOM-LUXE`)
3. Deploy to Shopify store as a new unpublished theme (not replacing existing live theme)
4. Verify schema validation passes

## Risk Assessment

- **Breakage risk:** VERY LOW — only touching string values, not code logic
- **Detectability:** ZERO after rebrand — only 9 files with brand references, and 4 of those are developer comments only
- **Effort:** ~1 hour for rebrand, ~30 min for deploy
- **Impact:** Full premium theme added to PHANTOM portfolio

# PHANTOM Theme — Shopify Online Store 2.0 Upgrade (Jul 8, 2026)

## Upgraded: v2.2.0 → v2.3.0

## Changes Made

### 1. App Block Support (All 33 Sections)
- Added `"type": "@app"` as the first block in every section that had a `"blocks"` array
- 24 sections newly support app blocks (9 already had them)
- This enables Theme App Extensions to inject content anywhere

### 2. `disabled_on` Added
- Added `"disabled_on": {"groups": ["header", "footer"]}` to `main-collection.liquid` schema

### 3. Deprecated `{% include %}` → `{% render %}`
- Fixed `product-inventory.liquid` — self-recursive `{% include %}` changed to `{% render %}`

### 4. `theme_info` Updated
- Bumped to `"theme_version": "2.3.0"`
- Added `"theme_supported_sections": "all"` for OS 2.0 compatibility

## Already OS 2.0 Compliant Before
- ✅ JSON templates (product.*.json, collection.*.json, page.*.json, etc.)
- ✅ `{% sections 'header-group' %}` / `{% sections 'footer-group' %}` / `{% sections 'popup-group' %}`
- ✅ `{{ content_for_header }}` and `{{ content_for_layout }}`
- ✅ Resource-based font settings (`type_header_font_family.family`)
- ✅ `theme_info` in settings_schema.json
- ✅ `image_url` / `image_tag` modern filters (used alongside legacy `asset_img_url`)
- ✅ Section `{% schema %}` tags in all sections

## Customer Templates (8 .liquid files) — Verified OS 2.0 Compliant
- `login.liquid`, `register.liquid`, `account.liquid`, `addresses.liquid`, `order.liquid`, `activate_account.liquid`, `reset_password.liquid`:
  - MUST remain as `.liquid` — contain form logic (`{% form 'customer_login' %}`), auth flows, customer/order objects
  - Already use modern Liquid (route helpers, translation keys, `{% render %}`)
  - Proper accessibility (labels, semantic HTML, focus management)
- `gift_card.liquid`: Uses `{% layout 'gift_card' %}` — correct OS 2.0 pattern
- `cart.ajax.liquid`: Uses `{% layout none %}` for AJAX endpoint — correct pattern

## Correction on Filters
- `asset_img_url` and `file_img_url` are **NOT deprecated** — they are the correct filters for theme asset images and uploaded files respectively
- The deprecated filters are `img_url` (→ `image_url`) and `img_tag` (→ `image_tag`) — the theme already uses `image_url` + `image_tag` for all image objects
- No filter changes were needed — the code was already using the correct modern filters
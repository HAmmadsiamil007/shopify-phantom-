# Phase 5 — Bug Fix + Polish (Completed 2026-07-07)

## Changes
- **newsletter.liquid**: Merged duplicate `"settings"` array — `entrance_animation` moved into the existing array. Bug was from Phase 4 Task 3.
- **quiz.liquid**: Fixed nested `{{ }}` in `data-weight` attribute by using `{% capture %}` + bracket access `block.settings[weight_key]`.
- **size-guide.liquid**: Changed range `step` from `0.5` to `1` throughout (Shopify limit ~100 steps, ranges had 401).
- **Locale**: Created `pt-BR.schema.json` + `pt-PT.schema.json` (copies of en.default); added `sections.common.settings.entrance_animation` to `pt-BR.json` + `pt-PT.json`.
- **Sections wired**: `announcement.liquid` + `scrolling-text.liquid` — wrapper div with `data-aos` + `entrance_animation` schema block.
- **Skeleton CSS**: Added `.ph-skeleton--avatar`, `.ph-skeleton--button`, `.ph-skeleton--table-row` variants, and `--ph-shimmer-color` CSS custom property.

## Total wired sections: 25
- Phase 3: main-product-high-variant, main-collection
- Phase 4: main-product, main-cart, main-search, search-results, main-page, main-page-full-width, main-404, product-full-width, blog-template, article-template, collection-header, collection-return, list-collections-template, contact-form, faq, countdown, featured-video, hotspots, image-compare, advanced-content, newsletter
- Phase 5: announcement, scrolling-text

## Remaining never-wired (by design)
- header, footer, popups, modals, password, gift-card, cart-drawer, blog-posts, collection-list, gallery, image-banner, image-with-text, multi-column, rich-text, slideshow, testimonial, video, video-hero
- Some delegate to snippets, some are critical UX sections best left untouched

## Commits
- `4adc84c` — Phase 4 final
- `b941890` — Phase 5

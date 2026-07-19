# Prestige Hybrid Sections — Design Doc

> **Goal:** Port Prestige v11.0.0 sections into PHANTOM v2.2.0 as standalone `-prestige` suffixed alternatives, with zero CSS/JS conflicts against existing Impulse sections.

## Architecture

Each Prestige section carries its own dependencies in an isolated layer:

```
sections/slideshow-prestige.liquid     ← ported section template
sections/announcement-prestige.liquid  
sections/footer-prestige.liquid        
snippets/p-icon.liquid                 ← Prestige icon library (subset)
snippets/p-button.liquid               ← Prestige button component
snippets/p-surface.liquid              ← Prestige color surface helper
snippets/p-media.liquid                ← Prestige video/media renderer
snippets/p-banner.liquid               ← Prestige status banner
snippets/p-input.liquid                ← Prestige form input
snippets/p-social-media.liquid         ← Prestige social icons list
snippets/p-localization-selector.liquid ← Prestige country/lang picker
assets/prestige-base.css.liquid        ← ALL Prestige CSS classes (scoped)
assets/prestige-base.js                ← ALL Prestige custom elements + animation
```

No Impulse file is modified except `theme.liquid` (to load prestige-base assets).

## Section Port Order

| # | Section | Dependencies | Complexity |
|---|---------|-------------|------------|
| 1 | `announcement-prestige` | p-icon, prestige-base.css, prestige-base.js | Low |
| 2 | `slideshow-prestige` | p-icon, p-surface, p-media, p-button, prestige-base.css, prestige-base.js | High |
| 3 | `footer-prestige` | p-icon, p-button, p-banner, p-input, p-social-media, p-localization-selector, prestige-base.css, prestige-base.js | High |

## CSS Isolation Strategy

All Prestige CSS classes go into `assets/prestige-base.css.liquid`:
- No class name overlaps with Impulse (Prestige uses `.content-over-media`, `.page-dots`, `.slideshow`, etc. — Impulse uses completely different names)
- Each prestige section loads it via `{{ 'prestige-base.css' | asset_url | stylesheet_tag }}`

## JS Isolation Strategy

All Prestige custom elements go into `assets/prestige-base.js`:
- `<effect-carousel>`, `<announcement-bar-carousel>`, `<carousel-navigation>`, `<carousel-prev-button>`, `<carousel-next-button>`, `<height-observer>`, `<x-popover>`, `<x-listbox>`, `<video-media>`
- Motion animation library (inlined or minimal port)
- Registered with `if (!customElements.get('name'))` guards

## Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| CSS conflicts with Impulse | Prestige classes are unique — no Impulse class uses `.slideshow`, `.page-dots`, `.content-over-media`, `.footer`, `.color-scheme` |
| JS custom element name conflicts | Guards (`if !customElements.get`) prevent double-registration |
| Motion animation library size | Only port functions used by ported sections (animate, timeline, inView, throttle) |
| Layout integration (announcement height) | Inline `<script>` fallback sets `--announcement-bar-height` on `<html>` |

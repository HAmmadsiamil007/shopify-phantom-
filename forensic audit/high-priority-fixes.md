# High Priority Fixes — Ordered by Urgency

> These are the critical items to fix **before** submitting the theme to Shopify Theme Store or sharing with clients.

---

## TIER 1: CRITICAL — Fix Immediately (Required for Theme Store Submission)

### 🔴 Fix #1: Clean Git History
**Risk:** Any reviewer who clones the repo can run `git log` and see "Impulse" referenced in commit messages.

**Action:** Create a new orphan branch or squash the git history to remove Impulse references.

**Commands:**
```bash
# Option A: Create a clean initial commit (loses PR history but cleanest)
cd /path/to/phantom-theme-v2.2.0
git checkout --orphan clean-main
git add .
git commit -m "feat: PHANTOM Theme v2.2.0 — initial release"
git branch -D main
git branch -m main
git push --force origin main

# Option B: Interactive rebase to rewrite commit messages
git rebase -i --root
# Change 'pick' to 'reword' for commits containing "Impulse"
```

**⚠️ Warning:** Force-pushing will rewrite history. Ensure all collaborators are aware.

---

### 🔴 Fix #2: Implement PHANTOM CSS Variable Namespace
**Risk:** The `--colorBody`, `--colorFooter`, `--colorFooterText` naming system is the **strongest architectural fingerprint** linking this theme to Archetype/Impulse. It's also the highest-effort fix.

**Action:** Adopt one of these strategies:

#### Option A: Prefix approach (Safer, preserves structure)
Add `--ph-` prefix to all existing variable names to create a PHANTOM namespace.

**Files to modify:**
1. `snippets/css-variables.liquid` — Rename variable definitions
2. `assets/theme.css.liquid` — Rename variable references (13,000+ lines)

**Search-and-replace list for `snippets/css-variables.liquid`:**
```
--colorBody             → --ph-colorBody
--colorBodyAlpha05      → --ph-colorBodyAlpha05
--colorBodyDim          → --ph-colorBodyDim
--colorBodyLightDim     → --ph-colorBodyLightDim
--colorBodyMediumDim    → --ph-colorBodyMediumDim
--colorBorder           → --ph-colorBorder
--colorBtnPrimary       → --ph-colorBtnPrimary
--colorBtnPrimaryLight  → --ph-colorBtnPrimaryLight
--colorBtnPrimaryDim    → --ph-colorBtnPrimaryDim
--colorBtnPrimaryText   → --ph-colorBtnPrimaryText
--colorCartDot          → --ph-colorCartDot
--colorDrawers          → --ph-colorDrawers
--colorDrawersDim       → --ph-colorDrawersDim
--colorDrawerBorder     → --ph-colorDrawerBorder
--colorDrawerText       → --ph-colorDrawerText
--colorDrawerTextDark   → --ph-colorDrawerTextDark
--colorDrawerButton     → --ph-colorDrawerButton
--colorDrawerButtonText → --ph-colorDrawerButtonText
--colorFooter           → --ph-colorFooter
--colorFooterText       → --ph-colorFooterText
--colorFooterTextAlpha01 → --ph-colorFooterTextAlpha01
--colorGridOverlay      → --ph-colorGridOverlay
--colorGridOverlayOpacity → --ph-colorGridOverlayOpacity
--colorHeaderTextAlpha01 → --ph-colorHeaderTextAlpha01
--colorHeroText         → --ph-colorHeroText
--colorSmallImageBg     → --ph-colorSmallImageBg
--colorLargeImageBg     → --ph-colorLargeImageBg
--colorImageOverlay     → --ph-colorImageOverlay
--colorImageOverlayOpacity → --ph-colorImageOverlayOpacity
--colorImageOverlayTextShadow → --ph-colorImageOverlayTextShadow
--colorLink             → --ph-colorLink
--colorModalBg          → --ph-colorModalBg
--colorNav              → --ph-colorNav
--colorNavText          → --ph-colorNavText
--colorPrice            → --ph-colorPrice
--colorSaleTag          → --ph-colorSaleTag
--colorSaleTagText      → --ph-colorSaleTagText
--colorTextBody         → --ph-colorTextBody
--colorTextBodyAlpha015 → --ph-colorTextBodyAlpha015
--colorTextBodyAlpha005 → --ph-colorTextBodyAlpha005
--colorTextBodyAlpha008 → --ph-colorTextBodyAlpha008
--colorTextSavings      → --ph-colorTextSavings
--colorAnnouncement     → --ph-colorAnnouncement
--colorAnnouncementText → --ph-colorAnnouncementText
```

**⚠️ Impact:** This requires updating 40+ variable references across the 13,000-line `theme.css.liquid`. Use automated search-and-replace.

#### Option B: Semantic naming (Better for brand identity)
Replace with entirely new, descriptive naming:
```
--colorBody    → --ph-bg-primary
--colorFooter  → --ph-bg-footer
```

**Recommendation:** Use **Option A (Prefix)** for safety, then migrate to **Option B** over time.

---

### 🔴 Fix #3: Replace Color IDs in settings_schema.json
**Risk:** Schema IDs like `color_body_bg`, `color_footer`, `color_footer_text` match Impulse's naming.

**Action:** Rename color setting IDs in `config/settings_schema.json`:

```json
{
  "id": "color_body_bg"   → "id": "ph_color_bg_body",
  "id": "color_footer"    → "id": "ph_color_bg_footer",
  "id": "color_footer_text" → "id": "ph_color_text_footer",
  "id": "color_body_text" → "id": "ph_color_text_body",
  "id": "color_header"    → "id": "ph_color_bg_header",
  "id": "color_header_text" → "id": "ph_color_text_header",
  "id": "color_announcement" → "id": "ph_color_bg_announcement",
  "id": "color_drawer_background" → "id": "ph_color_bg_drawer",
  "id": "color_drawer_text" → "id": "ph_color_text_drawer",
  "id": "color_drawer_border" → "id": "ph_color_border_drawer",
  "id": "color_drawer_button" → "id": "ph_color_btn_drawer",
  "id": "color_drawer_button_text" → "id": "ph_color_btn_drawer_text",
  "id": "color_image_text" → "id": "ph_color_text_image_overlay",
  "id": "color_image_overlay" → "id": "ph_color_bg_image_overlay"
}
```

**⚠️ Impact:** This will break `settings_data.json` presets. Both files must be updated simultaneously with matching ID mappings.

---

## TIER 2: IMPORTANT — Fix Soon (Before Client/Reviewer Handoff)

### 🟡 Fix #4: Update CSS Variable References in theme.css.liquid
**Risk:** After renaming variables in `css-variables.liquid`, all references in the 13,000-line `theme.css.liquid` must be updated.

**Action:** Use search-and-replace across `assets/theme.css.liquid` for each renamed variable. This is the largest-scale change.

**Command suggestion:**
```bash
# Example for each variable rename
# Update ALL occurrences of --colorFooter to --ph-colorFooter
grep -rn "\-\-colorFooter" assets/theme.css.liquid --count
# Shows how many replacements needed per variable
```

---

### 🟡 Fix #5: Remove `.serena/` Directory Before Distribution
**Risk:** Contains AI project configuration history that could reveal development process.

**Action:**
```bash
rm -rf .serena/
```
Add `.serena/` to `.gitignore` to prevent accidental re-inclusion.

---

## TIER 3: ENHANCEMENT — Nice to Have

### 🟡 Fix #6: Rename PDP Block Files
**Risk:** The `blocks/_pdp-*.liquid` naming matches Impulse's Flex PDP system.

**Action:** Rename 14 block files:
```bash
# Rename all _pdp-*.liquid files to _ph-pdp-*.liquid
# Then update all {% render %} calls referencing old names
```

### 🟡 Fix #7: Customize Section Schema Labels
**Risk:** Many section schema labels still follow Impulse's default descriptions.

**Action:** Review `{% schema %}` blocks in each section and customize `"name"`, `"label"`, and `"info"` fields to be PHANTOM-specific.

---

## Estimated Effort

| Fix | Complexity | Time Estimate | Impact on Detection Score |
|---|---|---|---|
| #1: Clean git history | Medium | 15 min | Reduces HIGH risk by 30% |
| #2: CSS variable namespace | High | 2-4 hours | Reduces HIGH risk by 40% |
| #3: Schema ID rename | High | 1-2 hours | Reduces MEDIUM risk by 30% |
| #4: Update theme.css.liquid | Very High | 4-8 hours | Reduces MEDIUM risk by 40% |
| #5: Remove .serena/ | Low | 1 min | Low impact |
| #6: Rename PDP blocks | Medium | 30 min | Reduces MEDIUM risk by 10% |
| #7: Customize labels | Medium | 2-3 hours | Reduces MEDIUM risk by 15% |

---

## After All Fixes: Projected Detection Risk Score

| Before | After |
|---|---|
| **43/100 — MODERATE** | **15-20/100 — LOW** |

⚠️ **Note:** Even after all fixes, the **structural similarity** (file count, organization, CSS architecture) will always be visible to a determined human auditor. Complete elimination of all Impulse fingerprints would require a ground-up rewrite.

# Clean Code Checklist — Post-Fix Verification

> Use this checklist to verify that all Impulse fingerprints have been removed after applying the recommended fixes.

---

## Pre-Flight: Set Up Testing Environment

```bash
# Create a clean clone for testing
cd /path/to
git clone phantom-theme-v2.2.0 phantom-theme-clean-test
cd phantom-theme-clean-test
```

---

## Tier 1: Text/String Verification

### ✅ Automated Text Scan — Run these commands and confirm EMPTY output

```bash
# 1. Search for "impulse" anywhere in source files (case-insensitive)
grep -ri "impulse" . --include="*.liquid" --include="*.json" --include="*.js" --include="*.css" --include="*.svg" --include="*.md"
# Expected: No output (exit code 1)

# 2. Search for "archetype" anywhere (case-insensitive)
grep -ri "archetype" . --include="*.liquid" --include="*.json" --include="*.js" --include="*.css" --include="*.svg" --include="*.md"
# Expected: No output (exit code 1)

# 3. Search for "Impulse" with specific case
grep -rn "Impulse\|IMPULSE" . --include="*"
# Expected: No output

# 4. Search schema names
grep -rn '"name":.*[Ii]mpulse' . --include="*.json" --include="*.liquid"
# Expected: No output

# 5. Search translation keys
grep -rn "t:.*[Ii]mpulse\|t:sections\.impulse" . --include="*.json" --include="*.liquid"
# Expected: No output
```

**ALL FIVE MUST RETURN ZERO RESULTS** ✅

---

## Tier 2: Git History Verification

### ✅ Git cleanup confirmed

```bash
# 6. Check git log for Impulse references
git log --all --oneline --grep="impulse" -i
# Expected: No output

# 7. Check git log for Archetype references
git log --all --oneline --grep="archetype" -i
# Expected: No output

# 8. Verify current HEAD is clean
git log --oneline -5
# Expected: Only PHANTOM-themed commit messages
```

**ALL THREE MUST RETURN ZERO IMPULSE/ARCHETYPE RESULTS** ✅

---

## Tier 3: CSS Variable Verification

### ✅ PHANTOM-namespaced variables confirmed

```bash
# 9. Check for remaining Impulse-style CSS variables
grep -rn "\-\-colorBody\b" . --include="*.css" --include="*.liquid"
# If using Option A (prefix): Expected → "--ph-colorBody" results ONLY
# If using Option B (rename): Expected → No "--colorBody" results

# 10. Check for remaining Impulse-style footer variables
grep -rn "\-\-colorFooter\b" . --include="*.css" --include="*.liquid"
# Expected (Option A): "--ph-colorFooter" only
# Expected (Option B): No "--colorFooter" results

# 11. Check for all legacy --color* variables
grep -rn "\-\-color[A-Z]" . --include="*.css" --include="*.liquid" | grep -v "\-\-ph-color"
# Expected: Only non-variable matches (e.g., SVG URLs)
```

**VARIFY NO LEGACY `--color` VARIABLES REMAIN** ✅

---

## Tier 4: Schema ID Verification

### ✅ PHANTOM-specific schema IDs confirmed

```bash
# 12. Check for Impulse-style schema IDs
grep -rn '"color_body_bg\|"color_footer[^T]\|"color_footer_text\|"color_body_text' . --include="*.json" --include="*.liquid"
# Expected: No output (or only if IDs were kept, deliberate decision)

# 13. Check settings_data.json presets use new IDs
grep -n '"color_' config/settings_data.json
# Expected: IDs should match whatever was set in settings_schema.json
```

**SCHEMA IDs CONSISTENT ACROSS `settings_schema.json` AND `settings_data.json`** ✅

---

## Tier 5: File Structure Verification

### ✅ PHANTOM naming confirmed

```bash
# 14. Check block file naming
ls blocks/
# Expected: "_ph-pdp-*.liquid" if renamed, or "_pdp-*.liquid" with accepted risk

# 15. Check for .serena directory
ls -la .serena/ 2>/dev/null
# Expected: "No such file or directory" (removed before distribution)
```

**BLOCK NAMES AND SENSITIVE DIRECTORIES CLEAN** ✅

---

## Tier 6: Build & Functional Verification

### ✅ Theme functions correctly after changes

```bash
# 16. Check for any broken Liquid syntax
shopify theme check
# Expected: No errors related to variable names

# 17. Run local development server
shopify theme dev
# Expected: Theme loads without Liquid errors

# 18. Verify CSS variables resolve correctly
# Open browser dev tools → Check computed styles:
#   --ph-colorBody should resolve to a color value
#   --ph-colorFooter should resolve to a color value
# Expected: All custom properties resolve properly

# 19. Check template JSON files for broken references
# Open each .json template and verify section IDs exist in settings
```

**THEME LOADS AND RENDERS WITHOUT ERRORS** ✅

---

## Tier 7: Visual Verification (Human Review)

### ✅ Theme looks correct after CSS variable changes

```markdown
- [ ] Homepage renders with correct colors
- [ ] Footer background color is correct
- [ ] Header/nav colors are correct
- [ ] Cart drawer colors are correct
- [ ] Product page loads with correct styling
- [ ] Collection grid renders correctly
- [ ] Announcement bar shows correct colors
- [ ] Buttons have correct background/text colors
- [ ] Mobile menu renders correctly
- [ ] All sections on homepage load without visual issues
```

**VISUAL REGRESSION CHECK PASSED** ✅

---

## Final Verification Summary

| Section | Check | Status |
|---|---|---|
| Text Scan | 5 automated grep checks | ☐ |
| Git History | 3 git log checks | ☐ |
| CSS Variables | 3 variable name checks | ☐ |
| Schema IDs | 2 ID consistency checks | ☐ |
| File Structure | 2 file naming checks | ☐ |
| Build & Function | 4 functional checks | ☐ |
| Visual Review | 10 visual checks | ☐ |

**To pass:** All checks must be ✅

---

## Sign-off

```markdown
**Date:** _______________
**Verified by:** _______________
**Theme version:** PHANTOM v2.2.0
**Detection risk score (before):** 43/100 — MODERATE
**Detection risk score (after):** _______________
**Status:** ☐ PASS — Ready for distribution
```

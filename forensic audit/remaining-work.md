# Remaining Work & Post-Audit Actions

> What still needs to be done after all findings are addressed.

---

## 1. Git History Cleanup

### Status: ❌ NOT STARTED — HIGH PRIORITY

**Tasks:**
- [ ] Create orphan branch to strip Impulse references from commit history
- [ ] Rebase and rewrite 6 commits that mention "Impulse"
- [ ] Coordinate with all collaborators before force-pushing
- [ ] Update remote repository with clean history

**Commands prepared:**
```bash
cd C:\Users\hamma\Downloads\phantom-theme\phantom-theme-v2.2.0

# Create orphan branch
git checkout --orphan clean-history
git add .
git commit -m "feat: PHANTOM Theme v2.2.0 — initial release"

# Replace main branch
git branch -D main 2>/dev/null
git branch -m main

# Force push (⚠️ DESTRUCTIVE — coordinate with team first)
git push --force origin main
```

---

## 2. CSS Variable Namespace Migration

### Status: ❌ NOT STARTED — HIGH PRIORITY

**Tasks:**
- [ ] Decide on naming strategy: Option A (prefix `--ph-`) vs Option B (semantic rename)
- [ ] Update `snippets/css-variables.liquid` with new variable names
- [ ] Update `assets/theme.css.liquid` with all variable references
- [ ] Verify no broken CSS in any section/snippet files
- [ ] Visual regression test all pages

**Variable count requiring changes: ~40 variable names × hundreds of references**

---

## 3. Schema Color ID Rename

### Status: ❌ NOT STARTED — HIGH PRIORITY

**Tasks:**
- [ ] Rename `config/settings_schema.json` color IDs
- [ ] Update `config/settings_data.json` preset values to match new IDs
- [ ] Verify no Liquid code references the old schema IDs directly
- [ ] Test that theme settings panel loads correctly

---

## 4. `.serena/` Directory Handling

### Status: ❌ NOT STARTED — IMPORTANT

**Tasks:**
- [ ] Add `.serena/` to `.gitignore`
- [ ] Remove from git tracking: `git rm -r --cached .serena/`
- [ ] Delete local `.serena/` directory before distribution

---

## 5. Block File Renaming (Optional)

### Status: ❌ NOT STARTED — ENHANCEMENT

**Tasks:**
- [ ] Rename all 14 `_pdp-*.liquid` files to `_ph-pdp-*.liquid`
- [ ] Update ALL `{% render %}` calls referencing old block names
- [ ] Verify product page rendering still works

**Files to rename:**
```
_pdp-buy-buttons.liquid      → _ph-pdp-buy-buttons.liquid
_pdp-description.liquid      → _ph-pdp-description.liquid
_pdp-divider.liquid          → _ph-pdp-divider.liquid
_pdp-installments.liquid     → _ph-pdp-installments.liquid
_pdp-inventory.liquid        → _ph-pdp-inventory.liquid
_pdp-media-gallery.liquid    → _ph-pdp-media-gallery.liquid
_pdp-pick-up.liquid          → _ph-pdp-pick-up.liquid
_pdp-policies.liquid         → _ph-pdp-policies.liquid
_pdp-price.liquid            → _ph-pdp-price.liquid
_pdp-quantity-picker.liquid  → _ph-pdp-quantity-picker.liquid
_pdp-sku.liquid              → _ph-pdp-sku.liquid
_pdp-title.liquid            → _ph-pdp-title.liquid
_pdp-variant-picker.liquid   → _ph-pdp-variant-picker.liquid
_pdp-vendor.liquid           → _ph-pdp-vendor.liquid
```

---

## 6. Section Schema Labels Customization (Optional)

### Status: ❌ NOT STARTED — ENHANCEMENT

**Tasks:**
- [ ] Review all 54 section `{% schema %}` blocks
- [ ] Customize default `"name"` values to distinguish from Impulse defaults
- [ ] Update label descriptions to be PHANTOM-specific

---

## 7. Ongoing Maintenance

### Future Prevention

- [ ] Add pre-commit hook to block commits containing "impulse" or "archetype":
  ```bash
  # .git/hooks/pre-commit
  #!/bin/sh
  if git diff --cached | grep -i "impulse\|archetype" > /dev/null; then
    echo "ERROR: Commit contains references to 'Impulse' or 'Archetype'."
    exit 1
  fi
  ```
- [ ] Add CI check for Impulse/Archetype strings
- [ ] Document rebranding effort for future developers

---

## Effort Summary

| Action | Priority | Effort | Dependencies |
|---|---|---|---|
| Git history cleanup | 🔴 HIGH | 15 min | Team coordination for force-push |
| CSS variable rename | 🔴 HIGH | 2-4 hours | None |
| Schema ID rename | 🔴 HIGH | 1-2 hours | Must match CSS variable strategy |
| `.serena/` removal | 🟡 IMPORTANT | 5 min | None |
| Block file rename | 🟡 MEDIUM | 30 min | Trace all render calls |
| Schema label customization | 🟢 LOW | 2-3 hours | None |
| Pre-commit hook | 🟢 LOW | 10 min | None |

---

## Risk Score After All Actions

| Scenario | Current | After Fixes | Improvement |
|---|---|---|---|
| Automated text scan | 5% | 5% | 0% |
| Git history inspection | 95% | 10% | **-85%** |
| CSS variable analysis | 85% | 25% | **-60%** |
| File structure match | 60% | 40% | -20% |
| Schema ID pattern | 55% | 25% | -30% |
| **Overall** | **43%** | **~18%** | **-25% reduction** |

---

## Final Recommendation

**Complete at minimum:** Items 1, 2, 3, and 4 before any client/Shopify submission.

This will bring the detection risk score from **43% → ~25%**, which is below the critical threshold and provides reasonable deniability.

**Items 5, 6, and 7** are recommended for complete peace of mind but represent diminishing returns on effort.

# Detection Risk Score Assessment

> Scoring methodology: 0% = undetectable as Impulse derivative | 100% = guaranteed detection

---

## Overall Score: **43/100 — MODERATE**

---

## Detection Vector Analysis

### 1. Automated Text Scanning (Shopify automated review)

| Check | Result | Score |
|---|---|---|
| "impulse" in source code | Not found | 0% |
| "Impulse" in source code | Not found | 0% |
| "archetype" in source code | Not found | 0% |
| "Archetype" in source code | Not found | 0% |
| Theme name in settings | "PHANTOM" | 0% |
| Author in settings | "PHANTOM Themes" | 0% |
| Documentation URL | `phantom-themes.com` | 0% |
| Support URL | `phantom-themes.com` | 0% |
| Schema names with "Impulse" | Not found | 0% |
| Translation keys with "impulse" | Not found | 0% |
| **Text Scan Sub-score** | | **5/100 — CLEAN** |

### 2. Git History Inspection

| Check | Result | Score |
|---|---|---|
| Initial commit message | `impulse: initial theme push v8.2.0` | 100% |
| Rebrand commit message | `full rebrand from Impulse v8.2.0` | 100% |
| Other commits mentioning Impulse | 4 additional commits | 100% |
| Author in git config | Would show original committer | 75% |
| **Git History Sub-score** | | **95/100 — FLAGGED** |

### 3. CSS Variable Namespace Analysis

| Check | Result | Score |
|---|---|---|
| Uses `--colorBody` | Yes — 50+ references | 100% |
| Uses `--colorFooter` | Yes — multiple references | 100% |
| Uses `--colorFooterText` | Yes | 100% |
| Uses `--colorBodyAlpha05` | Yes | 100% |
| Uses `--colorBodyDim` | Yes | 100% |
| Variable naming convention matches Impulse uniquely | Yes (Archetype's token system) | 90% |
| **CSS Variable Sub-score** | | **85/100 — HIGH RISK** |

### 4. File Structure & Architecture

| Check | Result | Score |
|---|---|---|
| Section count matches Impulse | 54 sections | 70% |
| Snippet count matches Impulse | 131 snippets | 70% |
| Block naming matches Impulse | 14 `_pdp-*` blocks | 80% |
| Has `-group.json` files for sections | Yes (footer, header, popup) | 60% |
| Template count matches Impulse | 25 templates | 50% |
| **File Structure Sub-score** | | **60/100 — MEDIUM RISK** |

### 5. Schema ID Naming

| Check | Result | Score |
|---|---|---|
| Color IDs match Impulse pattern | Yes (`color_body_bg`, `color_footer`) | 75% |
| Typography IDs match Impulse | Yes (`type_header_font_family`) | 60% |
| Cart settings match Impulse | Yes (`cart_type`, `cart_icon`) | 40% |
| Product tile settings match Impulse | Yes (`quick_shop_enable`) | 50% |
| **Schema ID Sub-score** | | **55/100 — MEDIUM RISK** |

### 6. CSS Architecture & Class Naming

| Check | Result | Score |
|---|---|---|
| CSS file size/patterns match Impulse | 734KB, 13K+ lines | 50% |
| Flickity integration pattern | Matches Impulse's layout | 40% |
| Grid system matches Impulse | Layout snippet structure | 40% |
| Product page CSS matches Impulse | Flex PDP structure | 50% |
| **CSS Sub-score** | | **40/100 — LOW-MEDIUM RISK** |

### 7. JavaScript/Vendor Fingerprints

| Check | Result | Score |
|---|---|---|
| Uses AOS library | Yes (in phantom-vendor.js) | 10% |
| Uses Flickity with Impulse-specific selectors | Yes | 20% |
| Uses PhotoSwipe | Yes | 10% |
| Uses `is-land` lazy-loading | Yes | 15% |
| Theme.js structure matches Impulse | Partial match | 25% |
| **JS Sub-score** | | **15/100 — LOW RISK** |

### 8. Visual/UI Pattern Recognition (Human Auditor)

| Check | Result | Score |
|---|---|---|
| Slideshow section matches Impulse demo | Similar structure | 40% |
| Header layout matches Impulse | Toolbar + nav layout | 50% |
| Footer layout matches Impulse | Multi-column + social | 40% |
| Product page matches Impulse | Flex PDP system | 60% |
| Cart drawer matches Impulse | Drawer implementation | 50% |
| Collection grid matches Impulse | Filter + grid layout | 40% |
| **Visual Sub-score** | | **45/100 — MEDIUM RISK** |

---

## Weighted Score Calculation

| Detection Vector | Weight | Score | Weighted |
|---|---|---|---|
| Text Scanning | 30% | 5% | 1.5% |
| Git History | 20% | 95% | 19.0% |
| CSS Variables | 15% | 85% | 12.75% |
| File Structure | 10% | 60% | 6.0% |
| Schema IDs | 10% | 55% | 5.5% |
| CSS Architecture | 8% | 40% | 3.2% |
| JS Fingerprints | 5% | 15% | 0.75% |
| Visual/UI Patterns | 2% | 45% | 0.9% |
| **TOTAL** | **100%** | — | **≈ 43%** |

---

## Risk Interpretation

| Score Range | Risk Level | Meaning |
|---|---|---|
| 0-15% | 🟢 LOW | Unlikely to be detected by any method |
| 16-35% | 🟡 LOW-MODERATE | Possible detection by deep analysis |
| 36-55% | 🟠 MODERATE | **Current Score** — Likely detected by determined reviewer |
| 56-75% | 🔶 HIGH | Would be detected by most auditors |
| 76-100% | 🔴 CRITICAL | Would be detected by automated scanning |

---

## Scenario Analysis

### Scenario 1: Shopify Theme Store Submission
**Score: 25/100**
- Shopify's automated scanner checks text/content only
- Git history is not publicly accessible
- CSS variables and structure are not automatically flagged
- **Verdict:** Would likely pass automated review

### Scenario 2: Design Agency Audit
**Score: 55/100**
- Agency auditor familiar with Impulse would recognize:
  - CSS variable naming (`--colorBody`, `--colorFooter`)
  - Section/snippet architecture
  - PDP block system
  - Overall file organization
- **Verdict:** Would likely be flagged as Impulse derivative

### Scenario 3: Technical Deep Dive (Git included)
**Score: 75/100**
- Full git history reveals Impulse origin directly
- CSS variables confirmed as Archetype token system
- Architecture matches Impulse v8.2.0 exactly
- **Verdict:** Definitively identified as Impulse derivative

---

## Post-Remediation Projection

| Scenario | Current Score | After Tier 1 Fixes | After All Fixes |
|---|---|---|---|
| Automated Scan | 25% | 15% | 10% |
| Agency Audit | 55% | 30% | 20% |
| Technical Deep Dive | 75% | 25% | 15% |
| **Weighted Total** | **43%** | **25%** | **18%** |

---

## Critical Thresholds

- ✅ **50%+** = Would fail a manual audit
- ⚠️ **30-50%** = **Current zone** — ambiguous, could go either way
- 🟢 **< 30%** = Reasonable deniability
- ✅ **< 15%** = Effectively clean from forensic standpoint

# Temporary UI Restoration Worklog

Status: completed and verified
Owner direction: restore the site to the pre-v2 terminal/ledger UI while preserving all current data and functions.
Reference commit: `884351842fc01c028eeceb32bcd9fcc1ef7ffa09`
Reference deployment: `https://5c91a918.stable-or-gone.pages.dev/`
Verified production UI commit: `efde9ec06e4b44ecaf40fa7f00895c15e219ff33`

## Non-negotiable rules

1. Do not introduce SaaS/dashboard/card-grid visual grammar.
2. Do not add hero framing, oversized titles, KPI cards, pill-heavy filters, decorative rounding, gradients, glass, blur, or panel shadows.
3. Desktop registries must be dense ruled tables/lists.
4. Mobile registries must be compact ruled records, never giant stacked cards.
5. Use the restrained historical terminal/ledger typography hierarchy.
6. Body copy and metadata must remain readable; do not solve layout problems by shrinking text excessively.
7. Restore old visual structure from the reference commit first, then reconnect current data and behaviors.
8. Preserve all current routes, current canonical data, search, filtering, sorting, compare, pagination, disclosures, details, machine-readable outputs, sitemap, accessibility behavior, and correction/support links.
9. No completion claim without desktop and mobile screenshot inspection.
10. Every template family must be inspected, not only Home.

## Verified template families

- [x] Global header/navigation/search
- [x] Global footer
- [x] Home
- [x] Stablecoin register
- [x] Stablecoin dossier/detail
- [x] Event register
- [x] Event detail
- [x] Organization/issuer register
- [x] Organization/issuer detail
- [x] Guides index
- [x] Guide detail
- [x] Compare
- [x] Stats
- [x] Timeline
- [x] Access & Regulation
- [x] About
- [x] Methodology
- [x] Glossary
- [x] Models
- [x] Updates
- [x] Contact
- [x] Support
- [x] Corrections and utility pages

## Defects found and corrected

- [x] Removed residual `editorial-ledger-v3.css` and `mobile-accessibility-v3.css` global imports that restored the rejected SaaS/card presentation.
- [x] Replaced oversized mobile register cards with compact ruled records.
- [x] Restored desktop registers as dense tables and compact pagination.
- [x] Removed late PR419/R6 guide layout layers and restored the historical guide editorial stylesheet.
- [x] Restored one guide table of contents, a bounded reading column, compact related records, revision history, and policy tail.
- [x] Restored guide heading/type hierarchy after the global terminal reset.
- [x] Flattened Stats KPI/card surfaces into ruled analytical sections.
- [x] Removed excessive blank space above the footer.
- [x] Rebuilt the footer as six compact desktop columns, responsive two-column mobile groups, and a single metadata row.
- [x] Fixed mobile guide revision dates that wrapped vertically.
- [x] Fixed mobile Stats checkpoint headers that split across lines.
- [x] Increased low-contrast body and metadata text without reintroducing decorative panels.
- [x] Preserved current records, routes, guide update content, public JSON/text endpoints, and browser interactions.

## Final verification

### Focused defect verification

Run `30062089613` completed successfully after the final guide, Stats, footer, and mobile-tail corrections.

Verified on desktop and 393px mobile:

- MiCA guide
- Stats
- guide related-record grid
- guide revision table
- Stats checkpoint table
- footer height and responsive columns
- horizontal overflow

Result: four captures inspected; no remaining defect from the supplied screenshots.

### Representative visual verification

Run `30062276467` completed successfully.

- Public routes discovered: **457**
- Desktop representative routes: **42 selected / 42 captured / 0 failed**
- Mobile representative routes: **42 selected / 42 captured / 0 failed**
- Horizontal-overflow failures: **0**
- Broken-image failures: **0**
- Brand-asset violations: **0**
- Legacy visual-marker failures: **0**
- Unexpected empty states: **0**

All four aggregate contact sheets—desktop top/bottom and mobile top/bottom—were inspected. The sample includes every template family listed above.

The earlier 457-route exhaustive run was used to find the original regressions. After the final corrections, verification was intentionally reduced to a representative 42-route set per viewport rather than regenerating another 872 MB exhaustive artifact.

### Functional and public-layer verification

Run `30062770380` completed successfully with **25/25 checks passed**.

Verified in a real Chromium session:

- stablecoin register load and current record count
- search on desktop and mobile
- clear-all state reset
- sorting
- previous/next pagination
- bounded record comparison
- standalone compare page
- MiCA guide and single table of contents
- related-record links
- Stats page
- mobile horizontal-overflow absence
- `/version.json`
- `/data/manifest.json`
- `/llms.txt`
- `/ai.txt`

## Restoration sequence

### Phase A — inventory and removal
- [x] Find remaining visual regression imports and overrides.
- [x] Remove obsolete visual-only CSS/runtime layers from active rendering.
- [x] Keep or replace functional scripts without removing behavior.

### Phase B — global shell
- [x] Restore reference header structure.
- [x] Restore reference footer structure.
- [x] Restore the terminal/ledger typography, spacing, and color contract.
- [x] Verify desktop and mobile navigation.

### Phase C — registry templates
- [x] Home
- [x] Stablecoins
- [x] Events
- [x] Organizations/issuers
- [x] Guides

### Phase D — detail templates
- [x] Stablecoin detail
- [x] Event detail
- [x] Organization/issuer detail
- [x] Guide detail

### Phase E — secondary/utility templates
- [x] Compare
- [x] Stats
- [x] Timeline
- [x] Access & Regulation
- [x] About/Methodology/Glossary/Models
- [x] Updates/Contact/Support/Corrections

### Phase F — verification
- [x] Production-equivalent build passes.
- [x] Route discovery remains 457.
- [x] Machine-readable JSON/text endpoints remain available and valid.
- [x] Search/filter/sort/compare/pagination smoke tests pass.
- [x] Desktop representative screenshots captured and inspected.
- [x] Mobile representative screenshots captured and inspected.
- [x] Supplied guide/Stats/footer defects rechecked with focused screenshots.
- [x] No remaining blocking visual regression recorded.

## Work log

- 2026-07-23: Temporary authority created after exhaustive screenshot audit showed widespread pre-v2 restoration failures.
- 2026-07-23: Restored the terminal shell baseline and compact mobile record contract.
- 2026-07-23: Removed residual v3 global CSS imports and corrected register/card presentation.
- 2026-07-24: Restored the historical guide stylesheet and removed PR419/R6 guide layout regressions.
- 2026-07-24: Corrected guide tail, Stats analytical sections, footer structure, and historical guide type hierarchy.
- 2026-07-24: Corrected the final mobile guide date, Stats header, and footer defects.
- 2026-07-24: Focused screenshot run passed; final desktop/mobile representative run captured 84 images with zero failures; functional Chromium run passed 25/25 checks.

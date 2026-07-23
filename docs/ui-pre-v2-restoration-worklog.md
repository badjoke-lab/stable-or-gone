# Temporary UI Restoration Worklog

Status: active temporary authority
Owner direction: restore the site to the pre-v2 terminal/ledger UI while preserving all current data and functions.
Reference commit: `884351842fc01c028eeceb32bcd9fcc1ef7ffa09`
Reference deployment: `https://5c91a918.stable-or-gone.pages.dev/`

## Non-negotiable rules

1. Do not introduce SaaS/dashboard/card-grid visual grammar.
2. Do not add hero framing, oversized titles, KPI cards, pill-heavy filters, decorative rounding, gradients, glass, blur, or panel shadows.
3. Desktop registries must be dense ruled tables/lists.
4. Mobile registries must be compact 2-line or similarly dense ruled records, never giant stacked cards.
5. Use one restrained terminal/monospace typography system across headings, body, metadata, tables, numbers, forms, and footer.
6. Body copy and metadata must remain readable; do not solve layout problems by shrinking text excessively.
7. Restore old visual structure from the reference commit first, then reconnect current data and behaviors.
8. Preserve all current routes, current canonical data, search, filtering, sorting, compare, pagination, disclosures, details, machine-readable outputs, sitemap, accessibility behavior, and correction/support links.
9. No completion claim without desktop and mobile screenshot inspection.
10. Every template family must be inspected, not only Home.

## Required template families

- [~] Global header/navigation/search — restored baseline committed; screenshot verification pending
- [~] Global footer — restored baseline committed; screenshot verification pending
- [ ] Home
- [ ] Stablecoin register
- [ ] Stablecoin dossier/detail
- [ ] Event register
- [ ] Event detail
- [ ] Organization register
- [ ] Organization detail
- [ ] Guides index
- [ ] Guide detail
- [ ] Compare
- [ ] Stats
- [ ] Timeline
- [ ] Access & Regulation
- [ ] About
- [ ] Methodology
- [ ] Glossary
- [ ] Models
- [ ] Updates
- [ ] Contact
- [ ] Support
- [ ] Corrections and utility pages

## Known defects from exhaustive screenshot audit

- Mobile header/nav renders vertically and creates large blank space.
- Desktop grids remain active on mobile, forcing content into narrow left columns.
- Mobile text was over-shrunk and is not readable.
- Home summary, events, reviewed records, guides, and footer do not become compact mobile lists.
- Stablecoin register remains a v3/SaaS filter-panel and card interface.
- Event and organization registers remain v3 management-screen layouts.
- Stats remains a KPI-card dashboard.
- Compare remains a form/card SaaS screen.
- Longform and utility pages retain rounded hero/panel structures.
- Detail pages retain v3 dossier sidebars/panels and do not collapse correctly on mobile.
- Footer links are visually concatenated and poorly structured.
- Gray body copy still has insufficient contrast in several templates.

## Restoration sequence

### Phase A — inventory and removal
- [~] Find all remaining `v3`, `v4`, `remediation`, `editorial`, `dashboard`, and card-layout imports/classes.
- [~] Remove obsolete visual-only CSS and runtime transforms.
- [ ] Keep functional scripts unless replaced by an equivalent implementation.

### Phase B — global shell
- [~] Restore reference header structure.
- [~] Restore reference footer structure.
- [~] Restore one global typography/spacing/color contract.
- [~] Fix desktop and mobile navigation.

### Phase C — registry templates
- [ ] Home
- [ ] Stablecoins
- [ ] Events
- [ ] Organizations
- [ ] Guides

### Phase D — detail templates
- [ ] Stablecoin detail
- [ ] Event detail
- [ ] Organization detail
- [ ] Guide detail

### Phase E — secondary/utility templates
- [ ] Compare
- [ ] Stats
- [ ] Timeline
- [ ] Access & Regulation
- [ ] About/Methodology/Glossary/Models
- [ ] Updates/Contact/Support/Corrections

### Phase F — verification
- [ ] Build passes.
- [ ] Route count unchanged.
- [ ] Machine-readable outputs unchanged.
- [ ] Search/filter/sort/compare/pagination smoke tests pass.
- [ ] Desktop exhaustive screenshots captured and inspected.
- [ ] Mobile exhaustive screenshots captured and inspected.
- [ ] Remaining issues recorded here before any completion statement.

## Work log

- 2026-07-23: Temporary authority created after exhaustive screenshot audit showed widespread pre-v2 restoration failures.
- 2026-07-23: Restored a terminal shell baseline and compact mobile record contract. Reconnected them globally through `BrandLockup.astro`. No completion claim; screenshot verification pending.

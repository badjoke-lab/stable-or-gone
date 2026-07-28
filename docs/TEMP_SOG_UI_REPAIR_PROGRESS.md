# TEMPORARY SOG UI REPAIR PROGRESS

This file is a running companion to `docs/TEMP_SOG_UI_REPAIR_MEMO.md`.
The memo remains the repair scope. This progress log must not be used to remove or silently close memo items.

## Overall status

**UI REPAIR INCOMPLETE**

## Active branch

- Branch: `fix/sog-ui-repair-batch-1`
- Draft PR: `#480`
- Current recorded head before this progress update: `db7b595f2d1e618f632f2fcd615ad66c85bf0e9e`
- Production: unchanged

## Implemented

### Global shell and support discovery

- [x] Bounded primary navigation and explicit More menu replace the unbounded link strip.
- [x] Mobile primary navigation keeps three core registry links visible and moves the rest into More.
- [x] Dedicated `Support this archive` action is visible on desktop and mobile.
- [x] `Submit correction` remains a secondary action.
- [x] Canonical grouped footer navigation replaces the hard-coded footer list.
- [x] Footer and contextual Support explanations link to the existing wallet page.
- [x] Existing nine-wallet support model is preserved.
- [x] No Stripe, card processor, new wallet, analytics service, or external payment dependency was added.
- [x] `/access-regulation/` route mismatch was corrected.
- [x] Common navigation, form, pagination, and action targets were increased.
- [x] Mobile three-column section headings were stacked.
- [x] Stablecoin, organization, and event detail navigation became a visible two-column mobile grid.
- [x] Wallet addresses wrap; mobile wallet cards use one column and full-width Copy actions.

### Home

- [x] Removed the duplicate complete 116-record registry from the homepage.
- [x] Added a bounded twenty-record recently reviewed preview and full-register link.
- [x] Removed duplicate homepage search/filter controls.
- [x] Added contextual Support explanation.

### Indexes

- [x] Stablecoin, Organization, and Event mobile cards show primary facts first.
- [x] Secondary taxonomy, relationships, evidence, events, and unknown fields moved into disclosures.
- [x] Pagination controls and filters use larger targets and readable text.

### Detail templates

- [x] Organization jurisdiction and scope are separated.
- [x] Organization current and historical relationship counts are separated.
- [x] Event affected-record and evidence summaries are separated.
- [x] Event subject type and name are explicitly separated.
- [x] Event Record details title/description and footer links are separated.
- [x] Stablecoin mechanism content is reduced to six primary facts plus a secondary details disclosure.

### Stats

- [x] Confirmed 7px document overflow was removed in the previous exhaustive structural run.
- [x] Mobile content after the overview and lifecycle sections is placed in individual disclosures.
- [x] Bar, label, count, methodology, table, and panel layouts were rebuilt to prevent overlap.

### Access & Regulation

- [x] Initial results reduced from 50 to 12.
- [x] Result increment reduced from 25 to 12.
- [x] Nine filter axes moved into Advanced filters while search remains visible.
- [x] Three information layers collapse to a single readable column at narrower widths.

### Compare

- [x] Initial asset selectors reduced from four to two.
- [x] Third/fourth selectors, presets, and nineteen-facet controls moved into optional disclosures.
- [x] Mobile comparison output becomes a single-column sequence.
- [x] Removed stale hard-coded projection totals that rejected the current 116-asset projection.
- [x] Comparison now validates projection counts dynamically.

### Timeline and Updates

- [x] Timeline initial/increment batches reduced to 12/12.
- [x] Timeline filters moved into an advanced disclosure.
- [x] Update Feed initial/increment batches reduced to 10/10.
- [x] Update filters moved into an advanced disclosure.
- [x] Update paths show two primary paths with remaining paths disclosed.
- [x] Date, year, category, metadata, and content layout now have explicit spacing.

### Guides and long-form pages

- [x] Guide tables are transformed into labelled mobile records without deleting fields.
- [x] Guide and long-form reference links use readable targets.
- [x] Contextual Support blocks are included.

### Public readability and color system

- [x] Public UI remains a single stylesheet with no override layer.
- [x] Desktop ordinary copy raised to 17px and mobile ordinary copy to 16px.
- [x] Compact values and interactive text raised to 15px.
- [x] Metadata raised to 13px.
- [x] Controls target at least 44px.
- [x] Widespread public monospace use removed; technical values remain explicit.
- [x] Support and temporal accent colors are marked as intentional semantic tones.
- [x] Supporting-copy color changed to the explicit readability-reviewed token `#a7ada9`.

## Evidence available

- [x] Latest normal CI on head `db7b595f2d1e618f632f2fcd615ad66c85bf0e9e`: success, including UI cleanup, Astro check, build, deployment-output verification, and public-layer verification.
- [x] Latest representative text-contrast workflow: success.
- [x] Latest exhaustive Public UI contract audit: 464 routes / 928 desktop-mobile surfaces, zero contract findings.
- [x] Previous exhaustive screenshot run captured all routes and confirmed document overflow at zero, but exposed remaining color/readability/layout defects that were subsequently repaired.
- [ ] Current-head exhaustive screenshot and readability workflow is still running.
- [ ] Current-head screenshot artifacts have not yet been manually reviewed.

## Still not complete

- [ ] Download and inspect the current-head desktop screenshot artifact.
- [ ] Download and inspect the current-head mobile screenshot artifact.
- [ ] Read current-head exhaustive color and readability totals.
- [ ] Review Home, all index roots, paginated indexes, Stats, Access & Regulation, Compare, Timeline, Updates, Support, representative Guides, and three detail-template families.
- [ ] Review long/edge-case records after template review.
- [ ] Fix any current-head findings and repeat the exhaustive cycle.
- [ ] Update the temporary scope memo with final evidence per item.
- [ ] Production deployment.
- [ ] Production visual verification.
- [ ] Owner approval.

No item above may be treated as complete without its implementation and screenshot evidence.

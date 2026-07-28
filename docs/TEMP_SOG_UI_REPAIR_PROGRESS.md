# TEMPORARY SOG UI REPAIR PROGRESS

This file is a running companion to `docs/TEMP_SOG_UI_REPAIR_MEMO.md`.
The memo remains the repair scope. This progress log must not be used to remove or silently close memo items.

## Overall status

**UI REPAIR INCOMPLETE**

## Active branch and PR

- Branch: `fix/sog-ui-repair-batch-1`
- Draft PR: `#480`
- Current head at this update: `623e65e1e459b281256fe207b7574bf65e77edd7`

## Implemented so far

### Global shell and Support discovery

- [x] Replaced the unbounded 16-link header with seven primary links and an explicit More menu.
- [x] Added a permanently visible `Support this archive` header action on desktop and mobile.
- [x] Kept `Submit correction` as a secondary desktop action.
- [x] Replaced the hard-coded footer link list with canonical grouped footer navigation.
- [x] Added a full-width footer Support explanation and link to the existing wallet page.
- [x] Added contextual Support blocks to guide and long-form templates.
- [x] Preserved the existing nine-wallet support model.
- [x] Added no Stripe, card processor, new wallet, analytics service, or external payment dependency.
- [x] Fixed the `/access-and-regulation/` navigation mismatch to `/access-regulation/`.
- [x] Increased common navigation, form, pagination, and action target sizes.
- [x] Added wallet-address wrapping, full-width mobile copy buttons, and one-column mobile wallet layout.

### Mobile global layout

- [x] Stacked broken three-column section headings on mobile.
- [x] Changed stablecoin, organization, and event detail section navigation to a visible two-column mobile grid.
- [x] Added minimum-width containment to Stats surfaces for the previously confirmed 7px document overflow.

### Home

- [x] Removed the full 116-record duplicate registry from the homepage.
- [x] Replaced it with twenty recently reviewed records and a full-registry link.
- [x] Removed the duplicate homepage search/filter implementation.
- [x] Added a contextual Support explanation inside the homepage content.

### Index mobile cards

- [x] Reduced Stablecoin mobile cards to four primary facts with secondary facts inside `More record context`.
- [x] Reduced Organization mobile cards to category, asset reach, roles, and jurisdiction with regulatory and relationship metadata inside `More organization context`.
- [x] Reduced Event mobile cards to date, impact, subject, status effect, and recovery with taxonomy and evidence inside `More event context`.

### Detail-page defects

- [x] Separated Organization jurisdiction and jurisdiction scope instead of concatenating them.
- [x] Separated current and historical Organization relationship counts.
- [x] Separated Event affected-record and evidence summaries.
- [x] Added explicit separators between Event subject type and subject name.
- [x] Separated Event `Record details` title from its explanation.
- [x] Added explicit separation to Event correction and reference links.

### Access & Regulation

- [x] Reduced initial result rendering from 50 records to 12 records.
- [x] Reduced each Show more increment from 25 to 12 records.
- [x] Kept search visible while moving nine detailed filter axes into an explicit advanced-filter disclosure.

### Compare

- [x] Changed the initial comparison controls from four visible asset selectors to two.
- [x] Moved the third and fourth selectors into an explicit disclosure.
- [x] Moved presets and the nineteen-facet control set into optional disclosures.

## Evidence and run state

- All standard checks passed at head `8c52fce85f376efa230ff2d85bab225f3f1f4f55` before the later index/detail changes.
- Screenshot run `30370560533` captured every desktop and mobile route but was cancelled during the color-audit step after a newer commit superseded it. Its skipped audit steps are not a pass.
- CI and a new full-page screenshot run were triggered for head `623e65e1e459b281256fe207b7574bf65e77edd7` and were still running when this entry was written.

## Still incomplete or unverified

- [ ] Desktop screenshot review for the current head
- [ ] Mobile screenshot review for the current head
- [ ] Confirmed `/stats/` overflow result after current-head screenshots
- [ ] Stablecoin index PC layout and edge-case review
- [ ] Organization index PC layout and edge-case review
- [ ] Event index PC layout and edge-case review
- [ ] Stablecoin detail content hierarchy and all exceptions
- [ ] Organization detail full hierarchy and all exceptions
- [ ] Event detail full hierarchy and all exceptions
- [ ] Stats full visual redesign
- [ ] Access & Regulation current-head screenshot review and remaining density repair
- [ ] Compare current-head screenshot review and mobile result-matrix repair
- [ ] Timeline hierarchy repair
- [ ] Updates hierarchy repair
- [ ] Guide mobile-table transformations
- [ ] Full 461-route desktop review
- [ ] Full 461-route mobile review
- [ ] Screenshot/audit workflow repair
- [ ] Production deployment
- [ ] Owner approval

No item above may be treated as complete without its own implementation and screenshot evidence.

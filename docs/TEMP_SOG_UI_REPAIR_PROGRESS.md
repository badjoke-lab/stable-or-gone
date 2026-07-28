# TEMPORARY SOG UI REPAIR PROGRESS

This file is a running companion to `docs/TEMP_SOG_UI_REPAIR_MEMO.md`.
The memo remains the repair scope. This progress log must not be used to remove or silently close memo items.

## Overall status

**UI REPAIR INCOMPLETE**

## Batch 1 — global shell and home

- Branch: `fix/sog-ui-repair-batch-1`
- Draft PR: `#480`
- Current head: `641f78084b2eb1ba66b58d53c6cbdae42cef675d`

### Implemented

- [x] Replaced the unbounded 16-link header with seven primary links and an explicit More menu.
- [x] Added a permanently visible `Support this archive` header action on desktop and mobile.
- [x] Kept `Submit correction` as a secondary desktop action.
- [x] Replaced the hard-coded footer link list with canonical grouped footer navigation.
- [x] Added a full-width footer Support explanation and link to the existing wallet page.
- [x] Added contextual Support blocks to guide and long-form templates.
- [x] Preserved the existing nine-wallet support model.
- [x] Added no Stripe, card processor, new wallet, analytics service, or external payment dependency.
- [x] Fixed the `/access-and-regulation/` navigation mismatch to `/access-regulation/`.
- [x] Stacked broken three-column section headings on mobile.
- [x] Changed stablecoin, organization, and event detail section navigation to a visible two-column mobile grid.
- [x] Increased common navigation, form, pagination, and action target sizes.
- [x] Added wallet-address wrapping, full-width mobile copy buttons, and one-column mobile wallet layout.
- [x] Added Stats minimum-width containment intended to remove the confirmed 7px overflow.
- [x] Removed the full 116-record duplicate registry from the homepage.
- [x] Replaced the homepage registry with twenty recently reviewed records and a full-registry link.
- [x] Removed the duplicate homepage search/filter implementation.
- [x] Added a contextual Support explanation inside the homepage content.

### Evidence available now

- Astro build passed in Public UI contract run `30370256164`, job `90311940640`, before the homepage commit.
- The complete rendered-route audit for that run was still running when this entry was written.
- New CI and screenshot runs were triggered for homepage head `641f78084b2eb1ba66b58d53c6cbdae42cef675d`.

### Not yet verified or completed

- [ ] Desktop screenshot review for Batch 1
- [ ] Mobile screenshot review for Batch 1
- [ ] Confirmed `/stats/` overflow result after new screenshots
- [ ] Stablecoin index redesign and edge cases
- [ ] Organization index redesign and edge cases
- [ ] Event index redesign and edge cases
- [ ] Stablecoin detail content hierarchy and all exceptions
- [ ] Organization detail content hierarchy and all exceptions
- [ ] Event detail content hierarchy and all exceptions
- [ ] Stats full visual redesign
- [ ] Access & Regulation length and density repair
- [ ] Compare simplification
- [ ] Timeline hierarchy repair
- [ ] Updates hierarchy repair
- [ ] Guide mobile-table transformations
- [ ] Full 461-route desktop review
- [ ] Full 461-route mobile review
- [ ] Screenshot/audit workflow repair
- [ ] Production deployment
- [ ] Owner approval

No item above may be treated as complete without its own implementation and screenshot evidence.

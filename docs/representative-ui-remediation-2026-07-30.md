# Representative UI remediation — 2026-07-30

This remediation follows a manual review of all 42 representative public routes at desktop and mobile widths.

## Corrected regressions

- Mobile section-heading text collision on registry and detail pages.
- Collapsed or empty-looking mobile tables of contents on guide and longform pages.
- Duplicate browser list markers beside explicit record numbers on static paginated routes.
- Visual discontinuity between first-page interactive registers and later static pages.
- Excessive desktop Statistics height from fully expanded lower analysis sections.
- Excessive mobile Home height from a twenty-record preview.
- Mobile header imbalance and fully expanded footer navigation.
- Fragmented desktop record titles caused by narrow three-column paginated cards.
- Disclosure headings and links below the audited mobile text and target-size floors.

## Regression gates

The representative screenshot audit now checks descendant-level heading overlap, visible TOCs without links, duplicate list numbering, and bounded Home and Statistics heights. All desktop and mobile screenshots must also be inspected manually before merge.

The final source contains no temporary remediation workflow and no forbidden `!important` declaration.

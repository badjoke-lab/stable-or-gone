# Stablecoin Compare Discovery and Navigation Remediation Spec

Updated: 2026-08-10  
Status: implementation contract after authority merge

## Product defect

The current `/stablecoins/` comparison matrix is functionally aligned but positioned after the complete register and pagination. Users can select records in the register but have no persistent indication that comparison is ready, and candidate replacement requires a long scroll round trip.

## Required interaction model

1. The comparison panel must precede the register results/pagination in document order.
2. Zero selected records: comparison panel and Compare dock are hidden.
3. One selected record: Compare dock is visible, shows the selected identity and communicates that one more is required.
4. Two to four selected records: Compare dock remains visible and exposes `View comparison`.
5. `View comparison` moves focus/viewport to the comparison panel on explicit user action only.
6. The comparison panel must include an `Add / replace record` control sourced only from existing canonical stablecoin records.
7. At four selected records, adding another remains blocked until a column is removed.
8. Removing a comparison column must immediately make replacement available in the comparison panel without requiring register scrolling.
9. Existing URL-order restoration, differences-only filtering, explicit unknown/not-recorded treatment, and aligned matrix rows remain unchanged.

## Visual and responsive contract

- The dock must be visually distinct but must not obscure essential register or footer content.
- Interactive controls remain at least 44px where the shared system already targets 44px.
- Body copy remains at least 15px desktop / 16px mobile.
- No page-level horizontal overflow.
- Matrix horizontal overflow remains bounded to its own shell on narrow viewports.
- The dock and panel must work at desktop and mobile widths.

## Safety boundary

Canonical counts, canonical source material, machine-readable output, schema, routes, taxonomy, ranking/recommendation semantics, and Evidence Archive proposals are out of scope and must remain unchanged.

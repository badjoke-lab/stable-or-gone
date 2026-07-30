# Mobile UI regression review — 2026-07-30

This review records the issues found in the representative 393px-wide screenshot set before the white-background and mobile-density correction.

## Findings

1. The cream gradient and translucent paper surfaces tinted every public page instead of presenting a white canvas.
2. Lifecycle and state labels had become neutral underlined text, removing fast visual distinction between active, constrained, failed, and historical states.
3. Stablecoin result cards repeated a tall identity row, boxed primary facts, and a full-height disclosure row for every record.
4. The home registry preview stacked all six table cells for each of twenty records, making the mobile page excessively long.
5. Organization and event result cards retained desktop-oriented gaps and disclosure heights.
6. Filter controls formed a long single-column block before the results.
7. Mobile KPI ledgers retained desktop minimum heights and padding.
8. Footer navigation became one long column with 44px assigned to every secondary link.
9. Main padding and page-family gaps remained too large for narrow screens.

## Applied resolution

- White global canvas, surfaces, header, footer, inputs, and sticky navigation.
- Square filled semantic badges with separate positive, warning, danger, historical, and neutral palettes.
- Compact mobile stablecoin facts with readable audited typography.
- Two-column home registry metadata instead of six stacked rows per record.
- Denser organization and event cards.
- Two-column filter controls.
- Reduced KPI, page, and footer height while preserving the audited mobile target floor.

The correction remains subject to CI, public UI contract, color, contrast, readability, geometry, and representative screenshot checks before merge.

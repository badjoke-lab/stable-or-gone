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
10. The home hero, directory, and explanatory material delayed recently reviewed records by several screens.
11. The first compacting pass reduced type below the audited mobile readability floors.

## Applied resolution

- White global canvas, surfaces, header, footer, inputs, and sticky navigation.
- Square filled semantic badges with separate positive, warning, impaired, danger, historical, and neutral palettes.
- Compact mobile stablecoin facts with readable audited typography.
- Three-row home registry records instead of six stacked cells.
- Recently reviewed records immediately after the short hero and KPI ledger.
- Archive Directory, scope notes, and support context below the recent records.
- Evidence and event counts combined into one line.
- Mobile primary navigation limited to three visible links plus More without clipped labels.
- Mobile ordinary copy at 16px, compact values and interactive text at 15px, and metadata at 13px.
- Denser organization and event cards.
- Two-column filter controls and Archive Directory.
- Reduced KPI, page, and footer height while preserving the audited mobile target floor.

## Screenshot acceptance criteria

At 393px width:

- the recent-record heading begins within the first viewport-height range after the site header;
- the first recent record is visible without traversing the Archive Directory;
- lifecycle badges visibly retain semantic colors;
- ordinary record rows remain a three-row information grid rather than a six-row stack;
- Stablecoins, Organizations, Events, and More are fully visible;
- no horizontal overflow or clipped navigation label is present.

The correction remains subject to CI, public UI contract, color, contrast, readability, geometry, and representative screenshot checks before merge.

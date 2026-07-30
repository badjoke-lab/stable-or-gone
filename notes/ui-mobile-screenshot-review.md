# Mobile screenshot review

Reviewed the representative 393px-wide capture set from run `30531538414` before applying the UI correction.

## Findings

1. The cream gradient and translucent paper surfaces make the entire site look tinted instead of white.
2. Lifecycle and state labels have lost usable color differentiation because they render as neutral text with an underline.
3. Stablecoin result cards are too tall: identity, a boxed two-cell fact grid, and a full-height disclosure row are repeated for every record.
4. The home page registry preview stacks six table cells for each of twenty records, producing an excessively long mobile page.
5. Organization and event result cards repeat generous gaps and full-height disclosure rows.
6. Filter controls form a long single-column block before results.
7. Mobile KPI ledgers retain desktop-like minimum heights and padding.
8. Footer navigation becomes one tall column with 44px assigned to every secondary link.
9. Page-family vertical gaps and main padding remain desktop-oriented on narrow screens.

## Resolution target

- White global canvas and surfaces.
- Filled square semantic badges with distinct positive, warning, danger, historical, and neutral palettes.
- Compact two-column mobile facts where appropriate.
- Shorter index records, KPI cells, filters, page gaps, and footer navigation without shrinking primary touch targets.

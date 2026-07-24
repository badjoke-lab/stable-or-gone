# SOG UI V3 — CYA-Dark Implementation Log

Authority: `docs/ui-v3-cya-dark-redesign-authority.md`

Working branch: `ui/v3-cya-dark-redesign`

V2 fallback remains:

- commit: `a376d440b87deb25d3e3ee1c880369ac31d7e70a`
- branch: `restore-point/pre-ui-redesign-2026-07-24`

This log records implementation evidence. It does not replace the authority document and does not constitute owner acceptance.

## Phase 1 — shell specimen

Authority sections: 4, 5, 6, 7, 13, 14, 15.

Implemented:

- black `#050607` base background;
- role-based serif, sans-serif, and monospace typography;
- two-level desktop masthead/navigation;
- compact one-row mobile header with disclosed menu;
- semantic active underline rather than filled navigation pills;
- compact two-column desktop footer and single-column mobile footer;
- no blur, gradient, rounded card, or shadow treatment in the V3 shell.

Files:

- `src/layouts/BaseLayout.astro`
- `src/styles/v3-cya-dark-shell.css`
- `src/styles/v3-cya-dark-shell-corrections.css`
- `src/components/BrandLockup.astro`

Screenshot audit:

- run `30070435476` and later branch runs;
- desktop: Home, Stablecoins, MiCA guide;
- mobile 390px: Home, Stablecoins, MiCA guide, open navigation menu;
- horizontal overflow: zero;
- verified background: `rgb(5, 6, 7)`;
- final measured header height at this phase: desktop 137px, mobile 95px.

Defects found and corrected:

- correction link escaped the desktop masthead metadata row;
- mobile retained an unnecessary second header row;
- V2 header geometry continued to affect V3.

Remaining:

- no shell merge or owner acceptance;
- footer content may be refined during whole-site propagation.

## Phase 2 — representative Stablecoin Register

Authority sections: 9, 12, 13, 14, 15.

Implemented:

- unframed editorial register introduction;
- connected ruled record-count ledger;
- CYA-style ruled control area;
- preserved text search, sorting, six multi-select filter groups, clear action, result range, pagination, and comparison selection;
- desktop ruled table without sticky screenshot displacement;
- status text with a thin semantic rule instead of a filled pill;
- mobile two-column filter ledger;
- mobile label/value record grid;
- mobile secondary fields moved under `Record details`;
- comparison selection retained as an unframed utility action.

Files:

- `src/styles/v3-cya-dark-registry.css`
- `src/styles/v3-cya-dark-registry-corrections.css`
- `src/components/StablecoinIndexCard.astro`
- `src/components/BrandLockup.astro`

Screenshot audit:

- initial run `30070737511`;
- corrected run `30071055928`;
- desktop and 390px mobile Stablecoins route directly inspected;
- horizontal overflow: zero;
- build: success.

Defects found and corrected:

- sticky table header appeared after the first record in full-page capture;
- mobile filter ledger was one column and unnecessarily long;
- ten record facts were permanently expanded;
- comparison checkbox was centered like a form card action.

Remaining:

- filtered, empty, and selected-comparison screenshots still required before final V3 acceptance;
- functional smoke tests will be repeated after propagation;
- Phase 2 is a verified specimen, not an approved merge.

## Phase 3 — Home and representative stablecoin detail

Authority sections: 8, 10, 13, 14, 15.

Implemented:

- Home editorial masthead, connected count ledger, ruled search, latest changes, lifecycle ledger, reviewed-record table, guide desk, and numbered reference shelf;
- USDC representative dossier with editorial title hierarchy, compact fact ledger, ruled section headings, semantic material-change notice, compact navigation, readable assessment prose, and archive-colored source links;
- strict desktop/mobile separation for original data tables and generated mobile representations;
- collapsible mobile Deployments and Organizations records without removing fields;
- evidence mobile records remain collapsed by source;
- wide desktop tables remain horizontally contained within their own sections.

Files:

- `src/styles/v3-cya-dark-home.css`
- `src/styles/v3-cya-dark-detail.css`
- `src/styles/v3-cya-dark-detail-corrections.css`
- `src/components/MobileTableRuntime.astro`
- `src/components/BrandLockup.astro`

Screenshot audit:

- initial specimen run `30071680522`;
- runtime correction run `30072119979`;
- final CSS correction run `30072163819`;
- desktop and 390px mobile Home and `/stablecoin/usdc/` directly inspected;
- horizontal overflow: zero.

Measured detail-height correction:

- desktop USDC: approximately `16,986px` to `7,562px`;
- mobile USDC: approximately `23,770px` to `11,536px`.

Defects found and corrected:

- desktop original tables and generated mobile representations appeared together;
- mobile original tables and generated records appeared together;
- 17-field deployment records and 9-field organization records were permanently expanded;
- duplicate display created large empty and sparse regions.

Remaining:

- additional stablecoin records must be sampled before final acceptance;
- interaction checks for collapsed records and copy controls remain required.

## Phase 4 — Events, Organizations, and Guides indexes

Authority sections: 9, 11, 13, 14, 15.

Implemented:

- shared editorial mastheads and four-cell ledgers;
- ruled search, sorting, and multi-select filter controls for Events and Organizations;
- dense desktop tables;
- compact mobile records;
- Guides editorial tables, mobile guide list, category navigation, and numbered reference cells;
- all current records remain visible; no unrequested pagination or data suppression was introduced.

Files:

- `src/styles/v3-cya-dark-indexes.css`
- `src/components/BrandLockup.astro`
- `.github/workflows/v3-indexes-specimen.yml`

Screenshot audit:

- run `30072606620`;
- desktop and 390px mobile Events, Organizations, and Guides directly inspected;
- horizontal overflow: zero;
- desktop body heights: Events `2,385px`, Organizations `2,328px`, Guides `2,457px`;
- mobile body heights: Events `27,243px`, Organizations `16,772px`, Guides `3,105px`.

Interpretation:

- Events and Organizations are long because all `189` events and `107` organizations remain present on one page;
- individual mobile records are compact ruled entries rather than padded cards;
- page length alone is not treated as a defect while all-record visibility remains an existing functional requirement.

## Next pass

Phase 5:

1. propagate the detail language to Event and Organization details;
2. redesign Compare and Stats without dashboard or commerce grammar;
3. align Timeline, Access & Regulation, Guide articles, and long-form/reference pages;
4. capture representative desktop/mobile screenshots;
5. repeat functional smoke tests before any owner review or merge decision.

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

## Next pass

Phase 3:

1. implement the V3 home hierarchy;
2. implement one representative stablecoin detail page;
3. capture desktop and mobile screenshots;
4. correct hierarchy, density, typography, and semantic color before propagating to other page families.

# SOG UI V3 — CYA-Dark Implementation Log

Authority: `docs/ui-v3-cya-dark-redesign-authority.md`

Working branch: `ui/v3-cya-dark-redesign`

Review PR: `#458`

V2 fallback remains:

- commit: `a376d440b87deb25d3e3ee1c880369ac31d7e70a`
- branch: `restore-point/pre-ui-redesign-2026-07-24`

This log records implementation and verification evidence. It does not replace the authority document and does not constitute owner acceptance.

## Phase 1 — global shell

Implemented:

- black `#050607` base background;
- serif display headings, sans-serif prose, and monospace metadata;
- two-level desktop masthead and navigation;
- compact one-row mobile header with disclosure navigation;
- active-rule navigation rather than filled pills;
- compact desktop and mobile footer;
- no blur, gradient, glass, rounded-card, or shadow shell treatment.

Primary files:

- `src/layouts/BaseLayout.astro`
- `src/styles/v3-cya-dark-shell.css`
- `src/styles/v3-cya-dark-shell-corrections.css`
- `src/components/BrandLockup.astro`

Verified shell measurements:

- desktop header: `137px`;
- mobile header: `95px`;
- background: `rgb(5, 6, 7)`;
- horizontal overflow: zero on audited routes.

Corrected defects:

- correction link escaping the desktop metadata row;
- unnecessary second mobile header row;
- V2 header geometry leaking into V3.

## Phase 2 — Stablecoin Register

Implemented:

- editorial register masthead and connected count ledger;
- ruled search, sorting, six multi-select filter groups, clear action, range, pagination, and comparison controls;
- dense desktop table without screenshot-displacing sticky headers;
- compact mobile records with six primary facts;
- remaining record facts retained under `Record details`;
- comparison selection retained without card or commerce treatment.

Primary files:

- `src/styles/v3-cya-dark-registry.css`
- `src/styles/v3-cya-dark-registry-corrections.css`
- `src/components/StablecoinIndexCard.astro`

Corrected defects:

- sticky table heading appearing after the first captured record;
- one-column mobile filter stack;
- ten permanently expanded mobile facts;
- incorrectly centered comparison controls.

## Phase 3 — Home and stablecoin dossier

Implemented:

- Home masthead, count ledger, search, latest changes, lifecycle ledger, reviewed records, guides, and reference shelf;
- stablecoin dossier title hierarchy, fact ledger, section rules, navigation, evidence, material-change treatment, and source links;
- strict separation of desktop tables and mobile representations;
- collapsible mobile Deployments, Organizations, and Evidence records.

Primary files:

- `src/styles/v3-cya-dark-home.css`
- `src/styles/v3-cya-dark-detail.css`
- `src/styles/v3-cya-dark-detail-corrections.css`
- `src/components/MobileTableRuntime.astro`

Measured USDC correction:

- desktop: approximately `16,986px` to `7,562px`;
- mobile: approximately `23,770px` to `11,536px`.

Corrected defects:

- original tables and generated mobile representations appearing together;
- 17-field Deployment and 9-field Organization records remaining permanently open;
- duplicate output producing large sparse regions.

## Phase 4 — Events, Organizations, and Guides indexes

Implemented:

- shared editorial mastheads and four-cell ledgers;
- ruled search, sorting, and multi-select filters for Events and Organizations;
- dense desktop tables and compact mobile records;
- Guides editorial table, mobile guide list, category navigation, and reference cells;
- preservation of all current records without unrequested data suppression.

Primary file:

- `src/styles/v3-cya-dark-indexes.css`

Audited run:

- run `30074684925`;
- desktop and 390px mobile Events, Organizations, and Guides;
- horizontal overflow: zero;
- desktop body heights: Events `2,385px`, Organizations `2,328px`, Guides `2,457px`;
- mobile body heights: Events `27,243px`, Organizations `16,772px`, Guides `3,105px`.

Events and Organizations remain long on mobile because all `189` events and `107` organizations remain present. Individual records are compact ruled entries rather than padded cards.

## Phase 5 — details, Compare, and Stats

Implemented:

- Event and Organization detail pages using the same dossier language as stablecoin records;
- Compare as a ruled research matrix with explicit slots and visible unknown states;
- Stats as connected facts, tables, and restrained bars rather than floating dashboard cards;
- two-asset comparison output and mobile representation separation.

Primary files:

- `src/styles/v3-cya-dark-secondary-details.css`
- `src/styles/v3-cya-dark-analysis.css`
- `src/styles/v3-cya-dark-phase5-corrections.css`

Audited run:

- run `30074684900`;
- Event `/event/sog_ev_usk_limited_status_batch_g/`;
- Organization `/issuer/aave/`;
- desktop and 390px mobile details, Compare empty, Compare selected, and Stats;
- horizontal overflow: zero.

Measured body heights:

- desktop Event `2,207px`, Organization `2,643px`, Compare empty `2,191px`, Compare selected `5,588px`, Stats `13,973px`;
- mobile Event `2,432px`, Organization `3,080px`, Compare empty `3,224px`, Compare selected `12,260px`, Stats `16,187px`.

Corrected defect:

- Organization `Uncertainty` eyebrow and `Known unknowns` heading were visually concatenated.

## Phase 6 — research tools and editorial pages

Implemented:

- Timeline and Access & Regulation editorial mastheads, interpretation boundaries, deterministic filters, and evidence-oriented records;
- Guide and longform desktop reading column with restrained sticky TOC;
- single-column mobile reading flow;
- Methodology, Glossary, and Contact without PR419 blue rounded surfaces;
- readable sans-serif prose, serif headings, and monospace metadata;
- connected ruled entrypoints and reporting routes.

Primary files:

- `src/styles/v3-cya-dark-research-longform.css`
- `src/styles/v3-cya-dark-longform-corrections.css`
- `src/scripts/access-regulation-explorer.ts`
- `src/pages/access-regulation/index.astro`

Audited run:

- corrected phase run `30074721296`;
- desktop and 390px mobile Timeline, Access & Regulation, MiCA guide, Methodology, Glossary, and Contact;
- horizontal overflow: zero;
- first-surface radius: `0px`;
- background: `rgb(5, 6, 7)`.

Corrected defects:

- workflow-only rendering wait that did not match the actual DOM;
- PR419 blue fact ledgers and utility cards;
- stale fixed Access & Regulation contract requiring exactly `110` assets;
- missing explicit unavailable state after an index-load failure.

The Access & Regulation runtime now validates structural consistency (`asset_count === rows.length`) instead of a historical fixed count. The page receives the current count from the loaded canonical index. The final audited count was `114`, with `50` initial rendered records and working search.

## Final consolidated acceptance audit

Workflow:

- `.github/workflows/v3-final-acceptance-audit.yml`
- runner: `scripts/audit/v3-final-acceptance.mjs`

Final run:

- run `30081851145`;
- head `f7a2943cad6ed85b32945e5fbadca8cb80a1ec78`;
- result: `success`;
- checks: `227 / 227` passed;
- failures: `0`;
- browser errors: `0`;
- page errors: `0`;
- artifact: `sog-v3-final-acceptance-30081851145`.

Coverage:

- 16 representative routes on desktop and 390px mobile;
- Home;
- Stablecoins index and USDC dossier;
- Events index and detail;
- Organizations index and detail;
- Guides index and article;
- Compare;
- Stats;
- Timeline;
- Access & Regulation;
- Methodology;
- Glossary;
- Contact;
- dark background, bounded header, flat surfaces, H1 presence, HTTP success, and horizontal-overflow checks;
- Stablecoin search, sorting, filtering, pagination, and bounded comparison;
- Event search, sorting, and filtering;
- Organization search, sorting, and filtering;
- Compare two-asset output;
- Timeline rendering, search, and expansion;
- Access & Regulation rendering and search;
- mobile navigation and record disclosures;
- `/version.json`;
- `/data/manifest.json`;
- `/data/change-timeline.json`;
- `/data/access-regulation-index.json`;
- `/llms.txt`;
- `/ai.txt`.

Final Access & Regulation measurements:

- desktop: `17,888px`, `50` rendered cards, no horizontal overflow;
- mobile: `36,629px`, `50` rendered cards, no horizontal overflow;
- search: `114` records to `1` matching record in the functional test.

## Workflow cleanup

Removed superseded phase-only screenshot workflows and their trigger files:

- V3 shell specimen;
- V3 indexes specimen;
- V3 Phase 5 specimen;
- V3 Phase 6 research/longform specimen.

The consolidated final acceptance workflow is the only V3 audit workflow retained while PR `#458` remains under review.

## Review boundary

- `main` remains unchanged at the V2 baseline;
- PR `#458` remains draft;
- no merge has been performed;
- final automated acceptance is complete;
- explicit owner visual acceptance is still required before any merge decision.

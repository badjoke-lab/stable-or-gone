# SOG UI Redesign Schedule

Status: ACTIVE — GATE 7 VERIFICATION
Workstream: production-safe full UI rebuild
Implementation branch: `ui/sog-redesign-v4`
Production branch: `main`

This is a gated execution schedule. Gate completion, not elapsed time, controls progression. The public site remains on the outgoing UI until Gate 8.

## Gate 0 — Authority, controls, and isolation

- [x] redesign authority defined;
- [x] redesign specification defined;
- [x] redesign schedule defined;
- [x] implementation branch created from main checkpoint `5e12ed2c5c40f945a8af5821c443fefad7594a98`;
- [x] agent operating rules defined;
- [x] authority/docs merged to main as PR #635, merge `8e6d34d2893c6f557d90419158f260aa7ca01c92`;
- [x] obsolete `.github/workflows/visual-audit.yml` removed;
- [x] legacy UI-v3 / SVG visual gates explicitly quarantined from redesign completion gating by the active authority/spec/agent rules.

Gate 0 status: COMPLETE.

Exit: implementation can proceed without publishing partial UI or being blocked by obsolete visual contracts.

## Gate 1 — Design system and responsive shell

- [x] design tokens;
- [x] typography hierarchy;
- [x] lifecycle/status color semantics;
- [x] panel/card/table/form primitives;
- [x] desktop navigation shell;
- [x] mobile navigation shell, including fixed bottom primary navigation;
- [x] shared responsive spacing/layout;
- [x] unknown/empty/error display rules.

Gate 1 status: IMPLEMENTED ON REDESIGN BRANCH. Final browser acceptance remains part of Gate 7.

Exit: common desktop/mobile shells can render canonical data without page-specific hacks.

## Gate 2 — Discovery

- [x] Home desktop + mobile;
- [x] Register desktop + mobile;
- [x] search/filter/sort/pagination;
- [x] mobile filter drawer;
- [x] compare-selection entry point.

Gate 2 status: IMPLEMENTED ON REDESIGN BRANCH. Final browser acceptance remains part of Gate 7.

Exit: canonical records are discoverable and filterable on desktop and mobile.

## Gate 3 — Stablecoin research

- [x] Dossier desktop + mobile;
- [x] issuer/control;
- [x] backing/redemption/reserve sections;
- [x] deployments/access where supportable;
- [x] evidence;
- [x] regulatory notes;
- [x] known unknowns;
- [x] lifecycle/history presentation.

Gate 3 status: IMPLEMENTED ON REDESIGN BRANCH. Final browser/data spot acceptance remains part of Gate 7.

Exit: dossier answers current state and historical basis without fabricated summaries.

## Gate 4 — Events and history

- [x] Events desktop + mobile;
- [x] Event Detail desktop + mobile;
- [x] Timeline desktop + mobile;
- [x] evidence-linked chronology;
- [x] before/after display only where supported.

Gate 4 status: IMPLEMENTED ON REDESIGN BRANCH. Final browser/data spot acceptance remains part of Gate 7.

Exit: material state change is navigable as structured history.

## Gate 5 — Compare, issuers, and analytics

- [x] Compare desktop + mobile;
- [x] Issuer/Organization detail desktop + mobile;
- [x] Stats desktop + mobile;
- [x] documented deterministic aggregation rules (`docs/stats-spec.md` and existing canonical projection rules).

Gate 5 status: IMPLEMENTED ON REDESIGN BRANCH. Final browser/data spot acceptance remains part of Gate 7.

Exit: all comparison/statistics values are canonical or documented derivations.

## Gate 6 — Reference and secondary surfaces

- [x] Methodology / public data/reference surfaces;
- [x] Access & Regulation;
- [x] Guides index + article layout;
- [x] Updates / Maintenance;
- [x] Support / Contact / About / legal utility pages;
- [x] 404 / empty / error states.

Gate 6 status: IMPLEMENTED ON REDESIGN BRANCH. `redesign-v4-secondary.css` covers reference/guide/utility surfaces and `redesign-v4-operations.css` covers Updates/Maintenance. Final browser acceptance remains part of Gate 7.

Exit: no production route family remains visually incompatible unless explicitly approved.

## Gate 7 — Full redesign verification

Current gate: ACTIVE.

- [ ] full ancestry sync with latest `main`;
  - current `main` checkpoint: `1feb7e218a46d8875c25cfe194e2cae359b36454`;
  - the only post-authority main delta is the Gate 0 schedule bookkeeping commit and its resulting schedule content is already mirrored on the redesign branch;
  - full branch ancestry sync remains required before Gate 8.
- [x] canonical/classification/profile/event/evidence validation — CI run `34331269192` / run #5695 success;
- [x] registry integrity — Registry audits run `34331269267` / run #110 success;
- [x] Astro check — CI run `34331269192` / run #5695 success;
- [x] production-equivalent build — CI run `34331269192` / run #5695 success;
- [x] reproducibility/public-layer verification — Reproducible build run `34331269196` / run #3466 success and Public consistency run `34331269240` / run #5186 success;
- [ ] route and broken-link check;
- [ ] desktop representative browser inspection;
- [ ] mobile representative browser inspection;
- [ ] horizontal overflow check;
- [ ] basic accessibility checks;
- [ ] data-vs-UI spot checks;
- [ ] pre-cutover rollback SHA recorded.

No pixel-perfect equality to the outgoing UI is allowed as a release gate.

Exit: complete redesign branch is release-ready.

## Gate 8 — Production cutover

1. freeze redesign branch for integration;
2. incorporate latest `main`;
3. repeat Gate 7 critical checks;
4. record pre-cutover production SHA;
5. merge complete redesign to `main` once;
6. allow normal production deployment;
7. run production smoke + critical-route checks;
8. verify production canonical counts/public JSON;
9. verify representative desktop/mobile production pages;
10. rollback to the recorded SHA on critical regression.

Exit: new UI is public and verified.

## Gate 9 — Cleanup

- remove obsolete outgoing UI components/styles;
- remove obsolete visual validators/SVG mock machinery that no longer provides value;
- retire conflicting historical design documents;
- document final production UI architecture;
- keep only lightweight ongoing regression checks tied to demonstrated failure modes.

## Parallel-work rule

Canonical record growth, evidence work, guides, monitoring, and maintenance may continue on `main` during Gates 0–7. At safe checkpoints, sync `main` into the redesign branch. The redesign adapts to data/schema changes; it does not rewrite canonical facts to fit the UI.

## Latest implementation checkpoint

Implementation checkpoint before this schedule update: `3c58abb88a7bd2ca91eef0a7079b3bd4105eb69f`.

Implemented in the current redesign sequence:

- dark observatory foundation and semantic runtime;
- Home / Register / Dossier / Events / Event Detail / Timeline;
- Compare / Organizations / Stats;
- Access & Regulation / Guides / reference / utility surfaces;
- Updates / Maintenance operational surfaces;
- mobile fixed bottom primary navigation;
- mobile conflict avoidance for comparison dock and filter drawer.

Production changed by this redesign: **no**.

## Required progress report

Every redesign progress report must state current gate, branch/head, completed surfaces, incomplete surfaces, latest main sync point, validation status, and whether production changed. Expected production change is `no` until Gate 8.

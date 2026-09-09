# SOG UI Redesign Schedule

Status: ACTIVE AFTER AUTHORITY MERGE
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
- [ ] authority/docs merged to main;
- [ ] obsolete visual audit workflow removed or disabled for redesign work;
- [ ] legacy UI-v3 / SVG visual gates explicitly quarantined from redesign completion gating.

Exit: implementation can proceed without publishing partial UI or being blocked by obsolete visual contracts.

## Gate 1 — Design system and responsive shell

- design tokens;
- typography hierarchy;
- lifecycle/status color semantics;
- panel/card/table/form primitives;
- desktop navigation shell;
- mobile navigation shell;
- shared responsive spacing/layout;
- unknown/empty/error display rules.

Exit: common desktop/mobile shells can render canonical data without page-specific hacks.

## Gate 2 — Discovery

- Home desktop + mobile;
- Register desktop + mobile;
- search/filter/sort/pagination;
- mobile filter drawer;
- compare-selection entry point.

Exit: canonical records are discoverable and filterable on desktop and mobile.

## Gate 3 — Stablecoin research

- Dossier desktop + mobile;
- issuer/control;
- backing/redemption/reserve sections;
- deployments/access where supportable;
- evidence;
- regulatory notes;
- known unknowns;
- lifecycle/history presentation.

Exit: dossier answers current state and historical basis without fabricated summaries.

## Gate 4 — Events and history

- Events desktop + mobile;
- Event Detail desktop + mobile;
- Timeline desktop + mobile;
- evidence-linked chronology;
- before/after display only where supported.

Exit: material state change is navigable as structured history.

## Gate 5 — Compare, issuers, and analytics

- Compare desktop + mobile;
- Issuer/Organization detail desktop + mobile;
- Stats desktop + mobile;
- documented deterministic aggregation rules.

Exit: all comparison/statistics values are canonical or documented derivations.

## Gate 6 — Reference and secondary surfaces

- Methodology / Data;
- Access & Regulation;
- Guides index + article layout;
- Updates / Maintenance;
- Support / Contact / About / legal utility pages;
- 404 / empty / error states.

Exit: no production route family remains visually incompatible unless explicitly approved.

## Gate 7 — Full redesign verification

- sync latest `main`;
- canonical/classification/profile/event/evidence validation;
- registry integrity;
- Astro check;
- production-equivalent build;
- reproducibility/public-layer verification;
- route and broken-link check;
- desktop representative browser inspection;
- mobile representative browser inspection;
- horizontal overflow check;
- basic accessibility checks;
- data-vs-UI spot checks;
- pre-cutover rollback SHA recorded.

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

## Required progress report

Every redesign progress report must state current gate, branch/head, completed surfaces, incomplete surfaces, latest main sync point, validation status, and whether production changed. Expected production change is `no` until Gate 8.

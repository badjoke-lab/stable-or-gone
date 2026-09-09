# SOG UI Redesign Schedule

Status: GATE 7 COMPLETE — GATE 8 CUTOVER READY
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

Gate 1 status: COMPLETE ON REDESIGN BRANCH.

Exit: common desktop/mobile shells can render canonical data without page-specific hacks.

## Gate 2 — Discovery

- [x] Home desktop + mobile;
- [x] Register desktop + mobile;
- [x] search/filter/sort/pagination;
- [x] mobile filter drawer;
- [x] compare-selection entry point.

Gate 2 status: COMPLETE ON REDESIGN BRANCH.

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

Gate 3 status: COMPLETE ON REDESIGN BRANCH.

Exit: dossier answers current state and historical basis without fabricated summaries.

## Gate 4 — Events and history

- [x] Events desktop + mobile;
- [x] Event Detail desktop + mobile;
- [x] Timeline desktop + mobile;
- [x] evidence-linked chronology;
- [x] before/after display only where supported.

Gate 4 status: COMPLETE ON REDESIGN BRANCH.

Exit: material state change is navigable as structured history.

## Gate 5 — Compare, issuers, and analytics

- [x] Compare desktop + mobile;
- [x] Issuer/Organization detail desktop + mobile;
- [x] Stats desktop + mobile;
- [x] documented deterministic aggregation rules (`docs/stats-spec.md` and existing canonical projection rules).

Gate 5 status: COMPLETE ON REDESIGN BRANCH.

Exit: all comparison/statistics values are canonical or documented derivations.

## Gate 6 — Reference and secondary surfaces

- [x] Methodology / public data/reference surfaces;
- [x] Access & Regulation;
- [x] Guides index + article layout;
- [x] Updates / Maintenance;
- [x] Support / Contact / About / legal utility pages;
- [x] 404 / empty / error states.

Gate 6 status: COMPLETE ON REDESIGN BRANCH. `redesign-v4-secondary.css` covers reference/guide/utility surfaces and `redesign-v4-operations.css` covers Updates/Maintenance.

Exit: no production route family remains visually incompatible unless explicitly approved.

## Gate 7 — Full redesign verification

Gate 7 status: COMPLETE.

- [x] full ancestry sync with latest `main`;
  - verified production/main checkpoint: `1feb7e218a46d8875c25cfe194e2cae359b36454`;
  - sync merge on redesign history: `8495ba20c267eb3bcd51daa920307b37b159e097`;
  - compare after sync: redesign branch is ahead of `main` and behind by zero commits.
- [x] canonical/classification/profile/event/evidence validation — CI run `34339616126` / run #5703 success;
- [x] registry integrity — Registry audits run `34339616146` / run #118 success;
- [x] Astro check — CI run `34339616126` / run #5703 success;
- [x] production-equivalent build — CI run `34339616126` / run #5703 success;
- [x] reproducibility/public-layer verification — Reproducible build run `34339616075` / run #3474 success and Public consistency run `34339616084` / run #5194 success;
- [x] route and broken-link check — Gate 7 built internal-link check succeeded in CI run #5703;
- [x] desktop representative browser inspection — 45/45 selected desktop routes captured successfully from the built redesign, with zero capture failures;
- [x] mobile representative browser inspection — 45/45 selected mobile routes captured successfully from the built redesign, with zero capture failures;
- [x] horizontal overflow check — zero representative desktop/mobile overflow violations in the final Gate 7 artifact;
- [x] basic accessibility checks — representative desktop/mobile UI-contract check passed for page landmarks, heading count, IDs, visible image alternatives, accessible control names, and overflow;
- [x] data-vs-UI spot checks — Home and Stablecoin/Organization/Event register counts match the built canonical `version.json`; Home evidence was corrected to use the complete evidence set before final validation;
- [x] pre-cutover rollback SHA recorded — `1feb7e218a46d8875c25cfe194e2cae359b36454`; Gate 8 must re-confirm this exact SHA immediately before merge and replace it if `main` advances.

Final Gate 7 screenshot artifact for CI #5703: 45 desktop + 45 mobile representative pages, zero failed captures, zero horizontal overflow violations, zero broken images, zero brand violations, zero outgoing-visual markers, zero residual legacy-interface mono violations, and zero unexpected empty-state violations.

No pixel-perfect equality to the outgoing UI is allowed as a release gate.

Exit: complete redesign branch is release-ready.

## Gate 8 — Production cutover

Status: READY, NOT YET EXECUTED.

1. freeze redesign branch for integration;
2. re-fetch `main` and confirm it still equals the recorded rollback SHA or incorporate any new commits;
3. repeat critical release checks on the final integration head;
4. record the exact pre-cutover production SHA;
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

Gate 7 verification head before this schedule update: `c02a3058cccbe909f1bc079723c4b067f856e101`.

Implemented in the redesign sequence:

- dark observatory foundation and semantic runtime;
- Home / Register / Dossier / Events / Event Detail / Timeline;
- Compare / Organizations / Stats;
- Access & Regulation / Guides / reference / utility surfaces;
- Updates / Maintenance operational surfaces;
- mobile fixed bottom primary navigation;
- mobile conflict avoidance for comparison dock and filter drawer;
- complete-evidence Home counts and per-record evidence totals;
- final removal of residual outgoing-interface monospace treatment;
- built internal-link verification and representative accessibility/data UI-contract checks.

Production changed by this redesign through Gate 7: **no**.

## Required progress report

Every redesign progress report must state current gate, branch/head, completed surfaces, incomplete surfaces, latest main sync point, validation status, and whether production changed. Expected production change is `no` until Gate 8.
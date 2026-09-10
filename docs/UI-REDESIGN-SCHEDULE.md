# SOG UI Redesign Schedule

Status: V4 CUTOVER COMPLETE — STATS / REGISTRY HEALTH REFINEMENT COMPLETE
Updated: 2026-09-11
Production branch: `main`
Completed refinement branch: `ui/stats-registry-health-20260910`

## Completed UI Redesign V4 gates

### Gate 0 — Authority, controls, isolation

COMPLETE.

- redesign authority/spec/schedule established;
- implementation isolated from `main`;
- obsolete `.github/workflows/visual-audit.yml` removed;
- outgoing UI-v3 / SVG visual baselines quarantined from redesign acceptance.

### Gate 1 — Design system and responsive shell

COMPLETE.

- dark observatory tokens and sans-first typography;
- lifecycle/status semantics;
- desktop shell;
- fixed mobile primary navigation;
- responsive spacing and unknown/empty/error states.

### Gate 2 — Discovery

COMPLETE.

- Home;
- Stablecoin Register;
- search/filter/sort/pagination;
- compare-selection entry point;
- desktop and mobile variants.

### Gate 3 — Stablecoin research

COMPLETE.

- Dossier;
- issuer/control;
- backing/redemption/reserves;
- deployments/access where supportable;
- evidence;
- regulatory notes;
- known unknowns;
- lifecycle/history.

### Gate 4 — Events and history

COMPLETE.

- Events;
- Event Detail;
- Timeline;
- evidence-linked chronology;
- before/after state only where supported.

### Gate 5 — Compare, organizations, analytics

COMPLETE.

- Compare;
- Organizations / issuer detail;
- initial Stats redesign;
- deterministic aggregation rules.

### Gate 6 — Reference and secondary surfaces

COMPLETE.

- Methodology/data/reference;
- Access & Regulation;
- Guides and article layout;
- Updates / Maintenance;
- support/contact/about/legal/utility states.

### Gate 7 — Full redesign verification

COMPLETE.

Final pre-cutover verification included canonical/classification/profile/event/evidence validation, registry integrity, Astro check, production-equivalent build, reproducibility/public-layer verification, internal-link checks, representative desktop/mobile browser inspection, overflow checks, basic accessibility checks, and data-vs-UI spot checks.

The verified redesign history was integrated through PR #636.

### Gate 8 — Production cutover

COMPLETE.

- integration PR: #636 `UI Redesign V4 integration — Gate 8 cutover ready`;
- merged: 2026-09-09;
- merge commit: `60940f0c1ad1d69961e839fa4979a7c4e29d91af`;
- complete redesign moved to `main` in one integration merge;
- subsequent production UI fixes and SEO/structured-data fixes were merged on top of the cutover;
- current public UI uses the V4 observatory system.

### Gate 9 — Post-cutover cleanup

ONGOING / NON-BLOCKING.

Remaining cleanup may remove obsolete outgoing styles/components and historical design machinery that no longer provide value. Cleanup must not delete enduring data, accessibility, route, or deployment contracts.

## Completed post-cutover refinement — Public Stats / Registry Health split

Authority/specification: `docs/stats-spec.md`

### Objective

The completed split assigns two distinct public jobs:

```text
/stats/        understand the stablecoin registry
/maintenance/  understand SOG registry quality and maintenance health
```

### Completed work

- [x] agent authority and analytical specification updated;
- [x] Public Stats rebuilt around executive summary, current lifecycle state, composition, historical failure patterns, event change over time, compact coverage/confidence, and registry drilldowns;
- [x] Registry Health overview added to `/maintenance/` with review freshness, data coverage, public-safe gap aggregates, reviewed maintenance checks, corpus growth, and preserved monthly log;
- [x] DESIGN / roadmap / governance / deployment documentation updated for the split;
- [x] canonical/statistics/registry validations passed;
- [x] Astro check and production-equivalent build passed;
- [x] route/internal-link checks passed;
- [x] representative desktop/mobile outputs passed responsive and UI-contract checks;
- [x] no mock values or private monitoring rows were introduced;
- [x] latest reviewed `main` was synchronized before release;
- [x] integration PR #653 merged both surfaces together;
- [x] stale pre-split production Stats smoke copy was corrected in PR #658 without changing canonical data or the new UI;
- [x] production deployment run #516 completed successfully on `157ec8c391a9134552c9e0beabb3ff430e867fd6`;
- [x] production verification passed for `/stats/`, `/maintenance/`, deterministic public data, stablecoin record JSON, and the cross-surface Stats lifecycle-quality contract.

### Release evidence

```text
Feature PR: #653 Split Public Stats from Registry Health
Feature merge: 0fc86a7d1020e1271306b5c479e2747383b84680
Smoke hotfix PR: #658 Fix Stats production smoke after analytics split
Verified production commit: 157ec8c391a9134552c9e0beabb3ff430e867fd6
Deploy production run: #516 / 34497114140 / success
Canonical data hash: sha256:ed2ecd7561adc8ca0f689d92f4ecd33cf716213c7c3dd7d3e7e8589ce7b529a4
```

The smoke hotfix changed only the production verification contract so it checks the accepted post-split Stats structure instead of obsolete pre-split copy. It did not change canonical facts or the public analytical design.

### Production status

Production changed by the completed refinement: **yes — released and verified**.

The paired Stats / Registry Health release is closed. Future changes to these surfaces are ordinary reviewed product changes unless a new workstream authority says otherwise.

## Continuation rule

For future work, use merged repository specifications as source of truth, check current `main`, and do not infer an unfinished Stats / Registry Health release from the historical implementation branch. Any new substantial workstream should define its own scope instead of reopening this completed release by default.

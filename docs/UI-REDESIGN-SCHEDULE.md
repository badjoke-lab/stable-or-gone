# SOG UI Redesign Schedule

Status: V4 CUTOVER COMPLETE — POST-CUTOVER STATS / REGISTRY HEALTH REFINEMENT ACTIVE
Updated: 2026-09-10
Production branch: `main`
Current refinement branch: `ui/stats-registry-health-20260910`

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
- current public screenshots and repository `main` reflect the V4 observatory UI.

The previous `READY, NOT YET EXECUTED` status was stale after PR #636 merged and is superseded by this schedule update.

### Gate 9 — Post-cutover cleanup

ONGOING / NON-BLOCKING FOR APPROVED PRODUCT REFINEMENTS.

Remaining cleanup may include obsolete outgoing styles/components and historical design machinery that no longer provide value. Cleanup must not delete enduring data, accessibility, route, or deployment contracts.

## Active post-cutover refinement — Public Stats / Registry Health split

Authority/specification: `docs/stats-spec.md`  
Implementation branch: `ui/stats-registry-health-20260910`

### Objective

Separate two different jobs that were previously mixed on `/stats/`:

```text
/stats/        understand the stablecoin registry
/maintenance/  understand SOG registry quality and maintenance health
```

### Work order

- [x] agent authority updated on implementation branch;
- [x] Stats / Registry Health specification updated;
- [x] Public Stats page rebuilt around executive summary, current lifecycle state, composition, historical failure patterns, event change over time, compact coverage/confidence, and registry drilldowns;
- [x] Registry Health overview added to `/maintenance/` with review freshness, data coverage, public-safe gap aggregates, reviewed maintenance checks, corpus growth, and preserved monthly log;
- [ ] update DESIGN / roadmap / governance documents to the post-cutover split;
- [ ] run canonical/statistics/registry validations;
- [ ] run Astro check and production-equivalent build;
- [ ] run route/internal-link checks;
- [ ] inspect representative desktop/mobile `/stats/` and `/maintenance/` outputs;
- [ ] confirm no mock values or private monitoring rows appear;
- [ ] sync latest `main` if it advanced;
- [ ] open integration PR;
- [ ] merge Public Stats and Registry Health together;
- [ ] verify production `/stats/`, `/maintenance/`, `/data/stats.json`, and `/data/maintenance-log.json`.

### Release rule

Do not merge only one half of the split. The public Stats and Registry Health surfaces ship together after validation.

### Production status

Production changed by this post-cutover refinement so far: **no**.

## Required progress report

Every continuation report for the active refinement must state:

- branch/head;
- latest main sync point;
- completed/incomplete surfaces;
- validation status;
- PR/merge state;
- whether production changed.

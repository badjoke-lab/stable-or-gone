# Stable or Gone Roadmap

Updated: 2026-09-11
Status: POST_CUTOVER_STATS_HEALTH_COMPLETE

## Current production state

UI Redesign V4 completed its one-shot production cutover through PR #636, merge commit `60940f0c1ad1d69961e839fa4979a7c4e29d91af`.

The V4 observatory visual system is production lineage. The Public Stats / Registry Health refinement subsequently shipped through PR #653, with the production smoke contract corrected in PR #658. Production deployment run #516 completed successfully on commit `157ec8c391a9134552c9e0beabb3ff430e867fd6`.

Production branch: `main`.

## Completed presentation refinement

The post-cutover split is complete:

```text
Specification: docs/stats-spec.md
Completed implementation branch: ui/stats-registry-health-20260910
Public Stats route: /stats/
Registry Health route: /maintenance/
Feature PR: #653
Verified production commit: 157ec8c391a9134552c9e0beabb3ff430e867fd6
Deploy production run: #516 / success
```

`/stats/` now answers reader-facing analytical questions:

- current lifecycle state;
- stable-asset composition;
- historical failure concentration;
- recorded material-event change over time;
- compact coverage/confidence context;
- drilldown into underlying registry records.

`/maintenance/` now answers registry-operation questions using public-safe aggregates:

- review freshness;
- data-domain coverage;
- known-unknown and evidence-depth aggregates;
- public maintenance / integrity check outcomes;
- reviewed corpus growth;
- monthly public maintenance checkpoints.

The Maintenance surface must not expose monitoring candidates, private queues, candidate URLs, private notes, secrets, or row-level internal task queues.

## Completed release sequence

```text
spec / agent authority update
-> rebuild Public Stats information hierarchy
-> add Registry Health overview while preserving public maintenance log
-> responsive + data-safety validation
-> sync latest main
-> merge both surfaces together in PR #653
-> correct stale pre-split production smoke contract in PR #658
-> production verification on deploy run #516
```

The paired release is closed and must not be treated as an unfinished implementation branch.

## Current operating lane

No new presentation workstream is implicitly opened by this closeout. Normal reviewed work may continue on `main`, including canonical record growth, evidence work, guides, monitoring, article publication, SEO, and ordinary maintenance.

A future substantial presentation or analytical change should establish a new reviewed scope rather than reopening the completed Stats / Registry Health release by default.

## Preserved contracts

Future work must preserve:

- reviewed canonical facts and explicit unknowns;
- evidence/provenance relationships;
- deterministic per-asset JSON;
- public machine-readable outputs;
- stats and maintenance JSON outputs;
- Ledger Series projection;
- official-origin and legacy-redirect contracts;
- Stablecoin logo disposition/fallback rules;
- keyboard/focus fundamentals;
- mobile information preservation;
- production verification.

## Analytical boundaries

No price, market cap, APY, ranking, safety score, risk score, recommendation, or predictive failure probability is authorized.

Historical failure rates are descriptive only and must show the category numerator and denominator. Backing types are multi-select and their denominators can overlap.

Mockup values are not production data.

## Post-cutover cleanup lane

Obsolete outgoing UI components/styles and historical visual-gate machinery may be removed when safe. Cleanup remains non-blocking and must not weaken enduring data, accessibility, route, or deployment contracts.

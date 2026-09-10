# Stable or Gone Roadmap

Updated: 2026-09-10
Status: POST_CUTOVER_STATS_HEALTH_SPLIT

## Current production state

UI Redesign V4 completed its one-shot production cutover through PR #636, merge commit `60940f0c1ad1d69961e839fa4979a7c4e29d91af`.

The V4 observatory visual system is now production lineage. The earlier rule that the outgoing UI remain on `main` until Gate 8 is historical and no longer describes the current public state.

Production branch: `main`.

## Active presentation lane

The active post-cutover refinement separates Public Stats from Registry Health.

```text
Specification: docs/stats-spec.md
Implementation branch: ui/stats-registry-health-20260910
Public Stats route: /stats/
Registry Health route: /maintenance/
```

### Product split

`/stats/` answers reader-facing analytical questions:

- current lifecycle state;
- stable-asset composition;
- historical failure concentration;
- recorded material-event change over time;
- compact coverage/confidence context;
- drilldown into underlying registry records.

`/maintenance/` answers registry-operation questions using public-safe aggregates:

- review freshness;
- data-domain coverage;
- known-unknown and evidence-depth aggregates;
- public maintenance / integrity check outcomes;
- reviewed corpus growth;
- monthly public maintenance checkpoints.

The Maintenance surface must not expose monitoring candidates, private queues, candidate URLs, private notes, secrets, or row-level internal task queues.

## Current work order

```text
spec / agent authority update
-> rebuild Public Stats information hierarchy
-> add Registry Health overview while preserving public maintenance log
-> responsive + data-safety validation
-> sync latest main if needed
-> merge both surfaces together
-> production verification
```

The release unit is the complete Stats / Registry Health split. Do not merge only one side.

## Parallel canonical lane

Canonical record growth, evidence work, guides, monitoring, article publication, and ordinary maintenance may continue independently on `main` while this branch is being completed.

Before release, the refinement branch must sync any newer reviewed `main` changes and re-run critical validation.

## Preserved contracts

Current work must preserve:

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

Obsolete outgoing UI components/styles and historical visual-gate machinery may be removed when safe, but cleanup is secondary to the current approved product refinement and must not weaken enduring data, accessibility, route, or deployment contracts.

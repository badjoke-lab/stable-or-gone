# Stable or Gone non-UI quality program

Status: canonical implementation schedule — paused  
Updated: 2026-07-01  
Registry checkpoint: 98 canonical stable assets

## Purpose

This document records the non-UI continuation that operated while detailed owner visual review was unavailable. It remains the historical source for completed monitoring, data-quality, and reviewed-growth work, but it is no longer the active workstream.

The active workstream is the Editorial Ledger UI v3 remediation defined by:

```text
docs/architecture/approved-editorial-ledger-ui-v3.md
docs/ui-redesign/implementation-plan.md
docs/roadmap.md
```

## Current status

```text
Completed through: Growth C / PR #250
Canonical stable assets: 98
Growth D PR #251: stale draft; do not merge as-is
Non-UI continuation: paused
100-record audit: not started
Non-UI release preparation: not started
Production publication: automatic on main
```

Owner visual review rejected the former Modern Data Product presentation as the final UI. The Editorial Ledger remediation is inserted before Growth D, the 100-record audit, and non-UI release preparation.

After UI v3 closes through PR #273, non-UI work may resume from a fresh branch based on the then-current `main`.

## Required reading order for later resumption

1. `AGENTS.md`
2. `docs/spec-governance.md`
3. `docs/roadmap.md`
4. `docs/deployment-policy.md`
5. this document
6. the relevant canonical data or monitoring specification
7. `docs/migration/registry-v3-baseline.json`
8. the queue, validator, fixture, and supporting audit named by the resumed PR

Relevant canonical specifications:

```text
docs/stable-asset-scope.md
docs/classification-spec.md
docs/data-model-v3-spec.md
docs/stats-spec.md
docs/quality/monitoring-pipeline-spec.md
docs/quality/monitoring-official-source-spec.md
docs/quality/monitoring-official-source-schema.md
docs/quality/monitoring-review-material-spec.md
```

## Fixed operating rules

- Repository specifications remain the source of truth.
- Every non-trivial PR cites the exact queue, audit, schema, fixture, baseline, and validator it changes.
- Unknown values remain unknown unless reviewed evidence supports a canonical value.
- Month- or year-level evidence is not coerced into a day-level date.
- UI work must not clear quality queues through hiding, defaults, or relabeling.
- Candidate monitoring output never writes directly to canonical public data.
- Monitoring baselines are accepted only through a separate human-reviewed repository change.
- Monitoring executions remain read-only and do not update their own baseline.
- Ordinary merged changes publish automatically from `main` under `docs/deployment-policy.md`.
- No growth PR may contain more than two new stable assets.
- Growth must use a fresh branch from the then-current main and preserve all applicable record groups.

## Completed foundation

```text
PR #217-#225 date, reserve, evidence, and traceability quality
PR #226-#229 deployment quality
PR #230-#245 monitoring foundation and coverage
PR #246 final-eight candidate audit
PR #247 Growth A: 92 -> 94
PR #248 Growth B: 94 -> 96
PR #249 source-backed guide work
PR #250 Growth C: 96 -> 98
```

## Resumption order

```text
1. close or archive stale PR #251
2. rebuild Growth D from latest main
3. add no more than two reviewed assets to reach 100
4. run the 100-record registry-wide audit
5. run non-UI release preparation against the actual UI v3 and 100-record state
6. resume monitoring coverage expansion
```

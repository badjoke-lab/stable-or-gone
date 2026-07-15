# PR #368 Record Depth Baseline v2 Refresh Specification

## Status

This specification governs the second work item approved by merged PR #366 and activated by merged PR #367.

PR #368 is internal planning work. It must recompute exactly 112 canonical assets across exactly 16 dimensions using the merged v2 semantics contract. It may not change canonical data, public output, or historical v1 planning checkpoints.

## Authority

- `AGENTS.md`
- `docs/roadmap.md`
- `docs/roadmap-amendments/2026-07-15-pr366-post-pr365-review-gate.md`
- `docs/migration/post-pr365-review-gate-pr366.json`
- `docs/roadmap-amendments/2026-07-15-pr367-planning-dimension-semantics-audit-activation.md`
- `docs/migration/planning-dimension-semantics-audit-pr367.json`
- `config/planning-dimension-semantics-v2.json`
- `config/record-depth-baseline-v2-refresh-pr368.json`

## Required inputs

- `scripts/growth/build-reviewed-record-depth-baseline-pr353.mjs`
- `scripts/load-registry-v2-baseline.mjs`
- `config/record-depth-baseline-v1.json`
- `docs/migration/record-depth-baseline-pr353-summary.json`
- `docs/migration/tier-a-candidate-queue-pr353.json`
- `docs/migration/record-depth-baseline-pr363-summary.json`
- `docs/migration/record-depth-baseline-pr363-delta.json`
- `docs/migration/tier-a-candidate-queue-pr363.json`

## Required semantic axes

Every one of the 1,792 planning cells must retain:

```text
planning quality state
applicability state
observation/source-support state
dimension class
queue role
```

The planning quality states remain:

```text
strong
usable
partial
sparse
absent
not_applicable
```

The applicability states remain:

```text
applicable
not_applicable_to_current_scope
```

The observation states remain:

```text
observed_supported
observed_limited
unobserved
source_unavailable
not_applicable
```

## Scoped conversions

The v2 refresh applies the merged PR #367 semantics rather than treating every missing scoped record as a universal dossier defect.

- `regulatory_notes`: an asset with no canonical note and no named asset-specific regulatory review scope becomes planning `not_applicable`, not a negative regulatory claim.
- `canonical_market_access`: an asset outside the reviewed asset/jurisdiction/platform/function/effective-date scope becomes planning `not_applicable`, not an unavailable, banned, or unsupported claim.
- `redemption`: an explicit source-supported canonical `redemption_profile.status = not_applicable` becomes planning `not_applicable`.
- `reserve_structure`: an explicit source-supported canonical reserve profile status of `not_applicable` becomes planning `not_applicable`.
- `not_applicable` never counts as a gap or queue trigger.
- `unobserved` and `source_unavailable` never become negative factual claims.

## Queue policy

The candidate queue is deterministic and non-ranking.

Only `partial`, `sparse`, or `absent` cells with queue role `material_dossier` may contribute material dossier gaps.

The following do not directly trigger the default dossier queue:

```text
deployment and facet freshness: maintenance_only
regulatory notes and Market Access: scoped_non_dossier
comparison readiness: diagnostic_only
```

A candidate must have at least one material dossier gap and satisfy at least one bounded non-ranking reason rule. PR #369 may manually review and select no more than five existing assets.

## Required outputs

- `docs/migration/record-depth-baseline-v2-pr368.json`
- `docs/migration/record-depth-baseline-v2-pr368-summary.json`
- `docs/migration/record-depth-baseline-v2-pr368-delta.json`
- `docs/migration/tier-a-candidate-queue-v2-pr368.json`
- `scripts/build-record-depth-baseline-v2-refresh-pr368.mjs`
- `scripts/validate-record-depth-baseline-v2-refresh-pr368.mjs`
- `scripts/check-workstream-125.mjs`
- `.github/workflows/pr368-record-depth-baseline-v2-refresh.yml`

## Output rules

- the full baseline contains all 112 assets and all 1,792 cells;
- the summary exposes exact planning, applicability, observation, dimension, and queue counts;
- the delta records every changed v1-to-v2 planning cell without rewriting v1 files;
- the queue is ordered by `asset_slug` ascending and contains no score or rank;
- all outputs are deterministic and internal;
- the four generated JSON outputs share one generation digest.

## Historical preservation

PR #368 must preserve byte-for-byte:

- all PR #353 and PR #363 baseline, delta, and queue files;
- the v1 config and builders;
- the merged PR #367 semantics contract and audit;
- canonical data, statistics history, release-integrity checkpoints, and public outputs.

## Explicit non-goals

- no canonical record, Evidence, Evidence Relation, deployment, or Market Access change;
- no new stable asset;
- no dossier edit in PR #368;
- no public page, explorer, endpoint, ranking, score, recommendation, or automatic promotion;
- no Evidence and Archive Maintenance Batch 3;
- no Market Access Pilot 3;
- no Record Growth Batch 2.

## Handoff

On merge, PR #369 may review the v2 non-ranking queue and select no more than five existing assets. Selection remains manual and source-supported. PR #369 may not add assets, Market Access records, deployment families, rankings, scores, or public surfaces.

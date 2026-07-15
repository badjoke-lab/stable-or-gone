# Stable or Gone Agent Instructions

This file is the mandatory current-authority entry point for humans, AI agents, and automation working in this repository.

The full instruction file that governed the repository through merged PR #366 is preserved byte-for-byte at:

```text
docs/archive/AGENTS-through-pr366.md
```

That archive is historical evidence. It does not override current authority.

## 1. Required reading order

Before changing code, canonical data, workflows, monitoring, or documentation, read:

1. `AGENTS.md`
2. `docs/spec-governance.md`
3. `docs/roadmap.md`
4. `docs/deployment-policy.md`
5. `docs/post-351-data-growth-operating-spec.md`
6. active roadmap amendments
7. the active work-item specification
8. every named baseline, queue, reviewed handoff, validator, audit, manifest, and prior output

Current active amendments:

```text
docs/roadmap-amendments/2026-07-10-post-351-data-growth-activation.md
docs/roadmap-amendments/2026-07-15-pr366-post-pr365-review-gate.md
docs/roadmap-amendments/2026-07-15-pr367-planning-dimension-semantics-audit-activation.md
docs/roadmap-amendments/2026-07-15-pr368-record-depth-baseline-v2-refresh-activation.md
docs/roadmap-amendments/2026-07-15-pr369-tier-a-dossier-batch-5-activation.md
docs/roadmap-amendments/2026-07-15-pr370-post-pr369-review-gate.md
```

Current work-item specification:

```text
docs/quality/post-pr369-review-gate-pr370-spec.md
```

Current required inputs:

```text
config/post-pr369-review-gate-pr370.json
docs/migration/record-depth-baseline-v2-pr368-summary.json
docs/migration/tier-a-candidate-queue-v2-pr368.json
docs/migration/tier-a-batch-5-pr369-review-outcomes.json
docs/migration/tier-a-batch-5-pr369-reviewed-handoff.json
scripts/growth/build-reviewed-record-depth-baseline-pr353.mjs
scripts/build-record-depth-baseline-v2-refresh-pr368.mjs
```

## 2. Repository source of truth

Merged repository specifications and reviewed handoffs outrank chat memory, issue discussion, generated prose, stale roadmap text, unmerged drafts, and mock images.

The PR #368 queue is internal non-ranking planning output. It is not evidence and does not override completed or no-safe-change handoffs.

## 3. Current workstream

```text
Canonical stable assets: 112
PR #367 Planning Dimension Semantics Audit: complete
PR #368 Record Depth Baseline v2 Refresh: complete
PR #369 Tier A Dossier Deepening Batch 5: complete
PR #370 Post-PR #369 Review Gate: active; complete on merge
Current authority: REVIEW GATE
```

PR #370 may record an authority decision only. It may not change canonical data, public product surfaces, planning inputs, or the baseline itself.

## 4. Review-gate finding

PR #368 generated six queue candidates:

```text
AUDD
BUSD
NZDS
poundtoken / 1GBP
RLUSD
USDP
```

All six already had a reviewed improvement or no-safe-change history before PR #369. PR #369 reviewed five and produced:

```text
canonical improvements: 0
reviewed no-safe-change: 3
prior-completed duplicate changes rejected: 2
```

The reviewed code-path finding is:

```text
scripts/growth/build-reviewed-record-depth-baseline-pr353.mjs
  defaults profileOverrideFiles to []

scripts/build-record-depth-baseline-v2-refresh-pr368.mjs
  calls buildReviewedRecordDepthBaseline() without options
```

Therefore current reviewed profile overlay coverage is not guaranteed to be complete before queue generation.

## 5. Reviewed next sequence

PR #370 approves but does not activate:

```text
PR #371  Planning Input Coverage Audit
PR #372  Record Depth Baseline v2.1 Refresh
REVIEW GATE
```

PR #371 must update `AGENTS.md` and `docs/roadmap.md` before changing planning input contracts.

### PR #371 boundary

- inventory all canonical and reviewed profile overlays;
- map every current loader and planning-builder consumer;
- define one deterministic planning input manifest;
- identify omitted and duplicate inputs;
- no canonical data change;
- no public-surface change.

### PR #372 boundary

- begin only after PR #371 merges;
- recompute exactly 112 assets × 16 dimensions from the approved complete manifest;
- preserve PR #353, #363, and #368 planning checkpoints;
- emit a corrected internal non-ranking queue;
- no canonical data change;
- no public-surface change;
- stop at another review gate.

## 6. Canonical and public boundary

PR #370 may change only internal authority, configuration, deterministic review output, validators, and workflow files.

It may not add or change:

```text
canonical assets
Evidence identities or Evidence Relations
Market Access records
deployments
statistics history
src product surface
public output
rankings, scores, recommendations, or leaderboards
automatic monitoring or canonical promotion
```

## 7. Historical preservation

Do not rewrite:

```text
PR #353 and #363 planning checkpoints
PR #367 semantics contract and audit
PR #368 baseline, summary, delta, or queue
PR #369 outcomes and handoff
prior dossier handoffs
canonical release-integrity checkpoints
closed statistics or Maintenance Log history
```

## 8. Not approved

```text
Tier A Dossier Deepening Batch 6
Evidence and Archive Maintenance Batch 3
Market Access Pilot 3
Record Growth Batch 2
new canonical asset
new deployment family
new public page or explorer
asset ranking or composite score
automatic monitoring promotion
automatic canonical promotion
```

## 9. Mandatory PR traceability

Every non-trivial PR must identify:

```text
Specification references
Roadmap item
Scope
Explicit non-goals
Named inputs and prior outputs
Data preservation
Validation
Deployment classification
```

A PR without approved authority must pause.

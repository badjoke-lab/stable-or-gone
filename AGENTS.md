# Stable or Gone Agent Instructions

This file is the mandatory current-authority entry point for humans, AI agents, and automation working in this repository.

The full instruction file that governed the repository through merged PR #366 is preserved byte-for-byte at:

```text
docs/archive/AGENTS-through-pr366.md
```

That archive is historical evidence. It does not override the current authority below.

## 1. Required reading order

Before changing code, canonical data, workflows, monitoring, or documentation, read in this order:

1. `AGENTS.md`
2. `docs/spec-governance.md`
3. `docs/roadmap.md`
4. `docs/deployment-policy.md`
5. `docs/post-351-data-growth-operating-spec.md`
6. every active roadmap amendment named below
7. the current work-item specification
8. every named baseline, queue, reviewed handoff, validator, audit, fixture, research checkpoint, or prior output required by that work item

Current active amendments:

```text
docs/roadmap-amendments/2026-07-10-post-351-data-growth-activation.md
docs/roadmap-amendments/2026-07-15-pr366-post-pr365-review-gate.md
docs/roadmap-amendments/2026-07-15-pr367-planning-dimension-semantics-audit-activation.md
docs/roadmap-amendments/2026-07-15-pr368-record-depth-baseline-v2-refresh-activation.md
docs/roadmap-amendments/2026-07-15-pr369-tier-a-dossier-batch-5-activation.md
```

Current work-item specification:

```text
docs/quality/tier-a-dossier-batch-5-pr369-spec.md
```

Current required inputs:

```text
config/tier-a-dossier-batch-5-pr369.json
docs/migration/record-depth-baseline-v2-pr368-summary.json
docs/migration/tier-a-candidate-queue-v2-pr368.json
docs/migration/tier-a-batch-1-pr354-reviewed-handoff.json
docs/migration/tier-a-batch-2-pr355-reviewed-handoff.json
docs/migration/tier-a-batch-3-pr357-reviewed-handoff.json
docs/migration/tier-a-batch-4-pr364-reviewed-handoff.json
docs/migration/current-canonical-checkpoint.json
```

## 2. Repository source of truth

Merged repository specifications and reviewed handoffs outrank chat memory, issue discussion, generated prose, stale roadmap text, unmerged drafts, and mock images.

The PR #368 queue is an internal non-ranking planning queue. It does not override prior reviewed handoffs and does not authorize automatic or duplicate canonical edits.

## 3. Current workstream

```text
Canonical stable assets: 112
PR #365 Evidence and Archive Maintenance Batch 2: complete
PR #366 Post-PR #365 Review Gate: complete
PR #367 Planning Dimension Semantics Audit: complete
PR #368 Record Depth Baseline v2 Refresh: complete
PR #369 Tier A Dossier Deepening Batch 5: active; complete on merge
REVIEW GATE: next and mandatory
```

Approved sequence:

```text
PR #367 — complete
PR #368 — complete
PR #369 — active
REVIEW GATE
```

No PR after #369 is pre-authorized.

## 4. PR #369 exact authority

PR #369 may manually review no more than five existing assets from the merged PR #368 queue.

Selected review set:

```text
AUDD
BUSD
NZDS
poundtoken / 1GBP
USDP
```

RLUSD is not selected because it already received reviewed PR #354 legal/redemption work, a PR #364 no-safe-change re-review, and bounded PR #359 Market Access work.

Required outputs:

```text
docs/migration/tier-a-batch-5-pr369-review-outcomes.json
docs/migration/tier-a-batch-5-pr369-reviewed-handoff.json
scripts/build-tier-a-dossier-batch-5-pr369.mjs
scripts/validate-tier-a-dossier-batch-5-pr369.mjs
```

## 5. Review and change rules

- Canonical changes require new reviewed source support that safely resolves a material dossier gap.
- Do not force a change to create nominal batch yield.
- Do not duplicate a completed prior canonical improvement.
- A prior no-safe-change outcome may be revisited only when a new source signal justifies review.
- Unknown remains unknown when current operation, redemption, ownership, or event date cannot be established safely.
- A planning gap is not a factual claim that a real-world feature is absent.
- Monitoring and editorial research cannot self-promote into canonical data.

Configured outcomes:

```text
AUDD       reviewed_no_safe_change — prior PR #357
BUSD       prior_completed_no_duplicate_change — prior PR #354
NZDS       reviewed_no_safe_change — prior PR #357
poundtoken reviewed_no_safe_change — prior PR #364
USDP       prior_completed_no_duplicate_change — prior PR #355
```

The valid expected canonical yield is zero unless a new reviewed source signal is introduced before merge.

## 6. Canonical and public boundary

PR #369 may not add or change:

```text
canonical assets
Evidence identities or Evidence Relations
Market Access records
deployment families
statistics history
public pages or public machine-readable outputs
rankings, scores, recommendations, or leaderboards
automatic monitoring or canonical promotion
```

`data/`, `src/`, and `public/` must remain unchanged unless the PR is explicitly revised with new source-supported canonical scope and a matching validator amendment. The current configured and reviewed outcome requires those trees to remain unchanged.

## 7. Historical preservation

Do not rewrite:

```text
PR #353 or PR #363 planning checkpoints
PR #367 semantics contract and audit
PR #368 v2 baseline, delta, summary, or queue
prior reviewed dossier handoffs
closed statistics or Maintenance Log history
canonical release-integrity checkpoints
```

## 8. Monitoring and Market Access

Monitoring remains private, review-only, and read-only with respect to canonical data.

Market Access remains asset-, jurisdiction-, platform-, function-, effective-date-, and evidence-scoped. No Market Access Pilot 3 or new public Market Access surface is authorized.

## 9. Not approved

```text
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

## 10. Next gate

After PR #369 merges, stop at `REVIEW GATE`.

The review gate must evaluate:

```text
zero-change PR #369 yield
repeated prior-review candidates in the PR #368 queue
planning-builder and overlay coverage
source availability
archive maintenance burden
Market Access evidence breadth
monitoring usefulness
monthly maintenance burden
verified external usage evidence
```

A new numbered sequence requires a new reviewed roadmap amendment.

## 11. Mandatory PR traceability

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

A PR that cannot identify its approved roadmap item and governing specification must pause.

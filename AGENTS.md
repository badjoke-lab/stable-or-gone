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
docs/roadmap-amendments/2026-07-15-pr373-post-pr372-review-gate.md
docs/roadmap-amendments/2026-07-15-pr374-planning-queue-review-history-contract-activation.md
```

Current work-item specification:

```text
docs/quality/planning-queue-review-history-contract-pr374-spec.md
```

Current required inputs:

```text
config/planning-queue-review-history-v1-pr374.json
config/tier-a-dossier-batch-1-pr354.json
docs/migration/tier-a-batch-1-pr354-reviewed-handoff.json
config/tier-a-dossier-batch-2-pr355.json
docs/migration/tier-a-batch-2-pr355-reviewed-handoff.json
docs/migration/tier-a-batch-3-pr357-review-outcomes.json
docs/migration/tier-a-dossier-batch-4-pr364-findings.json
docs/migration/tier-a-batch-4-pr364-reviewed-handoff.json
docs/migration/tier-a-batch-5-pr369-review-outcomes.json
docs/migration/tier-a-candidate-queue-v2-1-pr372.json
docs/migration/post-pr372-review-gate-pr373.json
```

## 2. Repository source of truth

Merged repository specifications and reviewed handoffs outrank chat memory, issue discussion, generated prose, stale roadmap text, unmerged drafts, and mock images.

Review history is internal planning authority. It does not alter canonical facts and cannot be inferred from queue presence alone.

## 3. Current workstream

```text
Canonical stable assets: 112
PR #373 Post-PR #372 Review Gate: complete
PR #374 Planning Queue Review-History Contract Audit: active; complete on merge
PR #375 Candidate Queue v2.2 Refresh: next after PR #374
REVIEW GATE: mandatory after PR #375
```

Approved sequence:

```text
PR #374  Planning Queue Review-History Contract Audit — active
PR #375  Candidate Queue v2.2 Refresh — next
REVIEW GATE
```

## 4. Binding problem statement

The PR #372 queue contains:

```text
AUDD
NZDS
poundtoken / 1GBP
```

Every material dossier gap for those three assets already has a reviewed no-safe-change outcome. The current queue builder does not consume that history, so the same work can recur without a new source signal.

## 5. PR #374 exact authority

PR #374 must:

- inventory reviewed dossier history from PR #354, #355, #357, #364, and #369;
- normalize review events by asset and dimension;
- resolve the latest reviewed event as effective;
- distinguish reviewed complete, partial, and no-safe-change outcomes;
- define deterministic suppression and reactivation states;
- prohibit automatic time expiry;
- require a reviewed new-source or semantics-change signal for reactivation;
- project queue eligibility without recomputing the baseline;
- emit deterministic manifest and audit outputs;
- change no canonical or public data.

Expected inventory:

```text
history sources: 5
history events: 48
reviewed assets: 18
effective asset-dimension outcomes: 33
reviewed complete: 20
reviewed partial: 0
reviewed no-safe-change: 13
current queue candidates: 3
fully suppressed: 3
projected v2.2 queue without new signals: 0
```

## 6. Suppression and reactivation rules

The primary key is:

```text
asset_id + dimension_id
```

The latest reviewed event wins. A reviewed complete, partial, or no-safe-change outcome suppresses the same dimension until one of these reviewed triggers exists:

```text
reviewed_new_source
reviewed_semantics_change
```

The following do not reactivate a dimension:

```text
time elapsed
queue presence
planning-state movement alone
maintenance-only gaps
unreviewed monitoring rows
```

## 7. Required outputs

```text
docs/migration/planning-queue-review-history-manifest-pr374.json
docs/migration/planning-queue-review-history-audit-pr374.json
```

PR #375 may consume only the reviewed PR #374 contract and manifest.

## 8. Canonical and public boundary

PR #374 may change only internal authority, configuration, deterministic builders, generated internal outputs, validators, and workflow files.

It may not add or change:

```text
data/
src/
public/
canonical assets or record families
Evidence identities or relations
Market Access records
deployments
statistics history
baseline cells
historical queues
rankings, scores, recommendations, or leaderboards
automatic source, monitoring, or canonical promotion
```

## 9. Historical preservation

Do not rewrite:

```text
PR #353 and #363 planning checkpoints
PR #367 semantics contract and audit
PR #368 baseline and queue outputs
PR #369 outcomes and handoff
PR #370 and #373 review-gate reports
PR #371 manifest and audit
PR #372 baseline, summary, delta, or queue
prior dossier handoffs and findings
canonical release-integrity checkpoints
closed statistics or Maintenance Log history
```

## 10. Not approved

```text
Tier A Dossier Deepening Batch 6
Evidence and Archive Maintenance Batch 3
Market Access Pilot 3
Record Growth Batch 2
new public page or explorer
asset ranking or composite score
automatic monitoring promotion
automatic canonical promotion
```

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

A PR without approved authority must pause.

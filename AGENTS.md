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
docs/roadmap-amendments/2026-07-15-pr375-candidate-queue-v2-2-refresh-activation.md
```

Current work-item specification:

```text
docs/quality/candidate-queue-v2-2-refresh-pr375-spec.md
```

Current required inputs:

```text
config/candidate-queue-v2-2-refresh-pr375.json
docs/migration/record-depth-baseline-v2-1-pr372.json
docs/migration/tier-a-candidate-queue-v2-1-pr372.json
config/planning-queue-review-history-v1-pr374.json
docs/migration/planning-queue-review-history-manifest-pr374.json
docs/migration/planning-queue-review-history-audit-pr374.json
docs/migration/post-pr372-review-gate-pr373.json
```

## 2. Repository source of truth

Merged repository specifications and reviewed handoffs outrank chat memory, issue discussion, generated prose, stale roadmap text, unmerged drafts, and mock images.

The PR #374 contract and manifest are the only approved review-history inputs for PR #375. Queue presence, time elapsed, and planning-state movement are not reactivation signals.

## 3. Current workstream

```text
Canonical stable assets: 112
PR #374 Planning Queue Review-History Contract Audit: complete
PR #375 Candidate Queue v2.2 Refresh: active; complete on merge
REVIEW GATE: next and mandatory
```

Approved sequence:

```text
PR #374  Planning Queue Review-History Contract Audit — complete
PR #375  Candidate Queue v2.2 Refresh — active
REVIEW GATE
```

## 4. Binding review-history result

```text
history sources: 5
history events: 48
reviewed assets: 18
effective asset-dimension outcomes: 33
reviewed complete: 20
reviewed partial: 0
reviewed no-safe-change: 13
```

The PR #372 source queue contains AUDD, NZDS, and poundtoken. Every material dossier gap is suppressed by the latest reviewed no-safe-change outcome. There are no reviewed reactivation signals.

## 5. PR #375 exact authority

PR #375 must:

- consume the exact PR #374 contract, manifest, and audit;
- read the PR #372 v2.1 queue without recomputing its baseline;
- evaluate each material dossier gap at dimension level;
- retain only unreviewed or reviewed-reactivated gaps;
- exclude an asset when all material dossier gaps are suppressed;
- preserve full suppression explanations in the delta;
- emit a deterministic internal v2.2 queue and delta;
- remain non-ranking and manual-review-only;
- stop at `REVIEW GATE`.

Expected result:

```text
source candidates: 3
suppressed candidates: 3
reactivated candidates: 0
output candidates: 0
removed: audd, nzds, poundtoken
```

## 6. Required outputs

```text
docs/migration/tier-a-candidate-queue-v2-2-pr375.json
docs/migration/tier-a-candidate-queue-v2-2-pr375-delta.json
```

## 7. Canonical and public boundary

PR #375 may change only internal authority, configuration, deterministic builders, generated internal outputs, validators, and workflow files.

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

## 8. Historical preservation

Do not rewrite:

```text
PR #353 and #363 planning checkpoints
PR #367 semantics contract and audit
PR #368 baseline and queue outputs
PR #369 outcomes and handoff
PR #370 and #373 review-gate reports
PR #371 manifest and audit
PR #372 baseline, summary, delta, or queue
PR #374 contract, manifest, or audit
prior dossier handoffs and findings
canonical release-integrity checkpoints
closed statistics or Maintenance Log history
```

## 9. Not approved

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

## 10. Mandatory PR traceability

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

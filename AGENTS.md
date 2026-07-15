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
docs/roadmap-amendments/2026-07-15-pr370-post-pr369-review-gate.md
docs/roadmap-amendments/2026-07-15-pr371-planning-input-coverage-audit-activation.md
docs/roadmap-amendments/2026-07-15-pr372-record-depth-baseline-v2-1-refresh-activation.md
docs/roadmap-amendments/2026-07-15-pr373-post-pr372-review-gate.md
```

Current work-item specification:

```text
docs/quality/post-pr372-review-gate-pr373-spec.md
```

Current required inputs:

```text
config/post-pr372-review-gate-pr373.json
docs/migration/record-depth-baseline-v2-1-pr372-summary.json
docs/migration/record-depth-baseline-v2-1-pr372-delta.json
docs/migration/tier-a-candidate-queue-v2-1-pr372.json
docs/migration/tier-a-batch-5-pr369-review-outcomes.json
docs/migration/current-canonical-checkpoint.json
docs/migration/market-access-pilot-2-pr359-reviewed-handoff.json
data/monthly-maintenance-log.json
```

## 2. Repository source of truth

Merged repository specifications and reviewed handoffs outrank chat memory, issue discussion, generated prose, stale roadmap text, unmerged drafts, and mock images.

The PR #372 corrected queue is internal non-ranking planning output. It does not override prior reviewed no-safe-change outcomes.

## 3. Current workstream

```text
Canonical stable assets: 112
PR #371 Planning Input Coverage Audit: complete
PR #372 Record Depth Baseline v2.1 Refresh: complete
PR #373 Post-PR #372 Review Gate: active; complete on merge
Current authority: REVIEW GATE
```

PR #373 may record an authority decision only. It may not change canonical data, public product surfaces, queue eligibility contracts, or the baseline itself.

## 4. Binding PR #372 result

```text
complete planning profile files: 29
assets: 112
dimensions: 16
cells: 1,792
changed cells from PR #368: 4
changed assets: BUSD, PYUSD, RLUSD, USDP
changed dimension: redemption
state movement: partial → strong
corrected queue candidates: 3
```

Corrected queue:

```text
AUDD
NZDS
poundtoken / 1GBP
```

All three received `reviewed_no_safe_change` outcomes in PR #369. The queue contains no new source signal and the current builder does not consume prior review-history handoffs.

## 5. Reviewed next sequence

PR #373 approves but does not activate:

```text
PR #374  Planning Queue Review-History Contract Audit
PR #375  Candidate Queue v2.2 Refresh
REVIEW GATE
```

PR #374 must update `AGENTS.md` and `docs/roadmap.md` before changing queue eligibility contracts.

### PR #374 boundary

- inventory reviewed dossier and no-safe-change handoffs;
- define deterministic suppression, expiry, and new-source reactivation semantics;
- define one review-history input contract;
- no baseline recomputation;
- no canonical or public change.

### PR #375 boundary

- begin only after PR #374 merges;
- apply the approved history contract to the PR #372 v2.1 baseline;
- preserve all historical baselines and queues;
- emit an internal non-ranking v2.2 queue and delta;
- no canonical or public change;
- stop at another review gate.

## 6. Deferred work

The next sequence does not authorize:

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

Archive maintenance remains important: 169 Evidence records have no recorded archive. Market Access remains narrow at eight canonical records. Both remain deferred until the queue-history sequence completes.

## 7. Canonical and public boundary

PR #373 may change only internal authority, configuration, deterministic review output, validators, and workflow files.

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
historical baselines or queues
rankings, scores, recommendations, or leaderboards
automatic monitoring or canonical promotion
```

## 8. Historical preservation

Do not rewrite:

```text
PR #353 and #363 planning checkpoints
PR #367 semantics contract and audit
PR #368 baseline, summary, delta, or queue
PR #369 outcomes and handoff
PR #370 review-gate report
PR #371 manifest and audit
PR #372 baseline, summary, delta, or queue
prior dossier handoffs
canonical release-integrity checkpoints
closed statistics or Maintenance Log history
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

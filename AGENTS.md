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
docs/roadmap-amendments/2026-07-15-pr376-post-pr375-review-gate.md
```

Current work-item specification:

```text
docs/quality/post-pr375-review-gate-pr376-spec.md
```

Current required inputs:

```text
config/post-pr375-review-gate-pr376.json
docs/migration/tier-a-candidate-queue-v2-2-pr375.json
docs/migration/tier-a-candidate-queue-v2-2-pr375-delta.json
docs/migration/evidence-correction-outcomes-pr360.json
docs/migration/evidence-archive-maintenance-queue-pr365.json
docs/migration/evidence-archive-maintenance-outcomes-pr365.json
docs/migration/evidence-archive-maintenance-batch-2-pr365-reviewed-handoff.json
scripts/build-evidence-archive-maintenance-queue-pr365.mjs
docs/migration/current-canonical-checkpoint.json
```

## 2. Repository source of truth

Merged repository specifications and reviewed handoffs outrank chat memory, issue discussion, generated prose, stale roadmap text, unmerged drafts, and mock images.

The PR #375 zero-candidate queue is binding internal planning evidence. No dossier batch can be inferred from suppressed historical candidates.

## 3. Current workstream

```text
Canonical stable assets: 112
PR #374 Planning Queue Review-History Contract Audit: complete
PR #375 Candidate Queue v2.2 Refresh: complete
PR #376 Post-PR #375 Review Gate: active; complete on merge
Current authority: REVIEW GATE
```

PR #376 may record an authority decision only. It may not change canonical data, public surfaces, archive queue eligibility, or Evidence records.

## 4. Binding zero-queue result

```text
source dossier candidates: 3
suppressed candidates: 3
reactivated candidates: 0
current candidates: 0
```

Tier A Dossier Deepening Batch 6 remains unapproved.

## 5. Archive-maintenance finding

```text
canonical Evidence: 559
archive recorded: 390
archive not recorded: 169
PR #360 selected / changed / no-safe: 10 / 8 / 2
PR #365 selected / changed / no-safe: 10 / 3 / 7
```

The PR #365 queue builder excludes PR #360 selected identities but does not consume PR #365 reviewed outcomes or a complete archive review-history manifest. Another queue can therefore repeat reviewed no-safe-change work.

## 6. Reviewed next sequence

PR #376 approves but does not activate:

```text
PR #377  Evidence Archive Review-History Contract Audit
PR #378  Evidence Archive Maintenance Queue v2 Refresh
REVIEW GATE
```

PR #377 must update `AGENTS.md` and `docs/roadmap.md` before changing archive queue eligibility contracts.

### PR #377 boundary

- inventory PR #360 and PR #365 outcomes by canonical Evidence identity;
- define reviewed complete and no-safe-change suppression;
- define reviewed exact-capture and source-replacement reactivation signals;
- prohibit time-only or queue-presence reactivation;
- no canonical or public change.

### PR #378 boundary

- begin only after PR #377 merges;
- apply the reviewed history contract to the 169 archive-not-recorded Evidence identities;
- exclude prior no-safe-change identities without a reviewed signal;
- emit a bounded internal non-ranking queue only;
- no canonical or public change;
- stop at another review gate.

## 7. Canonical and public boundary

PR #376 may change only internal authority, configuration, deterministic review output, validators, and workflow files.

It may not add or change:

```text
data/
src/
public/
canonical assets or record families
Evidence identities, relations, URLs, or archived URLs
Market Access records
deployments
statistics history
historical queues or outcomes
rankings, scores, recommendations, or leaderboards
automatic source, monitoring, or canonical promotion
```

## 8. Not approved

```text
Evidence and Archive Maintenance Batch 3 canonical changes
Tier A Dossier Deepening Batch 6
Market Access Pilot 3
Record Growth Batch 2
new public page or explorer
asset or Evidence ranking
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

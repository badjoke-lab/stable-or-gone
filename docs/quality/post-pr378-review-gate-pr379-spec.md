# PR #379 Post-PR #378 Review Gate Specification

Status: active internal authority review and output recovery  
Review PR: 379  
Public output: false

## Objective

Recover the two omitted deterministic PR #378 internal outputs, then review the fresh history-aware archive-maintenance queue and decide whether one bounded canonical Evidence maintenance batch is authorized.

## Required inputs

```text
config/post-pr378-review-gate-pr379.json
config/evidence-archive-maintenance-queue-v2-pr378.json
scripts/build-evidence-archive-maintenance-queue-v2-pr378.mjs
docs/migration/evidence-archive-maintenance-queue-v2-pr378.json
docs/migration/evidence-archive-maintenance-queue-v2-pr378-delta.json
config/evidence-archive-review-history-v1-pr377.json
docs/migration/evidence-archive-review-history-manifest-pr377.json
docs/migration/evidence-archive-review-history-audit-pr377.json
docs/migration/current-canonical-checkpoint.json
docs/migration/evidence-correction-outcomes-pr360.json
docs/migration/evidence-archive-maintenance-outcomes-pr365.json
docs/migration/market-access-pilot-2-pr359-reviewed-handoff.json
data/monthly-maintenance-log.json
```

## Recovery requirement

The PR #378 queue and delta were computed during PR validation but omitted from the merged file set. PR #379 must regenerate them byte-deterministically from the merged PR #378 builder and immutable inputs before review-gate evaluation. Recovery may not change the PR #378 config, builder, history contract, canonical Evidence, or public output.

## Mandatory review questions

1. Are the recovered queue and delta deterministic products of the merged PR #378 builder?
2. Is the queue bounded to ten fresh canonical Evidence identities?
3. Were all ten reviewed unresolved history identities suppressed?
4. Is any automatic or unreviewed reactivation present?
5. Are exact-capture and source-replacement rules sufficient for canonical review?
6. Is one bounded Batch 3 preferable to Market Access or dossier work?
7. Is any new public surface or automatic promotion authorized?

## Binding findings

- The queue starts from 559 canonical Evidence records, with 390 archive-recorded and 169 archive-not-recorded.
- Ten reviewed unresolved Evidence identities are suppressed.
- No reviewed identity is reactivated.
- The queue selects exactly ten fresh identities under deterministic priority and Evidence-ID ordering.
- PR #360 changed eight of ten reviewed identities; PR #365 changed three of ten, showing that safe yield varies and no change can be presumed.
- The history-aware queue is sufficiently bounded for one manual reviewed execution batch.
- The dossier queue remains empty and Market Access has no approved third-pilot candidate manifest.

## Approved next sequence

```text
PR #380 Evidence and Archive Maintenance Batch 3
REVIEW GATE
```

## PR #380 execution rule

For each selected Evidence identity, exactly one reviewed outcome is required:

```text
dated_exact_archive_added
reviewed_source_replacement
reviewed_no_safe_change
```

Canonical changes are allowed only for the first two reviewed outcomes. Automatic capture or source replacement is prohibited.

## Required outputs

```text
docs/migration/evidence-archive-maintenance-queue-v2-pr378.json
docs/migration/evidence-archive-maintenance-queue-v2-pr378-delta.json
docs/migration/post-pr378-review-gate-pr379.json
```

## Prohibited work

- any identity outside the PR #378 queue;
- any change to PR #378 selection semantics while recovering outputs;
- automatic archive or source promotion;
- new public surfaces;
- dossier, Market Access, or record-growth work;
- ranking, scoring, recommendation, or historical reviewed-input rewrite.

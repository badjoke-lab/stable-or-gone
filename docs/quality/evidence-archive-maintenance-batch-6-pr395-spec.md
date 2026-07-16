# PR #395 Evidence and Archive Maintenance Batch 6 Specification

Status: active bounded reviewed maintenance  
Review PR: 395  
Public output: false

## Objective

Review the ten PR #393 Queue v5 Evidence identities and apply only source-preserving archive maintenance supported by exact-source capture verification.

## Required inputs

```text
config/evidence-archive-maintenance-batch-6-pr395.json
config/evidence-archive-maintenance-batch-6-pr395-decisions.json
docs/migration/post-pr393-review-gate-pr394.json
docs/migration/evidence-archive-maintenance-queue-v5-pr393.json
docs/migration/evidence-archive-maintenance-queue-v5-pr393-delta.json
docs/migration/evidence-archive-maintenance-batch-6-pr395-review-queue.json
docs/migration/current-canonical-checkpoint.json
```

## Reviewed result

Nine selected identities have exact-canonical-URL HTTP 200 captures accepted by timestamp and digest. The Sky documentation root has no exact capture and its live redirect does not preserve the Dai documentation claim scope.

```text
selected: 10
changed: 9
nine dated exact archive additions
one reviewed no-safe-change
dated_exact_archive_added: 9
reviewed_source_replacement: 0
reviewed_no_safe_change: 1
archive recorded: 416 -> 425
archive not recorded: 143 -> 134
```

No source replacement or inferred promotion is used.

## Canonical boundary

Before PR #395:

```text
Assets: 112
Evidence identities: 559
Evidence Relations: 559
Archive recorded: 416
Archive not recorded: 143
Market Access records: 8
```

After the reviewed decisions:

```text
Assets: 112
Evidence identities: 559
Evidence Relations: 559
Archive recorded: 425
Archive not recorded: 134
Market Access records: 8
```

PR #395 may change exactly nine existing Evidence rows. On each changed row, only `archived_url` may change. `sog_src_makerdao_docs_dai` must remain byte-equivalent to its base canonical row.

## Required outputs

```text
docs/migration/evidence-archive-maintenance-batch-6-pr395-review-queue.json
docs/migration/evidence-archive-maintenance-outcomes-pr395.json
docs/migration/evidence-archive-maintenance-batch-6-pr395-reviewed-handoff.json
docs/migration/current-canonical-checkpoint.json
docs/migration/current-stats-history-checkpoint.json
data/stats-history.json
docs/migration/registry-release-integrity-baseline.json
```

## Prohibited work

- Evidence identities outside Queue v5;
- automatic capture or replacement promotion;
- new Evidence identities or Evidence Relations;
- source URL replacement in this reviewed batch;
- non-Evidence canonical changes;
- Market Access, dossier, growth, ranking, score, recommendation, or public-page work;
- rewrite of historical queue, history, authority, outcome, checkpoint, or release-baseline files.

## Exit condition

All ten selected identities have exactly one reviewed outcome, the nine dated exact archive additions and one no-safe-change are reproducible from the decision and probe files, all canonical/release/build validations pass, and PR #395 stops at `REVIEW GATE`.

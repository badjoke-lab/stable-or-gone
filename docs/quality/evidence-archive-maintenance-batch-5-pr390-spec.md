# PR #390 Evidence and Archive Maintenance Batch 5 Specification

Status: active bounded reviewed maintenance  
Review PR: 390  
Public output: false

## Objective

Manually review the ten PR #388 Queue v4 Evidence identities and apply only source-preserving archive maintenance supported by exact-source capture verification.

## Required inputs

```text
config/evidence-archive-maintenance-batch-5-pr390.json
config/evidence-archive-maintenance-batch-5-pr390-decisions.json
docs/migration/post-pr388-review-gate-pr389.json
docs/migration/evidence-archive-maintenance-queue-v4-pr388.json
docs/migration/evidence-archive-maintenance-queue-v4-pr388-delta.json
docs/migration/evidence-archive-maintenance-batch-5-pr390-review-queue.json
docs/migration/current-canonical-checkpoint.json
```

## Review procedure

1. probe each canonical URL and record final live URL, response state, and sampled content identity;
2. query Wayback CDX using exact URL matching and HTTP 200 captures only;
3. manually review capture identity against Evidence title, publisher, and claim scopes;
4. choose exactly one outcome per selected identity;
5. apply canonical changes only from the reviewed decision file;
6. record outcomes, reviewed handoff, same-count checkpoint, stats history, and release-integrity baseline;
7. stop at a review gate.

## Reviewed result

All ten selected identities have an exact-canonical-URL HTTP 200 capture accepted by timestamp and digest.

```text
selected: 10
changed: 10
dated_exact_archive_added: 10
reviewed_source_replacement: 0
reviewed_no_safe_change: 0
archive recorded: 406 -> 416
archive not recorded: 153 -> 143
```

The accepted canonical action is ten dated exact archive additions. No source URL replacement or inferred promotion is used.

## Canonical boundary

Before PR #390:

```text
Assets: 112
Evidence identities: 559
Evidence Relations: 559
Archive recorded: 406
Archive not recorded: 153
Market Access records: 8
```

After the reviewed decisions:

```text
Assets: 112
Evidence identities: 559
Evidence Relations: 559
Archive recorded: 416
Archive not recorded: 143
Market Access records: 8
```

PR #390 may change exactly ten existing Evidence rows. On each selected row, only `archived_url` may change.

## Required outputs

```text
docs/migration/evidence-archive-maintenance-batch-5-pr390-review-queue.json
docs/migration/evidence-archive-maintenance-outcomes-pr390.json
docs/migration/evidence-archive-maintenance-batch-5-pr390-reviewed-handoff.json
docs/migration/current-canonical-checkpoint.json
docs/migration/current-stats-history-checkpoint.json
data/stats-history.json
docs/migration/registry-release-integrity-baseline.json
```

## Prohibited work

- Evidence identities outside Queue v4;
- automatic capture or replacement promotion;
- new Evidence identities or Evidence Relations;
- source URL replacement in this reviewed batch;
- non-Evidence canonical changes;
- Market Access, dossier, growth, ranking, score, recommendation, or public-page work;
- rewrite of historical queue, history, authority, outcome, checkpoint, or release-baseline files.

## Exit condition

All ten selected identities have exactly one reviewed outcome, the ten dated exact archive additions are reproducible from the decision and probe files, all canonical/release/build validations pass, and the handoff ends at `REVIEW GATE`.

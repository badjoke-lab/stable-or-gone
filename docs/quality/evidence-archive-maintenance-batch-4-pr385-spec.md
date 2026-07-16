# PR #385 Evidence and Archive Maintenance Batch 4 Specification

Status: active bounded reviewed maintenance  
Review PR: 385  
Public output: false

## Objective

Manually review the ten PR #383 Queue v3 Evidence identities and apply only source-preserving archive maintenance that is supported by exact capture or reviewed source-equivalence evidence.

## Required inputs

```text
config/evidence-archive-maintenance-batch-4-pr385.json
docs/migration/post-pr383-review-gate-pr384.json
docs/migration/evidence-archive-maintenance-queue-v3-pr383.json
docs/migration/evidence-archive-maintenance-queue-v3-pr383-delta.json
docs/migration/current-canonical-checkpoint.json
```

## Review procedure

1. probe each canonical URL and record the final live URL, response state, and sampled content identity;
2. query Wayback CDX using exact URL matching and HTTP 200 captures only;
3. manually review capture identity against the Evidence title, publisher, and claim scopes;
4. choose exactly one outcome per selected identity;
5. apply canonical changes only from the reviewed decision file;
6. record outcomes, reviewed handoff, same-count checkpoint, stats history, and release-integrity baseline;
7. stop at a review gate.

## Allowed outcomes

### `dated_exact_archive_added`

Requires an exact canonical source URL capture with HTTP 200, a capture timestamp and digest, and a reviewed source-version scope.

### `reviewed_source_replacement`

Requires a successful reviewed redirect or replacement source plus publisher/product identity and claim-scope equivalence. The replacement must not be inferred from similarity alone.

### `reviewed_no_safe_change`

Used when no exact capture or equivalent replacement can be established safely. The canonical row remains unchanged.

## Canonical boundary

Before PR #385:

```text
Assets: 112
Evidence identities: 559
Evidence Relations: 559
Archive recorded: 399
Archive not recorded: 160
Market Access records: 8
```

PR #385 may change at most ten existing Evidence rows. It may add no identity, remove no identity, and change no Evidence Relation.

## Required outputs

```text
docs/migration/evidence-archive-maintenance-batch-4-pr385-review-queue.json
docs/migration/evidence-archive-maintenance-outcomes-pr385.json
docs/migration/evidence-archive-maintenance-batch-4-pr385-reviewed-handoff.json
docs/migration/current-canonical-checkpoint.json
docs/migration/current-stats-history-checkpoint.json
data/stats-history.json
docs/migration/registry-release-integrity-baseline.json
```

## Prohibited work

- Evidence identities outside Queue v3;
- automatic capture or replacement promotion;
- new Evidence identities or Evidence Relations;
- non-Evidence canonical changes;
- Market Access, dossier, growth, ranking, score, recommendation, or public-page work;
- rewrite of historical queue, history, authority, outcome, or checkpoint files.

## Exit condition

All ten selected identities have exactly one reviewed outcome, every accepted canonical change is reproducible from the decision and probe files, all canonical/release/build validations pass, and the handoff ends at `REVIEW GATE`.
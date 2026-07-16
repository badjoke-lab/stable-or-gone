# PR #383 Evidence Archive Maintenance Queue v3 Refresh Specification

Status: active internal planning specification  
Review PR: 383  
Public output: false

## Objective

Generate a fresh bounded Evidence archive-maintenance review queue using the reviewed PR #382 history v2 contract.

## Required inputs

```text
config/evidence-archive-maintenance-queue-v3-pr383.json
docs/migration/current-canonical-checkpoint.json
config/evidence-archive-review-history-v2-pr382.json
docs/migration/evidence-archive-review-history-manifest-v2-pr382.json
docs/migration/evidence-archive-review-history-audit-v2-pr382.json
docs/migration/post-pr380-review-gate-pr381.json
docs/migration/evidence-archive-maintenance-queue-v2-pr378.json
```

## Selection rule

1. load current canonical Evidence identities;
2. keep identities with no recorded archive and a non-empty source URL;
3. exclude aliases;
4. exclude source URLs already pointing to Web Archive;
5. exclude the ten reviewed suppressed identities;
6. include reviewed reactivated identities whose history v2 row explicitly sets `candidate_eligible_under_contract = true`;
7. place reviewed reactivated identities first so the reviewed signal is not lost behind ordinary unreviewed gaps;
8. order each tier by regulator/legal, official issuer/product, reserve/audit, reporting/research, then other;
9. break ties by Evidence ID;
10. select at most ten.

This is a deterministic manual-review queue, not an Evidence ranking or safety score.

## Required outputs

```text
docs/migration/evidence-archive-maintenance-queue-v3-pr383.json
docs/migration/evidence-archive-maintenance-queue-v3-pr383-delta.json
```

The queue must include exact history v2 provenance and must identify selected reviewed-reactivated candidates separately from ordinary unreviewed archive gaps.

## Preservation requirements

PR #378 queue and delta, PR #382 contract/manifest/audit, PR #380 outcomes, canonical Evidence, Evidence Relations, statistics, and all public outputs remain immutable.

## Prohibited work

- canonical Evidence, source URL, or archive URL changes;
- Evidence Relation changes;
- Archive Maintenance Batch 4 authorization;
- automatic capture or source-replacement promotion;
- public output, ranking, scoring, recommendation, or monitoring promotion;
- historical reviewed queue or outcome rewrites.

## Exit condition

PR #383 emits a deterministic fresh queue and delta, changes no canonical/public data, and stops at `REVIEW GATE`.
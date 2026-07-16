# PR #388 Evidence Archive Maintenance Queue v4 Refresh Specification

Status: active internal planning specification  
Review PR: 388  
Public output: false

## Objective

Generate a fresh bounded Evidence archive-maintenance review queue using the reviewed PR #387 History v3 contract.

## Required inputs

```text
config/evidence-archive-maintenance-queue-v4-pr388.json
docs/migration/current-canonical-checkpoint.json
config/evidence-archive-review-history-v3-pr387.json
docs/migration/evidence-archive-review-history-manifest-v3-pr387.json
docs/migration/evidence-archive-review-history-audit-v3-pr387.json
docs/migration/post-pr385-review-gate-pr386.json
docs/migration/evidence-archive-maintenance-queue-v3-pr383.json
```

## Selection rule

1. load current canonical Evidence identities;
2. keep identities with no recorded archive and a non-empty source URL;
3. exclude aliases;
4. exclude source URLs already pointing to Web Archive;
5. exclude the twelve reviewed suppressed identities;
6. include reviewed reactivated identities whose History v3 row explicitly sets `candidate_eligible_under_contract = true`;
7. place reviewed reactivated identities first;
8. order each tier by regulator/legal, official issuer/product, reserve/audit, reporting/research, then other;
9. break ties by Evidence ID;
10. select at most ten.

This is a deterministic manual-review queue, not an Evidence ranking, safety score, recommendation, or canonical promotion.

## Required outputs

```text
docs/migration/evidence-archive-maintenance-queue-v4-pr388.json
docs/migration/evidence-archive-maintenance-queue-v4-pr388-delta.json
```

The queue must include exact History v3 provenance and identify selected reviewed-reactivated candidates separately from ordinary unreviewed archive gaps.

## Preservation requirements

Queue v3 and delta, History v1/v2/v3 reviewed sources, PR #385 outcomes, canonical Evidence, Evidence Relations, statistics, checkpoints, release baselines, and all public outputs remain immutable.

## Prohibited work

- canonical Evidence, source URL, or archive URL changes;
- Evidence Relation changes;
- Archive Maintenance Batch 5 authorization;
- automatic capture or source-replacement promotion;
- public output, ranking, scoring, recommendation, or monitoring promotion;
- historical reviewed queue, history, or outcome rewrites.

## Exit condition

PR #388 emits a deterministic fresh Queue v4 and delta, changes no canonical/public data, and stops at `REVIEW GATE`.
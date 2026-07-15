# PR #378 Evidence Archive Maintenance Queue v2 Refresh Specification

Status: active internal planning specification  
Review PR: 378  
Public output: false

## Objective

Generate a fresh bounded Evidence archive-maintenance review queue using the reviewed PR #377 history contract.

## Required inputs

```text
config/evidence-archive-maintenance-queue-v2-pr378.json
docs/migration/current-canonical-checkpoint.json
config/evidence-archive-review-history-v1-pr377.json
docs/migration/evidence-archive-review-history-manifest-pr377.json
docs/migration/evidence-archive-review-history-audit-pr377.json
docs/migration/post-pr375-review-gate-pr376.json
docs/migration/evidence-archive-maintenance-queue-pr365.json
```

## Selection rule

1. load current canonical Evidence identities;
2. keep identities with no recorded archive and a non-empty source URL;
3. exclude aliases;
4. exclude source URLs already pointing to Web Archive;
5. exclude reviewed suppressed identities without a reviewed reactivation signal;
6. order by regulator/legal, official issuer/product, reserve/audit, reporting/research, then other;
7. break ties by Evidence ID;
8. select at most ten.

## Required outputs

```text
docs/migration/evidence-archive-maintenance-queue-v2-pr378.json
docs/migration/evidence-archive-maintenance-queue-v2-pr378-delta.json
```

The queue must include exact review-history provenance and remain internal, non-ranking, manual-review-only, and non-canonical.

## Preservation requirements

PR #365 queue and outcomes, PR #377 contract/manifest/audit, canonical Evidence, and all public outputs remain immutable.

## Prohibited work

- canonical Evidence or archive URL changes;
- canonical batch authorization;
- automatic capture or source-replacement promotion;
- public output, ranking, scoring, or recommendation.

## Exit condition

PR #378 stops at `REVIEW GATE`. Canonical archive changes require a later authority decision.

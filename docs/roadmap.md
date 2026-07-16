# Stable or Gone Roadmap

Updated: 2026-07-16  
Status: canonical execution schedule — PR #403 active

## Current position

```text
Canonical stable assets: 112
Organizations: 107
Relationships: 124
Events: 187
Evidence: 559
Evidence Relations: 559
Deployments: 174
Market Access Records: 8
Archive recorded: 430
Archive not recorded: 129
PR #402 Evidence Archive Review-History Contract v6 Update: complete
PR #403 Evidence Archive Maintenance Queue v7 Refresh: active; complete on merge
REVIEW GATE: mandatory after PR #403
```

## Current authority

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/deployment-policy.md
docs/post-351-data-growth-operating-spec.md
docs/migration/post-pr400-review-gate-pr401.json
docs/roadmap-amendments/2026-07-16-pr403-evidence-archive-maintenance-queue-v7-activation.md
docs/quality/evidence-archive-maintenance-queue-v7-pr403-spec.md
config/evidence-archive-maintenance-queue-v7-pr403.json
config/evidence-archive-review-history-v6-pr402.json
docs/migration/evidence-archive-review-history-manifest-v6-pr402.json
docs/migration/evidence-archive-review-history-audit-v6-pr402.json
```

## Queue v7 binding

```text
History sources / events / identities: 7 / 70 / 68
Reviewed unresolved suppressed: 18
Reviewed reactivated eligible: 0
Eligible pool: 78
Selected: 10
Selected reactivated: 0
```

Queue v7 is a deterministic non-ranking manual-review queue. All eighteen reviewed unresolved identities remain suppressed, no reviewed identity is reactivated, and ten ordinary archive gaps are selected by source-priority bucket then Evidence ID.

## Required outputs

```text
docs/migration/evidence-archive-maintenance-queue-v7-pr403.json
docs/migration/evidence-archive-maintenance-queue-v7-pr403-delta.json
```

No canonical, checkpoint, statistics, release-baseline, or public change is authorized. Archive Batch 8 remains unapproved.

After PR #403, stop at `REVIEW GATE`.

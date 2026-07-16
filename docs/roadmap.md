# Stable or Gone Roadmap

Updated: 2026-07-16  
Status: canonical execution schedule — PR #398 active

Historical roadmap authority through PR #397 remains archived and does not override this file.

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
Archive recorded: 425
Archive not recorded: 134

PR #397 Evidence Archive Review-History Contract v5 Update: complete
PR #398 Evidence Archive Maintenance Queue v6 Refresh: active; complete on merge
REVIEW GATE: mandatory after PR #398
```

## Current authority

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/deployment-policy.md
docs/post-351-data-growth-operating-spec.md
docs/migration/post-pr395-review-gate-pr396.json
docs/roadmap-amendments/2026-07-16-pr398-evidence-archive-maintenance-queue-v6-activation.md
docs/quality/evidence-archive-maintenance-queue-v6-pr398-spec.md
config/evidence-archive-maintenance-queue-v6-pr398.json
config/evidence-archive-review-history-v5-pr397.json
docs/migration/evidence-archive-review-history-manifest-v5-pr397.json
docs/migration/evidence-archive-review-history-audit-v5-pr397.json
```

## Queue v6 binding

```text
History sources / events / identities: 6 / 60 / 58
Reviewed unresolved suppressed: 13
Reviewed reactivated eligible: 0
Eligible pool: 88
Selected: 10
Selected reactivated: 0
```

Queue v6 is a deterministic non-ranking manual-review queue. All thirteen reviewed unresolved identities remain suppressed, no reviewed identity is reactivated, and ten ordinary archive gaps are selected by source-priority bucket then Evidence ID.

## Required outputs

```text
docs/migration/evidence-archive-maintenance-queue-v6-pr398.json
docs/migration/evidence-archive-maintenance-queue-v6-pr398-delta.json
```

## Boundaries

PR #398 may create only Queue v6, its Queue v5 delta, authority documents, builder, validator, and workflow. Canonical records, checkpoints, statistics, release baselines, public surfaces, History v5, Queue v5, and prior outputs remain unchanged.

Archive Batch 7 and every other canonical expansion remain unapproved.

## Next gate

After PR #398, stop at `REVIEW GATE`.

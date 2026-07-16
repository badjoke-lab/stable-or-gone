# Stable or Gone Agent Instructions

Current mandatory authority: PR #403 Evidence Archive Maintenance Queue v7 Refresh.

Current authority:

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
docs/migration/evidence-archive-maintenance-queue-v6-pr398.json
```

## Current workstream

```text
Canonical stable assets: 112
Canonical Evidence: 559
Evidence Relations: 559
Archive recorded: 430
Archive not recorded: 129
Deployments: 174
Market Access Records: 8
PR #402 Evidence Archive Review-History Contract v6 Update: complete
PR #403 Evidence Archive Maintenance Queue v7 Refresh: active; complete on merge
REVIEW GATE: mandatory after PR #403
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

Queue v7 is non-ranking and manual-review only. It excludes all eighteen reviewed suppressions, contains no reviewed-reactivated identity, and selects at most ten ordinary archive gaps using source-priority bucket then Evidence ID ordering.

PR #403 may create only the versioned Queue v7 and Queue v6 delta plus internal validation material. It may not change canonical records, checkpoints, statistics, release baselines, public surfaces, History v6, or Queue v6.

Archive Batch 8 is not authorized. After PR #403, stop at `REVIEW GATE`.

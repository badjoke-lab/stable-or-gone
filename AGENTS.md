# Stable or Gone Agent Instructions

Current mandatory authority: PR #398 Queue v6.

Current authority:

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

## Current workstream

```text
Canonical stable assets: 112
Canonical Evidence: 559
Evidence Relations: 559
Archive recorded: 425
Archive not recorded: 134
Deployments: 174
Market Access Records: 8
PR #397 Evidence Archive Review-History Contract v5 Update: complete
PR #398 Evidence Archive Maintenance Queue v6 Refresh: active; complete on merge
REVIEW GATE: mandatory after PR #398
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

Queue v6 is non-ranking and manual-review only. It excludes all thirteen reviewed suppressions, contains no reviewed-reactivated identity, and selects at most ten ordinary archive gaps using source-priority bucket then Evidence ID ordering.

PR #398 may create only the versioned Queue v6 and Queue v5 delta plus internal validation material. It may not change canonical records, checkpoints, statistics, release baselines, public surfaces, History v5, or Queue v5.

Archive Batch 7 is not authorized. After PR #398, stop at `REVIEW GATE`.

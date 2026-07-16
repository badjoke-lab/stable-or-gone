# Stable or Gone Agent Instructions

Current mandatory authority: PR #404 Post-PR #403 Review Gate.

Current authority:

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/deployment-policy.md
docs/post-351-data-growth-operating-spec.md
docs/roadmap-amendments/2026-07-16-pr404-post-pr403-review-gate.md
docs/quality/post-pr403-review-gate-pr404-spec.md
config/post-pr403-review-gate-pr404.json
docs/migration/evidence-archive-maintenance-queue-v7-pr403.json
docs/migration/evidence-archive-maintenance-queue-v7-pr403-delta.json
config/evidence-archive-review-history-v6-pr402.json
docs/migration/evidence-archive-review-history-manifest-v6-pr402.json
docs/migration/evidence-archive-review-history-audit-v6-pr402.json
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
PR #403 Evidence Archive Maintenance Queue v7 Refresh: complete
PR #404 Post-PR #403 Review Gate: active; complete on merge
PR #405 Evidence and Archive Maintenance Batch 8: approved next
REVIEW GATE: mandatory after PR #405
```

## Queue v7 review

```text
History sources / events / identities: 7 / 70 / 68
Reviewed unresolved suppressed: 18
Reviewed reactivated eligible: 0
Queue v7 eligible pool / selected: 78 / 10
Added / removed / retained versus Queue v6: 10 / 10 / 0
```

PR #405 is bounded to exactly the ten Queue v7 identities. Allowed reviewed outcomes are `dated_exact_archive_added`, `reviewed_source_replacement`, or `reviewed_no_safe_change`. No outcome is presumed and automatic promotion is prohibited.

PR #404 may create only the internal authority report and validation material. It may not change canonical records, checkpoints, statistics, release baselines, public surfaces, History v6, Queue v7, or prior outputs.

Evidence and Archive Maintenance Batch 9 and every unrelated workstream remain unapproved. After PR #405, stop at `REVIEW GATE`.

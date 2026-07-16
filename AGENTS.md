# Stable or Gone Agent Instructions

Current mandatory authority: PR #399 Post-PR #398 Review Gate.

Current authority:

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/deployment-policy.md
docs/post-351-data-growth-operating-spec.md
docs/roadmap-amendments/2026-07-16-pr399-post-pr398-review-gate.md
docs/quality/post-pr398-review-gate-pr399-spec.md
config/post-pr398-review-gate-pr399.json
docs/migration/evidence-archive-maintenance-queue-v6-pr398.json
docs/migration/evidence-archive-maintenance-queue-v6-pr398-delta.json
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
PR #398 Evidence Archive Maintenance Queue v6 Refresh: complete
PR #399 Post-PR #398 Review Gate: active; complete on merge
PR #400 Evidence and Archive Maintenance Batch 7: approved next
REVIEW GATE: mandatory after PR #400
```

## Queue v6 review

```text
History sources / events / identities: 6 / 60 / 58
Reviewed unresolved suppressed: 13
Reviewed reactivated eligible: 0
Queue v6 eligible pool / selected: 88 / 10
Added / removed / retained versus Queue v5: 10 / 10 / 0
```

PR #400 is bounded to exactly the ten Queue v6 identities. Allowed reviewed outcomes are `dated_exact_archive_added`, `reviewed_source_replacement`, or `reviewed_no_safe_change`. No outcome is presumed and automatic promotion is prohibited.

PR #399 may create only the internal authority report and validation material. It may not change canonical records, checkpoints, statistics, release baselines, public surfaces, History v5, Queue v6, or prior outputs.

Evidence and Archive Maintenance Batch 8 and every unrelated workstream remain unapproved. After PR #400, stop at `REVIEW GATE`.

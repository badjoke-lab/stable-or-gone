# Stable or Gone Roadmap

Updated: 2026-07-16  
Status: canonical execution schedule — PR #401 review gate active

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
PR #400 Evidence and Archive Maintenance Batch 7: complete
PR #401 Post-PR #400 Review Gate: active; complete on merge
PR #402 Evidence Archive Review-History Contract v6 Update: approved next
PR #403 Evidence Archive Maintenance Queue v7 Refresh: approved after PR #402
REVIEW GATE: mandatory after PR #403
```

## Current authority

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/deployment-policy.md
docs/post-351-data-growth-operating-spec.md
docs/roadmap-amendments/2026-07-16-pr401-post-pr400-review-gate.md
docs/quality/post-pr400-review-gate-pr401-spec.md
config/post-pr400-review-gate-pr401.json
docs/migration/evidence-archive-maintenance-outcomes-pr400.json
docs/migration/evidence-archive-maintenance-batch-7-pr400-reviewed-handoff.json
```

## Review finding

```text
History sources / events / identities: 7 / 70 / 68
Archive present / invalid removed / no-safe-change / source replacement: 50 / 1 / 17 / 0
Reviewed unresolved / suppressed / reactivated: 18 / 18 / 0
```

History v5 is stale because it excludes the ten reviewed PR #400 events. The five PR #400 no-safe-change identities become new suppressions in History v6.

## Approved next sequence

```text
PR #402 Evidence Archive Review-History Contract v6 Update
PR #403 Evidence Archive Maintenance Queue v7 Refresh
REVIEW GATE
```

PR #402 and PR #403 are internal-only. They may not change canonical data, checkpoints, statistics, release baselines, or public surfaces. Queue v7 may select at most ten manual-review candidates but grants no canonical authority.

Batch 8 and all unrelated workstreams remain unapproved.

After PR #403, stop at `REVIEW GATE`.

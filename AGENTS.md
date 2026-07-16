# Stable or Gone Agent Instructions

Current mandatory authority: PR #397 History v5.

Current authority:

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/deployment-policy.md
docs/post-351-data-growth-operating-spec.md
docs/migration/post-pr395-review-gate-pr396.json
docs/roadmap-amendments/2026-07-16-pr397-evidence-archive-review-history-v5-activation.md
docs/quality/evidence-archive-review-history-contract-v5-pr397-spec.md
config/evidence-archive-review-history-v5-pr397.json
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
PR #395 Evidence and Archive Maintenance Batch 6: complete
PR #396 Post-PR #395 Review Gate: complete
PR #397 Evidence Archive Review-History Contract v5 Update: active; complete on merge
PR #398 Evidence Archive Maintenance Queue v6 Refresh: approved next
REVIEW GATE: mandatory after PR #398
```

## History v5

```text
history sources: 6
history events: 60
reviewed Evidence identities: 58
archive present: 45
invalid archive removed: 1
reviewed no-safe-change: 12
reviewed source replacement: 0
reviewed unresolved total: 13
reviewed unresolved suppressed: 13
reviewed reactivated eligible: 0
```

PR #397 appends the ten reviewed PR #395 events to immutable History v4. Nine resolve to archive-present. `sog_src_makerdao_docs_dai` resolves to reviewed no-safe-change and remains suppressed.

PR #397 may create only internal History v5 contract outputs and validation material. It may not change canonical records, checkpoints, statistics, release baselines, public surfaces, prior histories, or prior outcomes. Queue v6 is not generated in PR #397.

The sole next work item is PR #398. After PR #398, stop at `REVIEW GATE`.

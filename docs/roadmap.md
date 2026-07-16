# Stable or Gone Roadmap

Updated: 2026-07-16  
Status: canonical execution schedule — PR #392 active

Historical roadmap authority through PR #391 remains archived and does not override this file.

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
Archive recorded: 416
Archive not recorded: 143

PR #391 Post-PR #390 Review Gate: complete
PR #392 Evidence Archive Review-History Contract v4 Update: active; complete on merge
PR #393 Evidence Archive Maintenance Queue v5 Refresh: approved next
REVIEW GATE: mandatory after PR #393
```

## Current authority

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/deployment-policy.md
docs/post-351-data-growth-operating-spec.md
docs/roadmap-amendments/2026-07-16-pr392-evidence-archive-review-history-v4-activation.md
docs/quality/evidence-archive-review-history-contract-v4-pr392-spec.md
config/evidence-archive-review-history-v4-pr392.json
docs/migration/post-pr390-review-gate-pr391.json
config/evidence-archive-review-history-v3-pr387.json
docs/migration/evidence-archive-review-history-manifest-v3-pr387.json
docs/migration/evidence-archive-review-history-audit-v3-pr387.json
docs/migration/evidence-archive-maintenance-outcomes-pr390.json
```

## History v4 result

```text
history sources: 5
history events: 50
reviewed Evidence identities: 48
archive present: 36
invalid archive removed: 1
reviewed no-safe-change: 11
reviewed source replacement: 0
reviewed unresolved total: 12
reviewed unresolved suppressed: 12
reviewed reactivated eligible: 0
```

History resolution remains latest-reviewed-event-wins. PR #390 is the latest source and makes `sog_src_fdusd_site` archive-present, removing its former reactivation eligibility.

## Required outputs

```text
docs/migration/evidence-archive-review-history-manifest-v4-pr392.json
docs/migration/evidence-archive-review-history-audit-v4-pr392.json
```

The outputs remain internal. History v3, all reviewed outcomes, canonical data, checkpoints, statistics, release baselines, and public surfaces remain immutable.

## Deferred and not approved

```text
Evidence and Archive Maintenance Batch 6
Tier A Dossier Deepening Batch 6
Market Access Pilot 3
Record Growth Batch 2
new public page or explorer
asset or Evidence ranking
automatic monitoring promotion
automatic canonical promotion
```

## Next gate

The only authorized next work item is `PR #393 Evidence Archive Maintenance Queue v5 Refresh`. After PR #393, stop at `REVIEW GATE`.

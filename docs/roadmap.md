# Stable or Gone Roadmap

Updated: 2026-07-16  
Status: canonical execution schedule — PR #387 active

Historical roadmap authority through PR #366 remains archived and does not override this file.

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
Archive recorded: 406
Archive not recorded: 153

PR #386 Post-PR #385 Review Gate: complete
PR #387 Evidence Archive Review-History Contract v3 Update: active; complete on merge
PR #388 Evidence Archive Maintenance Queue v4 Refresh: approved next
REVIEW GATE: mandatory after PR #388
```

## Current authority

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/deployment-policy.md
docs/post-351-data-growth-operating-spec.md
docs/roadmap-amendments/2026-07-16-pr387-evidence-archive-review-history-v3-activation.md
docs/quality/evidence-archive-review-history-contract-v3-pr387-spec.md
config/evidence-archive-review-history-v3-pr387.json
docs/migration/post-pr385-review-gate-pr386.json
docs/migration/evidence-archive-maintenance-outcomes-pr385.json
docs/migration/evidence-archive-review-history-manifest-v2-pr382.json
docs/migration/evidence-archive-review-history-audit-v2-pr382.json
```

## History v3 objective

PR #387 must reconstruct reviewed archive history from PR #360, PR #365, PR #380, and PR #385 outcomes while preserving all prior versions unchanged.

Expected reviewed inventory:

```text
history sources: 4
history events: 40
reviewed Evidence identities: 39
archive present: 26
invalid archive removed: 1
reviewed no-safe-change: 11
reviewed source replacement: 1
reviewed unresolved total: 13
reviewed unresolved suppressed: 12
reviewed reactivated eligible: 1
```

The sole reviewed-reactivated identity is `sog_src_fdusd_site`. Circle Mint is archive-present and must not remain queue-eligible.

## Required outputs

```text
docs/migration/evidence-archive-review-history-manifest-v3-pr387.json
docs/migration/evidence-archive-review-history-audit-v3-pr387.json
```

The outputs remain internal and non-ranking. PR #377 v1 and PR #382 v2 files are immutable historical inputs.

## Approved next sequence

```text
PR #387 Evidence Archive Review-History Contract v3 Update
PR #388 Evidence Archive Maintenance Queue v4 Refresh
REVIEW GATE
```

PR #388 must consume History v3, exclude the twelve reviewed suppressions, include the reviewed FDUSD reactivation explicitly, select at most ten candidates, and make no canonical or public change.

## Deferred and not approved

```text
Evidence and Archive Maintenance Batch 5
Tier A Dossier Deepening Batch 6
Market Access Pilot 3
Record Growth Batch 2
new public page or explorer
asset or Evidence ranking
automatic monitoring promotion
automatic canonical promotion
```

## Next gate

After PR #388, stop at `REVIEW GATE`. No later archive batch or other canonical expansion is authorized until Queue v4 is reviewed.
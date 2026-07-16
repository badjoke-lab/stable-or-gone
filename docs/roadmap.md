# Stable or Gone Roadmap

Updated: 2026-07-16  
Status: canonical execution schedule — PR #381 review gate active

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
Archive recorded: 399
Archive not recorded: 160

PR #380 Evidence and Archive Maintenance Batch 3: complete
PR #381 Post-PR #380 Review Gate: active; complete on merge
```

## Current authority

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/deployment-policy.md
docs/post-351-data-growth-operating-spec.md
docs/roadmap-amendments/2026-07-16-pr381-post-pr380-review-gate.md
docs/quality/post-pr380-review-gate-pr381-spec.md
config/post-pr380-review-gate-pr381.json
docs/migration/evidence-archive-maintenance-batch-3-pr380-reviewed-handoff.json
docs/migration/evidence-archive-maintenance-outcomes-pr380.json
```

## Completed result under review

```text
selected Evidence identities: 10
changed Evidence records: 10
dated exact archives added: 9
reviewed source replacements: 1
reviewed no-safe-change: 0
archive recorded: 390 → 399
archive not recorded: 169 → 160
Evidence identities: 559
Evidence Relations: 559
```

## Binding history problem

The current PR #377 archive review-history contract contains only PR #360 and PR #365 outcomes:

```text
history sources: 2
history events: 20
reviewed Evidence identities: 20
reviewed unresolved suppressed: 10
```

It does not include the nine PR #380 archive-present outcomes or the reviewed Circle Mint source replacement. The consumed PR #378 queue must not be reused.

## Approved next sequence

```text
PR #382 Evidence Archive Review-History Contract v2 Update
PR #383 Evidence Archive Maintenance Queue v3 Refresh
REVIEW GATE
```

Expected PR #382 history inventory:

```text
history sources: 3
history events: 30
reviewed Evidence identities: 30
archive present: 19
invalid archive removed: 1
reviewed no-safe-change: 9
reviewed source replacement: 1
reviewed unresolved total: 11
reviewed unresolved suppressed: 10
reviewed reactivated eligible: 1
```

PR #383 may generate a deterministic internal non-ranking manual-review queue of at most ten candidates from the current 160 archive-not-recorded identities. PR #382 and PR #383 may make no canonical or public change.

## Deferred and not approved

```text
Evidence and Archive Maintenance Batch 4
Tier A Dossier Deepening Batch 6
Market Access Pilot 3
Record Growth Batch 2
new public page or explorer
asset or Evidence ranking
automatic monitoring promotion
automatic canonical promotion
```

## Next gate

After PR #383, stop at `REVIEW GATE`. No canonical archive work is authorized until the fresh queue is reviewed.

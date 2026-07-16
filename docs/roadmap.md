# Stable or Gone Roadmap

Updated: 2026-07-16  
Status: canonical execution schedule — PR #382 active

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

PR #381 Post-PR #380 Review Gate: complete
PR #382 Evidence Archive Review-History Contract v2 Update: active; complete on merge
PR #383 Evidence Archive Maintenance Queue v3 Refresh: next after PR #382
REVIEW GATE: mandatory after PR #383
```

## Current authority

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/deployment-policy.md
docs/post-351-data-growth-operating-spec.md
docs/roadmap-amendments/2026-07-16-pr382-evidence-archive-review-history-v2-activation.md
docs/quality/evidence-archive-review-history-contract-v2-pr382-spec.md
config/evidence-archive-review-history-v2-pr382.json
docs/migration/post-pr380-review-gate-pr381.json
docs/migration/evidence-archive-maintenance-outcomes-pr380.json
```

## Approved bounded sequence

```text
PR #382 Evidence Archive Review-History Contract v2 Update — active
PR #383 Evidence Archive Maintenance Queue v3 Refresh — next
REVIEW GATE
```

## History v2 objective

The current PR #377 history files are preserved as reviewed v1 outputs. PR #382 creates new versioned outputs from three immutable sources:

```text
PR #360 Evidence correction outcomes
PR #365 Evidence archive-maintenance outcomes
PR #380 Evidence archive-maintenance outcomes
```

The history key remains `evidence_id`; latest reviewed event wins.

Expected inventory:

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

The sole reviewed reactivated identity is `sog_src_eurc_mint_page`. Its current replacement URL has no recorded archive and may enter PR #383's fresh manual-review queue. No automatic canonical change is allowed.

## Required outputs

```text
docs/migration/evidence-archive-review-history-manifest-v2-pr382.json
docs/migration/evidence-archive-review-history-audit-v2-pr382.json
```

PR #382 generates no queue. PR #383 is the only authorized consumer before the next review gate.

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

After PR #383, stop at `REVIEW GATE`. No canonical archive work is authorized until the fresh v3 queue is reviewed.

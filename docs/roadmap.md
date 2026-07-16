# Stable or Gone Roadmap

Updated: 2026-07-16  
Status: canonical execution schedule — PR #380 reviewed complete; REVIEW GATE next

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

PR #363 Record Depth and Coverage Baseline Refresh: complete
PR #364 Tier A Dossier Deepening Batch 4: complete
PR #365 Evidence and Archive Maintenance Batch 2: complete
PR #379 Post-PR #378 Review Gate: complete
PR #380 Evidence and Archive Maintenance Batch 3: reviewed complete; complete on merge
Current authority: REVIEW GATE
Next work item: none pre-authorized
```

The registry currently contains 112 stable assets, 559 Evidence records, and 174 deployments. Of the 559 Evidence identities, 399 archive indexes are recorded and 160 archive indexes are not recorded.

## Current reviewed authority

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/deployment-policy.md
docs/post-351-data-growth-operating-spec.md
docs/roadmap-amendments/2026-07-16-pr380-evidence-archive-maintenance-batch-3-activation.md
docs/quality/evidence-archive-maintenance-batch-3-pr380-spec.md
config/evidence-archive-maintenance-batch-3-pr380.json
config/evidence-archive-maintenance-batch-3-pr380-decisions.json
docs/migration/evidence-archive-maintenance-batch-3-pr380-reviewed-handoff.json
docs/migration/current-canonical-checkpoint.json
```

## Completed bounded sequence

```text
PR #380 Evidence and Archive Maintenance Batch 3 — reviewed complete
REVIEW GATE — mandatory next
```

## PR #380 reviewed result

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

Nine exact-source HTTP 200 Wayback captures were accepted with reviewed timestamps and digests. The remaining change replaces the obsolete Circle Mint route with its successful same-product redirect target:

```text
https://www.circle.com/mint
→ https://www.circle.com/circle-mint
```

No Evidence identity, Evidence Relation, asset, organization, deployment, Market Access record, ranking, score, recommendation, or public navigation surface changed.

## Required next review

The next authority decision must evaluate:

- PR #380 actual yield and source-replacement quality;
- whether PR #380 outcomes must first be incorporated into the archive review-history contract;
- whether a new archive queue may be generated from the remaining 160 identities;
- the empty history-aware dossier queue;
- Market Access breadth, still eight records;
- monitoring usefulness and monthly maintenance burden;
- verified external usage evidence;
- whether any canonical or public work should be authorized.

## Deferred and not approved

```text
Evidence and Archive Maintenance Batch 4
archive queue refresh
archive review-history mutation
Tier A Dossier Deepening Batch 6
Market Access Pilot 3
Record Growth Batch 2
new public page or explorer
asset or Evidence ranking
automatic monitoring promotion
automatic canonical promotion
```

## Next gate

Stop at `REVIEW GATE`. No PR after #380 is pre-authorized until a new reviewed authority decision is merged.

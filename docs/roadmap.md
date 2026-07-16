# Stable or Gone Roadmap

Updated: 2026-07-16  
Status: canonical execution schedule — PR #386 review gate active

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

PR #385 Evidence and Archive Maintenance Batch 4: complete
PR #386 Post-PR #385 Review Gate: active; complete on merge
PR #387 Evidence Archive Review-History Contract v3 Update: approved next
PR #388 Evidence Archive Maintenance Queue v4 Refresh: approved after PR #387
REVIEW GATE: mandatory after PR #388
```

## Current authority

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/deployment-policy.md
docs/post-351-data-growth-operating-spec.md
docs/roadmap-amendments/2026-07-16-pr386-post-pr385-review-gate.md
docs/quality/post-pr385-review-gate-pr386-spec.md
config/post-pr385-review-gate-pr386.json
docs/migration/evidence-archive-maintenance-outcomes-pr385.json
docs/migration/evidence-archive-maintenance-batch-4-pr385-reviewed-handoff.json
docs/migration/evidence-archive-review-history-manifest-v2-pr382.json
docs/migration/evidence-archive-review-history-audit-v2-pr382.json
```

## Completed Batch 4 result

```text
Selected: 10
Changed: 8
Dated exact archives added: 7
Reviewed source replacements: 1
Reviewed no-safe-change: 2
Archive recorded: 399 → 406
Archive not recorded: 160 → 153
Evidence identities: 559
Evidence Relations: 559
```

Canonical identity counts, Evidence Relations, assets, deployments, Market Access records, non-Evidence record families, and public surfaces remain unchanged.

## Binding history problem

History v2 contains:

```text
history sources: 3
history events: 30
reviewed Evidence identities: 30
latest included review PR: 380
```

It does not contain PR #385 outcomes. Queue v3 is consumed and cannot authorize another canonical batch.

Expected History v3 inventory:

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

Circle Mint resolves to archive-present after PR #385. `sog_src_fdusd_site` is the sole reviewed-reactivated source-replacement eligibility.

## Approved next sequence

```text
PR #387 Evidence Archive Review-History Contract v3 Update
PR #388 Evidence Archive Maintenance Queue v4 Refresh
REVIEW GATE
```

PR #387 must create new versioned History v3 outputs without rewriting v1 or v2. PR #388 must generate a new deterministic non-ranking manual-review queue, exclude the twelve reviewed suppressions, explicitly include reviewed-reactivated eligibility, select at most ten, and make no canonical or public change.

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
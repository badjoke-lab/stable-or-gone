# Stable or Gone Roadmap

Updated: 2026-07-15  
Status: canonical execution schedule — PR #378 active

Historical roadmap authority through PR #366 is preserved at `docs/archive/roadmap-through-pr366.md` and does not override this file.

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
Archive recorded: 390
Archive not recorded: 169

PR #376 Post-PR #375 Review Gate: complete
PR #377 Evidence Archive Review-History Contract Audit: complete
PR #378 Evidence Archive Maintenance Queue v2 Refresh: active; complete on merge
REVIEW GATE: next and mandatory
```

## Current authority

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/deployment-policy.md
docs/post-351-data-growth-operating-spec.md
docs/roadmap-amendments/2026-07-15-pr376-post-pr375-review-gate.md
docs/roadmap-amendments/2026-07-15-pr377-evidence-archive-review-history-contract-activation.md
config/evidence-archive-review-history-v1-pr377.json
docs/migration/evidence-archive-review-history-manifest-pr377.json
docs/migration/evidence-archive-review-history-audit-pr377.json
docs/roadmap-amendments/2026-07-15-pr378-evidence-archive-maintenance-queue-v2-refresh-activation.md
docs/quality/evidence-archive-maintenance-queue-v2-pr378-spec.md
config/evidence-archive-maintenance-queue-v2-pr378.json
```

## Approved sequence

```text
PR #377  Evidence Archive Review-History Contract Audit — complete
PR #378  Evidence Archive Maintenance Queue v2 Refresh — active
REVIEW GATE
```

Evidence and Archive Maintenance Batch 3 canonical changes remain unapproved before the next review gate.

## PR #377 completed result

```text
history sources: 2
history events: 20
reviewed Evidence identities: 20
archive present: 10
invalid archive removed: 1
reviewed no-safe-change: 9
reviewed unresolved archive gaps: 10
```

A reviewed unresolved identity is suppressed until a reviewed exact capture or reviewed source replacement exists. There is no automatic time expiry.

## PR #378 queue refresh

PR #378 applies the completed history contract to current canonical Evidence without changing any canonical record.

Selection pipeline:

```text
start from 169 archive-not-recorded Evidence identities
exclude missing source URLs
exclude alias identities
exclude source URLs already pointing to Web Archive
exclude ten reviewed suppressed identities without a reviewed signal
preserve deterministic PR #365 priority buckets
select at most ten candidates
```

Required outputs:

```text
docs/migration/evidence-archive-maintenance-queue-v2-pr378.json
docs/migration/evidence-archive-maintenance-queue-v2-pr378-delta.json
```

The output must remain internal, non-ranking, manual-review-only, and non-canonical. Each candidate must retain review-history provenance.

## Validation boundary

PR #378 must prove:

- exact PR #377 contract, manifest, and audit identity;
- exact 559 / 390 / 169 canonical boundary;
- exact suppression of the ten reviewed unresolved identities;
- no unreviewed automatic reactivation;
- deterministic priority and Evidence-ID tie breaking;
- maximum-ten selected queue;
- immutable canonical Evidence and prior archive outputs;
- `data/`, `src/`, and `public/` unchanged;
- Astro check and build succeed;
- next work item is `REVIEW GATE`.

## Data and public boundaries

PR #378 changes no:

```text
data/
src/
public/
canonical Evidence identities, relations, URLs, or archived URLs
Market Access records
deployments
statistics history
historical outcomes or queues
public pages or machine-readable outputs
```

## Deferred and not approved

```text
Evidence and Archive Maintenance Batch 3 canonical changes
Tier A Dossier Deepening Batch 6
Market Access Pilot 3
Record Growth Batch 2
new public page or explorer
asset or Evidence ranking
automatic monitoring promotion
automatic canonical promotion
```

## Next gate

After PR #378, stop and review the fresh history-aware archive queue, candidate quality, source reactivation semantics, Market Access breadth, monitoring usefulness, monthly maintenance burden, and verified external usage evidence before authorizing canonical archive changes.

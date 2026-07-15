# Stable or Gone Roadmap

Updated: 2026-07-15  
Status: canonical execution schedule — PR #377 active

The full roadmap that governed the repository through merged PR #366 is preserved byte-for-byte at:

```text
docs/archive/roadmap-through-pr366.md
```

That archive is historical evidence. This file is the current execution schedule.

## 1. Current position

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
PR #377 Evidence Archive Review-History Contract Audit: active; complete on merge
PR #378 Evidence Archive Maintenance Queue v2 Refresh: next after PR #377
REVIEW GATE: mandatory after PR #378
```

The public-surface expansion sequence remains complete. PR #377 is internal Evidence queue-governance work.

## 2. Current authority

Read in this order:

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/deployment-policy.md
docs/post-351-data-growth-operating-spec.md
docs/roadmap-amendments/2026-07-15-pr376-post-pr375-review-gate.md
docs/migration/post-pr375-review-gate-pr376.json
docs/roadmap-amendments/2026-07-15-pr377-evidence-archive-review-history-contract-activation.md
docs/quality/evidence-archive-review-history-contract-pr377-spec.md
config/evidence-archive-review-history-v1-pr377.json
```

## 3. Approved bounded sequence

```text
PR #377  Evidence Archive Review-History Contract Audit — active
PR #378  Evidence Archive Maintenance Queue v2 Refresh — next
REVIEW GATE
```

Evidence and Archive Maintenance Batch 3 canonical changes remain unapproved before the next review gate.

## 4. Archive review-history problem

```text
canonical Evidence: 559
archive recorded: 390
archive not recorded: 169
PR #360 selected / changed / no-safe: 10 / 8 / 2
PR #365 selected / changed / no-safe: 10 / 3 / 7
```

Twenty canonical Evidence identities received a reviewed archive-maintenance outcome. Ten of them currently remain archive-not-recorded: one invalid wildcard removal and nine reviewed no-safe-change outcomes.

## 5. PR #377 contract

The history key is:

```text
evidence_id
```

The latest reviewed event wins. Outcomes:

```text
reviewed_archive_present
reviewed_archive_removed_invalid
reviewed_no_safe_change
```

A current archive-present identity is not eligible. A reviewed invalid-removal or no-safe-change identity is suppressed until a reviewed exact capture or reviewed source replacement exists.

There is no automatic time expiry.

Not accepted as reactivation:

```text
queue presence
HTTP status movement alone
unreviewed Wayback result
unreviewed source URL change
time elapsed
```

## 6. Expected review-history inventory

```text
history sources: 2
history events: 20
reviewed Evidence identities: 20
archive present: 10
invalid archive removed: 1
reviewed no-safe-change: 9
currently reviewed unresolved archive gaps: 10
```

## 7. Required outputs

```text
docs/migration/evidence-archive-review-history-manifest-pr377.json
docs/migration/evidence-archive-review-history-audit-pr377.json
```

PR #377 generates no archive queue. PR #378 is the only authorized consumer before the next review gate.

## 8. PR #378 boundary

After PR #377 merges, PR #378 must:

```text
consume the reviewed contract, manifest, and audit
apply history eligibility to the 169 archive-not-recorded Evidence identities
exclude alias and Web Archive source identities under the existing bounded policy
exclude the ten reviewed unresolved identities unless reactivated
emit a maximum-ten internal non-ranking review queue and delta
change no canonical data
change no public output
stop at another review gate
```

## 9. Data and public boundaries

PR #377 changes no:

```text
data/
src/
public/
canonical Evidence identities, relations, URLs, or archived URLs
Market Access records
deployments
statistics history
historical outcomes
archive queues
public pages or machine-readable outputs
```

## 10. Deferred and not approved

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

## 11. Next gate

After PR #378, stop and review the fresh history-aware archive queue, candidate quality, source reactivation semantics, Market Access breadth, monitoring usefulness, monthly maintenance burden, and verified external usage evidence before authorizing canonical archive changes.

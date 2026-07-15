# Stable or Gone Roadmap

Updated: 2026-07-15  
Status: canonical execution schedule — PR #374 active

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

PR #373 Post-PR #372 Review Gate: complete
PR #374 Planning Queue Review-History Contract Audit: active; complete on merge
PR #375 Candidate Queue v2.2 Refresh: next after PR #374
REVIEW GATE: mandatory after PR #375
```

The public-surface expansion sequence remains complete. PR #374 is internal queue-governance work.

## 2. Current authority

Read in this order:

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/deployment-policy.md
docs/post-351-data-growth-operating-spec.md
docs/roadmap-amendments/2026-07-15-pr373-post-pr372-review-gate.md
docs/migration/post-pr372-review-gate-pr373.json
docs/roadmap-amendments/2026-07-15-pr374-planning-queue-review-history-contract-activation.md
docs/quality/planning-queue-review-history-contract-pr374-spec.md
config/planning-queue-review-history-v1-pr374.json
```

## 3. Approved bounded sequence

```text
PR #374  Planning Queue Review-History Contract Audit — active
PR #375  Candidate Queue v2.2 Refresh — next
REVIEW GATE
```

No dossier or growth batch is authorized before the next review gate.

## 4. Problem being corrected

The PR #372 queue contains three candidates:

```text
AUDD
NZDS
poundtoken / 1GBP
```

Every current material dossier gap for those assets already received a reviewed no-safe-change outcome. The queue builder currently uses gap and leverage states but not review history, so reviewed work can immediately recur.

## 5. PR #374 contract

PR #374 must create one deterministic review-history model keyed by:

```text
asset_id + dimension_id
```

The latest reviewed event is effective. Outcomes are:

```text
reviewed_complete
reviewed_partial
reviewed_no_safe_change
```

All suppress the same dimension unless a reviewed reactivation signal exists.

There is no automatic time expiry.

Accepted reactivation triggers:

```text
reviewed_new_source
reviewed_semantics_change
```

Not accepted:

```text
time elapsed
queue presence
planning-state movement alone
maintenance-only gaps
unreviewed monitoring rows
```

## 6. Expected review-history inventory

```text
history sources: 5
history events: 48
reviewed assets: 18
effective asset-dimension outcomes: 33
reviewed complete: 20
reviewed partial: 0
reviewed no-safe-change: 13
```

Current queue projection:

```text
source candidates: 3
fully suppressed candidates: 3
reactivated candidates: 0
projected v2.2 candidates: 0
```

## 7. Required outputs

```text
docs/migration/planning-queue-review-history-manifest-pr374.json
docs/migration/planning-queue-review-history-audit-pr374.json
```

PR #374 does not recompute the baseline or rewrite the PR #372 queue. PR #375 is the only authorized consumer before the next review gate.

## 8. PR #375 boundary

After PR #374 merges, PR #375 must:

```text
consume the reviewed contract and manifest
apply review-history eligibility to the PR #372 v2.1 queue
preserve all historical baselines and queues
emit an internal non-ranking v2.2 queue and delta
change no canonical data
change no public output
stop at another review gate
```

## 9. Data and public boundaries

PR #374 changes no:

```text
data/
src/
public/
canonical records
Evidence identities or relations
Market Access records
deployments
statistics history
baseline cells
historical queues
public pages or machine-readable outputs
```

## 10. Deferred and not approved

```text
Tier A Dossier Deepening Batch 6
Evidence and Archive Maintenance Batch 3
Market Access Pilot 3
Record Growth Batch 2
new canonical asset
new deployment family
new public page or explorer
asset ranking or composite score
automatic monitoring promotion
automatic canonical promotion
```

## 11. Next gate

After PR #375, stop and review the history-aware queue, source reactivation semantics, archive burden, Market Access breadth, monitoring usefulness, monthly maintenance burden, and verified external usage evidence before authorizing another numbered sequence.

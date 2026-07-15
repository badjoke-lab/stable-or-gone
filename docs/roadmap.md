# Stable or Gone Roadmap

Updated: 2026-07-15  
Status: canonical execution schedule — PR #375 active

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
PR #374 Planning Queue Review-History Contract Audit: complete
PR #375 Candidate Queue v2.2 Refresh: active; complete on merge
REVIEW GATE: next and mandatory
```

The public-surface expansion sequence remains complete. PR #375 is internal queue-governance work.

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
config/planning-queue-review-history-v1-pr374.json
docs/migration/planning-queue-review-history-manifest-pr374.json
docs/migration/planning-queue-review-history-audit-pr374.json
docs/roadmap-amendments/2026-07-15-pr375-candidate-queue-v2-2-refresh-activation.md
docs/quality/candidate-queue-v2-2-refresh-pr375-spec.md
config/candidate-queue-v2-2-refresh-pr375.json
```

## 3. Approved bounded sequence

```text
PR #374  Planning Queue Review-History Contract Audit — complete
PR #375  Candidate Queue v2.2 Refresh — active
REVIEW GATE
```

No dossier or growth batch is authorized before the next review gate.

## 4. PR #374 completed contract

```text
history sources: 5
history events: 48
reviewed assets: 18
effective asset-dimension outcomes: 33
reviewed complete: 20
reviewed partial: 0
reviewed no-safe-change: 13
```

The latest reviewed event for each asset and dimension is effective. Reviewed complete, partial, and no-safe-change outcomes suppress the same dimension until a reviewed new-source or semantics-change signal exists. There is no automatic time expiry.

## 5. PR #375 queue refresh

PR #375 applies the completed history contract to the PR #372 v2.1 queue only. It does not recompute the baseline.

Source queue:

```text
AUDD
NZDS
poundtoken / 1GBP
```

Every current material dossier gap is suppressed by a latest reviewed no-safe-change event. There are no reviewed reactivation signals.

Expected result:

```text
source candidates: 3
suppressed candidates: 3
reactivated candidates: 0
output candidates: 0
removed: audd, nzds, poundtoken
```

## 6. Required outputs

```text
docs/migration/tier-a-candidate-queue-v2-2-pr375.json
docs/migration/tier-a-candidate-queue-v2-2-pr375-delta.json
```

The delta must preserve dimension-level suppression explanations. The queue remains internal, asset-slug ordered, non-ranking, and manual-review-only.

## 7. Validation boundary

The PR must prove:

- exact PR #374 contract, manifest, and audit identity;
- exact three-source-candidate boundary;
- exact suppression of AUDD, NZDS, and poundtoken;
- zero reactivation and zero output candidates;
- no baseline recomputation;
- historical queue and baseline blob identity;
- `data/`, `src/`, and `public/` unchanged;
- Astro check and build succeed;
- next work item is `REVIEW GATE`.

## 8. Data and public boundaries

PR #375 changes no:

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

## 9. Deferred and not approved

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

## 10. Next gate

After PR #375, stop and review the zero-candidate history-aware queue, source reactivation semantics, archive burden, Market Access breadth, monitoring usefulness, monthly maintenance burden, and verified external usage evidence before authorizing another numbered sequence.

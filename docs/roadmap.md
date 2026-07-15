# Stable or Gone Roadmap

Updated: 2026-07-15  
Status: canonical execution schedule — PR #373 review gate active

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

PR #371 Planning Input Coverage Audit: complete
PR #372 Record Depth Baseline v2.1 Refresh: complete
PR #373 Post-PR #372 Review Gate: active; complete on merge
```

The public-surface expansion sequence remains complete. PR #373 is an internal authority review.

## 2. Current authority

Read in this order:

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/deployment-policy.md
docs/post-351-data-growth-operating-spec.md
docs/roadmap-amendments/2026-07-15-pr373-post-pr372-review-gate.md
docs/quality/post-pr372-review-gate-pr373-spec.md
config/post-pr372-review-gate-pr373.json
named review inputs and deterministic output
```

## 3. Completed bounded sequence

```text
PR #371  Planning Input Coverage Audit — complete
PR #372  Record Depth Baseline v2.1 Refresh — complete
PR #373  REVIEW GATE — active
```

## 4. PR #372 result

The complete PR #371 manifest corrected the internal baseline while preserving all canonical and public boundaries.

```text
profile files: 29
assets: 112
dimensions: 16
cells: 1,792
changed cells: 4
changed assets: 4
```

All four changes were `redemption` cells moving from `partial` to `strong`:

```text
BUSD
PYUSD
RLUSD
USDP
```

Aggregate state movement:

```text
strong   604 → 608
partial  250 → 246
```

The corrected queue fell from six candidates to three:

```text
AUDD
NZDS
poundtoken / 1GBP
```

## 5. Review-gate finding

All three corrected queue candidates already received `reviewed_no_safe_change` outcomes in PR #369. No new source signal is attached to the corrected queue.

The current queue builder derives eligibility from present gap and leverage fields. It does not consume prior dossier handoffs, no-safe-change outcomes, review expiry, or new-source reactivation state.

Therefore Tier A Dossier Deepening Batch 6 is not authorized from this queue.

## 6. Approved next bounded sequence

PR #373 approves but does not activate:

```text
PR #374  Planning Queue Review-History Contract Audit
PR #375  Candidate Queue v2.2 Refresh
REVIEW GATE
```

### PR #374

Must:

```text
inventory reviewed dossier handoffs and no-safe-change outcomes
define suppression semantics
define review expiry semantics
define new-source reactivation semantics
define one deterministic review-history input contract
change no canonical data
change no public output
```

### PR #375

May begin only after PR #374 merges. It must:

```text
consume the approved review-history contract
apply it to the PR #372 v2.1 baseline
preserve historical baselines and queues
emit an internal non-ranking v2.2 queue and review-history delta
change no canonical data
change no public output
stop at another review gate
```

## 7. Deferred areas

### Evidence and archive maintenance

```text
archive recorded: 390
archive not recorded: 169
last batch reviewed: 10
last batch safe canonical changes: 3
last batch no-safe-change: 7
```

Evidence and Archive Maintenance Batch 3 remains deferred until the queue-history sequence completes.

### Market Access

The registry has eight canonical Market Access records. The latest pilot promoted four RLUSD provider-scoped records, but no approved third-pilot candidate manifest exists at this gate. Market Access Pilot 3 remains deferred.

### Monitoring and external usage

Monitoring remains private-review-only. Automatic promotion is prohibited. Verified external usage evidence remains unavailable in reviewed repository evidence.

## 8. Data and public boundaries

PR #373 changes no:

```text
data/
src/
public/
canonical records
Evidence identities or relations
Market Access records
deployments
statistics history
historical baselines or queues
public pages or machine-readable outputs
```

## 9. Not approved

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

After PR #375, stop and review the history-aware queue, source reactivation semantics, archive burden, Market Access breadth, monitoring usefulness, monthly maintenance burden, and verified external usage evidence before authorizing another numbered sequence.

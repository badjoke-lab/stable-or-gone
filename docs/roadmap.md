# Stable or Gone Roadmap

Updated: 2026-07-15  
Status: canonical execution schedule — PR #376 review gate active

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

PR #374 Planning Queue Review-History Contract Audit: complete
PR #375 Candidate Queue v2.2 Refresh: complete
PR #376 Post-PR #375 Review Gate: active; complete on merge
```

The public-surface expansion sequence remains complete. PR #376 is an internal authority review.

## 2. Current authority

Read in this order:

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/deployment-policy.md
docs/post-351-data-growth-operating-spec.md
docs/roadmap-amendments/2026-07-15-pr376-post-pr375-review-gate.md
docs/quality/post-pr375-review-gate-pr376-spec.md
config/post-pr375-review-gate-pr376.json
named review inputs and deterministic output
```

## 3. Completed bounded sequence

```text
PR #374  Planning Queue Review-History Contract Audit — complete
PR #375  Candidate Queue v2.2 Refresh — complete
PR #376  REVIEW GATE — active
```

## 4. Zero dossier queue

```text
source candidates: 3
suppressed candidates: 3
reactivated candidates: 0
current candidates: 0
```

The queue contains no eligible dossier work. Tier A Dossier Deepening Batch 6 is not authorized.

## 5. Next material quality backlog

Evidence archive maintenance is the largest named internal quality backlog:

```text
canonical Evidence: 559
archive recorded: 390
archive not recorded: 169
archive coverage: 69.77%
```

Prior review yield:

```text
PR #360 selected / changed / no-safe: 10 / 8 / 2
PR #365 selected / changed / no-safe: 10 / 3 / 7
combined reviewed occurrences: 20
combined no-safe occurrences: 9
```

The PR #365 queue builder excludes PR #360 selected identities. It does not consume PR #365 outcomes or a complete archive review-history manifest. A fresh queue can therefore repeat reviewed no-safe-change Evidence identities.

## 6. Approved next bounded sequence

PR #376 approves but does not activate:

```text
PR #377  Evidence Archive Review-History Contract Audit
PR #378  Evidence Archive Maintenance Queue v2 Refresh
REVIEW GATE
```

### PR #377

Must:

```text
inventory PR #360 and PR #365 outcomes by canonical Evidence identity
define reviewed-complete and no-safe-change suppression
define reviewed exact-capture and source-replacement reactivation signals
prohibit time-only and queue-presence reactivation
define one deterministic archive review-history contract
change no canonical data
change no public output
```

### PR #378

May begin only after PR #377 merges. It must:

```text
apply the reviewed contract to the 169 archive-not-recorded Evidence identities
exclude prior no-safe-change identities without a reviewed reactivation signal
preserve reviewed changed identities and all historical outputs
emit a bounded internal non-ranking review queue
change no canonical data
change no public output
stop at another review gate
```

Evidence and Archive Maintenance Batch 3 canonical changes are not authorized before the later review gate.

## 7. Deferred areas

### Market Access

The registry has eight canonical Market Access records. No approved third-pilot candidate manifest exists. Market Access Pilot 3 remains deferred.

### Monitoring and external usage

Monitoring remains private-review-only. Automatic promotion is prohibited. Verified external usage evidence remains unavailable in reviewed repository evidence.

## 8. Data and public boundaries

PR #376 changes no:

```text
data/
src/
public/
canonical records
Evidence identities, relations, URLs, or archived URLs
Market Access records
deployments
statistics history
historical queues or outcomes
public pages or machine-readable outputs
```

## 9. Not approved

```text
Evidence and Archive Maintenance Batch 3 canonical changes
Tier A Dossier Deepening Batch 6
Market Access Pilot 3
Record Growth Batch 2
new canonical asset
new deployment family
new public page or explorer
asset or Evidence ranking
automatic monitoring promotion
automatic canonical promotion
```

## 10. Next gate

After PR #378, stop and review the history-aware archive queue, candidate quality, source reactivation semantics, Market Access breadth, monitoring usefulness, monthly maintenance burden, and verified external usage evidence before authorizing canonical archive changes or another numbered sequence.

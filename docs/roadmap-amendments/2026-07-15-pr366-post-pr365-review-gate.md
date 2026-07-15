# Roadmap Amendment — PR #366 Post-PR #365 Review Gate

Date: 2026-07-15  
Status: reviewed authority decision on merge

## Source boundary

PR #365 completed the PR #361 sequence at:

```text
Assets:               112
Evidence:             559
Evidence Relations:   559
Deployments:          174
Market Access:          8
Archive recorded:     390
Archive not recorded: 169
```

## Review finding

The existing planning baseline is no longer sufficient to select another batch unchanged.

Of 1,792 planning cells, 219 are `absent` and none are `not_applicable`. Market Access and regulatory notes alone account for 217 absent cells. Deployment and facet freshness remain `partial` for 92 and 91 assets. These concentrations can reflect structural applicability and observation limits rather than material dossier defects.

Recent bounded work also shows diminishing but still valid yield:

```text
PR #364: 2 canonical improvements / 5 reviewed assets
PR #365: 3 dated archives / 10 reviewed Evidence records
```

Another identical maintenance batch is therefore not the first priority.

## Approved bounded sequence

```text
PR #367  Planning Dimension Semantics Audit
PR #368  Record Depth Baseline v2 Refresh
PR #369  Tier A Dossier Deepening Batch 5 — maximum five existing assets
REVIEW GATE
```

### PR #367 boundary

Review all 16 planning dimensions and define the operational distinction between:

```text
strong
usable
partial
sparse
absent
not_applicable
unobserved or unsupported source state
```

The audit may revise planning contracts, generators, validators, and internal reports. It may not change canonical records or public surfaces.

### PR #368 boundary

Recompute the non-ranking baseline over exactly 112 canonical assets using the approved semantics. Preserve all prior baselines as immutable historical checkpoints. No canonical data or public surface change is allowed.

### PR #369 boundary

Select no more than five existing assets from the refreshed non-ranking queue. Improve only source-supported material dossier gaps. No new asset, Market Access record, deployment family, public surface, ranking, score, or automatic promotion is allowed.

## Not approved

```text
Evidence and Archive Maintenance Batch 3
Market Access Pilot 3
Record Growth Batch 2
new public page or explorer
asset ranking or composite score
automatic monitoring promotion
automatic canonical promotion
```

## Activation

This amendment records the review decision. PR #367 must update `AGENTS.md` and `docs/roadmap.md` to activate the sequence before modifying planning contracts.

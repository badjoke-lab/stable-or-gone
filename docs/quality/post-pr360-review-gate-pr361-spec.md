# PR #361 Post-PR #360 Review Gate Specification

Status: active review-gate specification  
Updated: 2026-07-14

## 1. Roadmap item

PR #361 — Post-PR #360 Review Gate.

PR #360 is complete and merged at:

```text
0bdda598b596b406ae8a01827072f5b8c253b23e
```

Its reviewed handoff is:

```text
docs/migration/evidence-correction-batch-pr360-reviewed-handoff.json
```

## 2. Purpose

The review gate evaluates the completed PR #353–#360 operating sequence before any additional growth, Market Access expansion, or public product surface is authorized.

The gate is analytical and planning-only. It does not change canonical data.

## 3. Required evaluation axes

```text
record families that remain sparse
Tier A dossier depth improvement
Compare utility improvement
Timeline historical density
canonical Market Access utility
monitoring signal usefulness
correction and source-maintenance burden
monthly maintenance burden
external usage or referral evidence when available
```

## 4. Source boundary

The deterministic review reads only reviewed repository state:

```text
current Registry v2 and v3 canonical groups
current reviewed Record Depth derivation
historical PR #353 Record Depth summary
current deterministic statistics history
canonical Market Access Records
reviewed Compare preset configuration
reviewed correction outcome and PR #360 handoff
reviewed Update Feed and repository maintenance artifacts
reviewed monitoring configuration and aggregate outputs when present
```

Candidate, private note, unreviewed discovery, and unpublished monitoring content must not become canonical claims.

## 5. Decision rules

A Record Depth refresh is mandatory because canonical asset count changed from 110 to 112 and canonical content changed after PR #353.

Market Access Pilot 3 is not approved unless reviewed canonical coverage reaches at least:

```text
four assets
two platforms
two jurisdictions
```

The current eight records cover two assets, one platform, and one jurisdiction, so another immediate provider-identical Japan pilot would not materially broaden utility.

Evidence maintenance remains priority work while at least 150 canonical Evidence records have no recorded archive. PR #360 leaves 170.

Record Growth Batch 2 is not approved until the refreshed 112-asset depth baseline and the next bounded dossier batch are complete.

No new public product surface is approved by this gate.

## 6. Approved next bounded sequence

### PR #363 — Record Depth and Coverage Baseline Refresh

Recompute all 16 planning dimensions across exactly 112 canonical assets. Historical PR #353 snapshots remain immutable.

### PR #364 — Tier A Dossier Deepening Batch 4

Select no more than five assets from the refreshed deterministic non-ranking queue. Deepen only reviewed material dossier gaps.

### PR #365 — Evidence and Archive Maintenance Batch 2

Review no more than ten high-priority Evidence records from the refreshed source-maintenance queue.

After PR #365, run another review gate before authorizing Record Growth Batch 2 or Market Access Pilot 3.

## 7. Explicit non-approvals

```text
Market Access Pilot 3
Record Growth Batch 2
new public page, explorer, dashboard, or navigation family
asset ranking
composite score
automatic monitoring promotion
```

These are deferred, not permanently prohibited.

## 8. Validation

The dedicated review-gate workflow must validate:

```text
PR #360 reviewed handoff identity and counts
current canonical counts at 112 assets and 557 Evidence records
current archive coverage at 387 recorded and 170 not recorded
historical PR #353 summary immutability
current 112-asset Record Depth recomputation
all nine evaluation axes
exact PR #363–#365 sequence
no canonical data diff
no public output or route addition
Astro check and site build
```

## 9. Exit criteria

PR #361 completes when:

1. a deterministic review report is committed;
2. each evaluation axis contains evidence and a decision;
3. the next sequence is limited to PR #363–#365;
4. repository authority identifies PR #361 as active and PR #363 as next;
5. canonical and public outputs are unchanged;
6. validation and general CI are green.

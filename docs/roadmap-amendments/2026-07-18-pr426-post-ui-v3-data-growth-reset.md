# PR #426 Post-UI v3 Data-Growth Reset

Status: approved on merge  
Date: 2026-07-18

## Purpose

UI v3 is complete and Issue #281 is closed. Stable or Gone now returns to the post-351 default operating mode: reviewed data growth, record depth, evidence maintenance, bounded Market Access work, and private monitoring-assisted research.

This amendment does not authorize a canonical record change. It selects the next bounded internal planning item.

## Reviewed current state

```text
Canonical stable assets: 112
Organizations: 107
Relationships: 124
Events: 187
Evidence: 559
Evidence Relations: 559
Deployments: 174
Market Access Records: 8
Archive recorded / not recorded: 430 / 129
UI v3 completion: true
Issue #281: closed as completed
Active UI implementation workstream: none
```

The latest history-aware dossier queue contained zero eligible candidates. Evidence and Archive Maintenance Batch 8 reviewed ten identities and produced zero safe canonical changes. Repeating either lane without a fresh review signal would create low-yield work.

## Approved next sequence

```text
PR #426  Post-UI v3 Data-Growth Reset — complete on merge
PR #427  Record Growth Candidate Audit v2
REVIEW GATE
```

## PR #427 boundary

PR #427 is an internal, non-ranking, manual-review-only candidate audit.

It may:

- review at most twelve candidate stable assets;
- compare candidate identity, symbol, aliases, issuer/operator, domain, deployment, and lineage against all 112 canonical assets;
- review current official or otherwise reliable source leads;
- classify each candidate as `ready_for_full_record_review`, `duplicate_existing`, `prelaunch_or_noncanonical`, `insufficient_evidence`, `out_of_scope`, or `deferred`;
- produce a reviewed candidate audit, duplicate report, source-coverage report, and handoff for the next review gate.

It may not:

- add or change canonical assets or supporting canonical record families;
- publish candidate or monitoring material;
- create a canonical promotion PR automatically;
- authorize more than two future canonical additions;
- add a public page, ranking, score, endorsement, or recommendation;
- change UI v3, routes, metadata contracts, or public machine-readable output semantics.

## Review-gate decision after PR #427

The next review gate may authorize a Record Growth Batch 2 only when at least one candidate is fully reviewable and the required complete-record families can be produced. Any future growth PR remains bounded by the existing maximum of two new canonical stable assets.

If no candidate is ready, the review gate must redirect work to evidence maintenance, record-depth correction, Market Access review, or monitoring review instead of forcing growth.

## Data preservation

PR #426 and PR #427 preserve:

```text
data/
src/
public/
canonical counts and identities
statistics history
release-integrity checkpoints
owner-approved UI v3 state
Issue #281 closure
canonical-only public release boundary
private candidate and monitoring boundary
```

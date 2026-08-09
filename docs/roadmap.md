# Stable or Gone Roadmap

Updated: 2026-08-09  
Status: Guide/readability remediation merged through PR #533; PR #523 is reconciled to current main and is the active bounded completion

## Current PR #523 canonical checkpoint

```text
Canonical stable assets: 119
Organizations: 109
Relationships: 131
Events: 194
Evidence: 585
Evidence Relations: 585
Reserve reports: 127
Known unknowns: 352
Regulatory notes: 9
Deployments: 186
Legal profiles: 119
Reserve components: 153
Income profiles: 119
Market Access Records: 12
Archive recorded: 463
Archive not recorded: 122
Detail routes: 422
Metadata-checked routes: 422
Official origin: https://www.stableorgone.com
Last recorded production commit: 210d68001fbd2560ffadf538fdb7cc9302b400a7
Last recorded production canonical hash: sha256:57749955faa96d2bd836bac83ef41a0c5dc13f2342763dc4d975c588cd50c650
Convergence attempt: 1
Legacy-host 301: complete
```

The 585-Evidence / 12-Market-Access checkpoint is the current PR #523 branch checkpoint. Production remains subject to merge and post-merge verification; the last recorded production commit/hash above are retained until that verification is replaced by a newer recorded production checkpoint.

## Completed current-cycle work now recognized

```text
PR #514 — six-week cycle and Batch 5 authority
PR #515 — candidate audit
PRs #516–#519 — EUB/USB implementation, navigation insertion, and closeout
PRs #520–#522 — JPYSC review and bounded implementation authority
PR #524 — fixed support visual audit
PR #525 — support cleanup
PR #526 — complete Ledger Series footer network
PRs #527–#530 — official-domain migration hardening and completed legacy-host 301
PR #531 — 2026 stablecoin regulation guide cluster and 119-record mark-audit repair
PR #532 — post-PR #531 authority and schedule reconciliation
PR #533 — shared Guide readability and research-layout remediation
```

PR #523 remains open and unmerged.

## Immediate work — PR #523 bounded JPYSC Market Access completion

The shared Guide/readability defect that paused PR #523 has been remediated through PR #533. PR #523 has been reconciled against the then-current `main` and is now the active implementation lane.

PR #522 remains the semantic authority for the bounded JPYSC implementation. PR #523 must preserve all intervening merged work and pass the current workflow suite before merge.

Exact PR #523 target:

```text
asset: sog_st_jpysc
jurisdiction: JP / Japan
provider: SBI VC Trade / VCTRADE
effective from: 2026-06-24
observed at: 2026-08-05
buy_sell: account_internal_only
deposit: unavailable
withdrawal: unavailable
external_wallet_transfer: unavailable
```

Current bounded transition:

```text
Evidence: 584 -> 585
Evidence Relations: 584 -> 585
Market Access Records: 8 -> 12
Archive recorded: 462 -> 463
Archive not recorded: 122 -> 122
Detail routes: 422 -> 422
Metadata-checked routes: 422 -> 422
```

All other canonical counts remain unchanged.

Required exit after full validation, merge, and production verification: `REVIEW GATE`.

## Schedule

```text
2026-08-08 to 2026-08-09  authority/specification/schedule reconciliation — complete
2026-08-08 to 2026-08-09  Guide & Research Surface Readability Remediation — merged through PR #533
2026-08-09 to 2026-08-11  PR #523 current-main reconciliation and bounded completion — active
immediately after #523     production verification and REVIEW GATE closeout
2026-08-10 to 2026-08-16  stabilization and next-batch preparation; overlaps only where it does not bypass active authority
2026-08-17 to 2026-08-23  Evidence Archive Payload Verification Batch 2 — separate authority required
2026-08-24 to 2026-08-30  Tier A Dossier Deepening Batch 4 — separate authority required
2026-08-31 to 2026-09-06  cycle review and backlog reconciliation
2026-09-07 to 2026-09-13  next operating authority and contingency
```

Schedule windows are planning targets, not permission boundaries. A slipped item does not automatically authorize the following lane. Revise the roadmap and governing specification when the real sequence changes.

## Guides / editorial: maintenance-only after the current repair

The 2026 regulation guide cluster is complete for the current content phase. There is no automatic recurring article cadence.

New editorial pages require at least one of:

```text
material regulatory change
material correction or source update
observed search demand or content gap that justifies a new route
```

Existing evergreen URLs should be updated in place where practical.

The Guide/readability remediation was a correctness repair to an already published surface, not authorization for an open-ended new UI or editorial program.

## Next-cycle planning priority

Planning priority after the current six-week cycle is:

```text
Market Access expansion > Tier A dossier deepening > Record Growth > new UI
```

This is planning guidance only. It does not authorize September implementation.

## Preserved exclusions

```text
new or duplicate JPYSC asset
future capability represented as current access
lending represented as transfer evidence
country-wide availability inference
unbounded Evidence additions
ranking, score, recommendation, or implied safety
automatic promotion
silent continuation from a missed schedule window
merging PR #523 without current-main reconciliation
known visual defect accepted merely because CI is green
```

## Required work-start protocol

Every substantive work item must begin by reading the merged current versions of:

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/deployment-policy.md
docs/roadmap-amendments/2026-08-08-post-pr531-authority-reconciliation.md
docs/quality/post-pr531-authority-reconciliation-spec.md
current work-item specification
named inputs, audits, validators, and prior outputs
```

For active PR #523 work, additionally read:

```text
docs/market-access-record-spec.md
schemas/market-access-record-v1.schema.json
config/jpysc-market-access-pilot-3-implementation-authority-pr522.json
docs/quality/jpysc-market-access-pilot-3-implementation-authority-pr522-spec.md
docs/migration/jpysc-market-access-pilot-3-implementation-authority-pr522.json
config/japan-market-access-pilot-3-jpysc-review-pr521.json
data/editorial-research/japan-market-access-pilot-3-jpysc-review-pr521.json
data/evidence-pr356-market-access-pilot-1.json
data/market-access-records-v1.json
current canonical, review, statistics, release-integrity, provenance, UI, and production checkpoints
```

If authority, production checkpoint, counts, schedule, deployment behavior, or a blocking visual conclusion changes, update these documents before implementation continues.

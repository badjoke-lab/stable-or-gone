# Stable or Gone Roadmap

Updated: 2026-08-08  
Status: post-PR #531 authority reconciliation; Guide/readability remediation is the immediate next implementation

## Current production checkpoint

```text
Canonical stable assets: 119
Organizations: 109
Relationships: 131
Events: 194
Evidence: 584
Evidence Relations: 584
Reserve reports: 127
Known unknowns: 352
Regulatory notes: 9
Deployments: 186
Legal profiles: 119
Reserve components: 153
Income profiles: 119
Market Access Records: 8
Archive recorded: 462
Archive not recorded: 122
Detail routes: 422
Metadata-checked routes: 422
Official origin: https://www.stableorgone.com
Production commit: 210d68001fbd2560ffadf538fdb7cc9302b400a7
Canonical hash: sha256:57749955faa96d2bd836bac83ef41a0c5dc13f2342763dc4d975c588cd50c650
Convergence attempt: 1
Legacy-host 301: complete
```

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
```

PR #523 remains open and unmerged.

## Immediate work — Guide & Research Surface Readability Remediation

Direct production review on 2026-08-08 found a blocking shared Guide-system defect even though the automated visual checks were green.

The defect appears on both new and pre-existing content, including:

```text
/
/guides/global-stablecoin-regulation-2026/
/guides/uk-stablecoin-capital-rules-2026/
```

The next implementation must repair the shared Guide and home research presentation before PR #523 resumes.

Binding specification:

```text
docs/quality/guide-readability-remediation-2026-08-08-spec.md
```

Required corrections:

```text
remove persistent desktop left-rail TOC
restore primary section-heading hierarchy
widen Guide data/table presentation while preserving prose measure
stop rendering every Guide section as a four-sided audit-sheet panel
remove duplicate contextual/footer support presentation on Guide pages
make contextual support span the intended article width
rebalance the home Research & Guides secondary items; no orphan half-width card
preserve mobile readability and table semantics
```

This remediation is presentation-only. It changes no canonical data, article claims, source conclusions, guide URLs, machine-readable schemas, official-origin behavior, or redirect behavior.

Desktop and mobile screenshots plus direct inspection of changed route families are mandatory. Automated success cannot override a known visual defect.

## PR #523 — paused until Guide remediation production verification

PR #522 remains the semantic authority for the bounded JPYSC implementation, but PR #523 is no longer the immediate execution step.

The old PR #523 branch predates PRs #524–#531 and the required Guide repair. It must not be merged as-is.

After the Guide remediation is merged and production-verified, PR #523 must be reconciled against the then-current `main` and preserve every intervening merged change.

Exact later PR #523 target remains:

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

Expected bounded transition:

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

## Schedule

```text
2026-08-08 to 2026-08-09  authority/specification/schedule reconciliation
2026-08-08 to 2026-08-10  Guide & Research Surface Readability Remediation + production verification
2026-08-09 to 2026-08-11  PR #523 current-main reconciliation and bounded completion, after Guide repair verifies
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

The current Guide/readability remediation is a correctness repair to an already published surface, not authorization for an open-ended new UI or editorial program.

## Next-cycle planning priority

Planning priority after the current six-week cycle is:

```text
Market Access expansion > Tier A dossier deepening > Record Growth > new UI
```

This is planning guidance only. It does not authorize September implementation.

## Preserved exclusions

```text
canonical change inside the Guide/readability remediation
new or duplicate JPYSC asset
future capability represented as current access
lending represented as transfer evidence
country-wide availability inference
unbounded Evidence additions
ranking, score, recommendation, or implied safety
automatic promotion
silent continuation from a missed schedule window
merging stale PR #523 without current-main reconciliation
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

If authority, production checkpoint, counts, schedule, deployment behavior, or a blocking visual conclusion changes, update these documents before implementation continues.

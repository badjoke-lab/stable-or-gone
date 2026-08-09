# Stable or Gone Roadmap

Updated: 2026-08-09  
Status: PR #534 merged and production-verified; Japan Market Access Expansion Review Batch 1 active — review only

## Current reviewed checkpoint

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
Current production commit: 8ba1ed2b4aff36aaa9545c6f3e3cdd113dbb5ed2
Last canonical-changing implementation commit: 77e80dd3e2a62fea53ea0eabe91ef78a2d8ab1da
Production canonical hash: sha256:f386c1043ca5e83cafbd88e99746d0609aab0154ed48de1970677758a66ed5fa
Production canonical file count: 466
Current production parity convergence attempt: 1
Current production provenance convergence attempt: 3
Legacy-host 301: complete
```

PR #523 is the last canonical-changing Market Access implementation. PR #534 is merged and production-verified and changed forward authority/closeout material only, so the canonical hash and reviewed counts remain unchanged.

Canonical implementation remains at `REVIEW GATE`. A new review-only Market Access authority is active and does not itself permit promotion.

## Completed current-cycle work

```text
PR #514 — six-week cycle and Batch 5 authority
PR #515 — candidate audit
PRs #516–#519 — EUB/USB implementation, navigation insertion, and closeout
PRs #520–#522 — JPYSC review and bounded implementation authority
PR #523 — bounded JPYSC Japan Market Access implementation, merged and production-verified
PR #524 — fixed support visual audit
PR #525 — support cleanup
PR #526 — complete Ledger Series footer network
PRs #527–#530 — official-domain migration hardening and completed legacy-host 301
PR #531 — 2026 stablecoin regulation guide cluster and 119-record mark-audit repair
PR #532 — post-PR #531 authority and schedule reconciliation
PR #533 — shared Guide readability and research-layout remediation
PR #534 — post-PR #523 production closeout and REVIEW GATE restoration
```

## PR #523 verified result

The bounded historical canonical-changing result remains:

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

Final reviewed transition relative to the pre-PR #523 checkpoint:

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

## Current boundary — Market Access review only

Planning priority remains:

```text
Market Access expansion > Tier A dossier deepening > Record Growth > new UI
```

The first priority is now advanced only to a bounded review lane:

```text
Japan Market Access Expansion Review Batch 1
jurisdiction: JP / Japan
candidate limit: 3 asset x platform/service pairs
asset prerequisite: existing canonical identity
provider/service selection: source-led
functions: buy_sell, deposit, withdrawal, external_wallet_transfer
canonical promotion: prohibited
```

The review may produce a bounded implementation proposal or no-go decision. Any canonical promotion still requires a separate reviewed and merged implementation authority.

## Schedule

```text
2026-08-08 to 2026-08-09  authority/specification/schedule reconciliation — complete
2026-08-08 to 2026-08-09  Guide & Research Surface Readability Remediation — complete through PR #533
2026-08-09                 PR #523 reconciliation, validation, merge, and production verification — complete
2026-08-09                 post-PR #523 production closeout — complete through PR #534
2026-08-09 onward          Japan Market Access Expansion Review Batch 1 — active review-only preparation
2026-08-10 to 2026-08-16  stabilization and next-batch preparation — review work may continue; no implementation bypass
2026-08-17 to 2026-08-23  Evidence Archive Payload Verification Batch 2 — separate authority required
2026-08-24 to 2026-08-30  Tier A Dossier Deepening Batch 4 — separate authority required
2026-08-31 to 2026-09-06  cycle review and backlog reconciliation
2026-09-07 to 2026-09-13  next operating authority and contingency
```

Schedule windows are planning targets, not permission boundaries. A scheduled date never substitutes for reviewed authority.

## Market Access review acceptance

For at most three candidate asset × platform/service pairs, the review must record:

- current provider/service primary sources;
- regulator/official-register support when registration or legal route is claimed;
- function-scoped states without overgeneralization;
- effective and observation dates where supported;
- network/customer scope where explicit;
- existing canonical Evidence identity reuse eligibility;
- duplicate source URL review;
- unsupported values that remain unknown/out of scope;
- bounded implementation proposal or no-go result.

The review may not add canonical data, Evidence, routes, or material UI.

## Guides / editorial

The 2026 regulation guide cluster and the shared Guide/readability repair are complete for the current content phase. Guide content is maintenance-only; there is no automatic recurring article cadence.

New editorial pages require at least one of:

```text
material regulatory change
material correction or source update
observed search demand or content gap that justifies a new route
```

Existing evergreen URLs should be updated in place where practical.

## Preserved exclusions

```text
future capability represented as current access
lending represented as transfer evidence
country-wide availability inference
unbounded Evidence additions
ranking, score, recommendation, or implied safety
automatic promotion
silent continuation from a planning window
canonical implementation beyond REVIEW GATE without separate authority
known visual defect accepted merely because CI is green
```

## Required work-start protocol

Every substantive work item must begin by reading the merged current versions of:

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/deployment-policy.md
docs/roadmap-amendments/2026-08-09-post-pr534-market-access-review-authority.md
docs/quality/market-access-expansion-review-authority-2026-08-09-spec.md
docs/market-access-record-spec.md
config/market-access-governance-v1.json
current named inputs, source reviews, audits, validators, and prior outputs
```

If authority, production checkpoint, counts, schedule, deployment behavior, or a blocking visual conclusion changes, update these documents before implementation continues.

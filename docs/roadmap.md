# Stable or Gone Roadmap

Updated: 2026-08-09  
Status: PR #523 merged and production-verified; REVIEW GATE

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
Production commit: 77e80dd3e2a62fea53ea0eabe91ef78a2d8ab1da
Production canonical hash: sha256:f386c1043ca5e83cafbd88e99746d0609aab0154ed48de1970677758a66ed5fa
Production canonical file count: 466
Production parity convergence attempt: 2
Production provenance convergence attempt: 3
Legacy-host 301: complete
```

PR #523 is merged and production-verified. The repository is at `REVIEW GATE`; no later implementation lane is authorized by this checkpoint.

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
```

## PR #523 verified result

The bounded production result is:

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

## Current boundary — REVIEW GATE

No implementation lane is currently authorized.

The next substantive lane must receive separate reviewed and merged authority before code or canonical data changes begin. Planning priority remains:

```text
Market Access expansion > Tier A dossier deepening > Record Growth > new UI
```

This priority order is planning guidance only.

## Schedule

```text
2026-08-08 to 2026-08-09  authority/specification/schedule reconciliation — complete
2026-08-08 to 2026-08-09  Guide & Research Surface Readability Remediation — complete through PR #533
2026-08-09                 PR #523 reconciliation, validation, merge, and production verification — complete
2026-08-09                 post-PR #523 production closeout — active until merged, exit REVIEW GATE
2026-08-10 to 2026-08-16  stabilization and next-batch preparation — planning only
2026-08-17 to 2026-08-23  Evidence Archive Payload Verification Batch 2 — separate authority required
2026-08-24 to 2026-08-30  Tier A Dossier Deepening Batch 4 — separate authority required
2026-08-31 to 2026-09-06  cycle review and backlog reconciliation
2026-09-07 to 2026-09-13  next operating authority and contingency
```

Schedule windows are planning targets, not permission boundaries. A scheduled date never substitutes for reviewed authority.

## Guides / editorial

The 2026 regulation guide cluster and the shared Guide/readability repair are complete for the current content phase. Guide content is now maintenance-only; there is no automatic recurring article cadence.

New editorial pages require at least one of:

```text
material regulatory change
material correction or source update
observed search demand or content gap that justifies a new route
```

Existing evergreen URLs should be updated in place where practical.

## Preserved exclusions

```text
new or duplicate JPYSC asset
future capability represented as current access
lending represented as transfer evidence
country-wide availability inference
unbounded Evidence additions
ranking, score, recommendation, or implied safety
automatic promotion
silent continuation from a planning window
implementation beyond REVIEW GATE without separate authority
known visual defect accepted merely because CI is green
```

## Required work-start protocol

Every substantive work item must begin by reading the merged current versions of:

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/deployment-policy.md
docs/roadmap-amendments/2026-08-09-post-pr523-production-closeout.md
docs/quality/post-pr523-production-closeout-spec.md
current separately authorized work-item specification
named inputs, audits, validators, and prior outputs
```

If authority, production checkpoint, counts, schedule, deployment behavior, or a blocking visual conclusion changes, update these documents before implementation continues.

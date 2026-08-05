# Stable or Gone Roadmap

Updated: 2026-08-05  
Status: PR #520 active Japan Market Access Pilot 3 review authority

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
Deployments: 186
Legal profiles: 119
Reserve components: 153
Income profiles: 119
Market Access Records: 8
Archive recorded: 462
Archive not recorded: 122
Detail routes: 422
Metadata-checked detail routes: 422
Official public origin: https://www.stableorgone.com
Current production commit: 0648272f4271e68deac0a9603d77392eb7b63a3f
Production canonical hash: sha256:57749955faa96d2bd836bac83ef41a0c5dc13f2342763dc4d975c588cd50c650
Convergence attempt: 1
```

Production equality is recorded by the production workflow and Issue #479.

## Completed current-cycle work

```text
PR #514 — six-week cycle and Batch 5 audit authority
PR #515 — eight-candidate private audit
PR #516 — EUB/USB complete-record authority
PR #517 — EUB/USB complete canonical implementation
PR #518 — sibling-registry footer links
PR #519 — post-PR #518 production closeout
```

## Current authority

```text
PR #520 — Japan Market Access Pilot 3 review authority
PR #521 — JPYSC eligibility review only
```

PR #520 changes authority only. PR #521 is the only authorized continuation.

## Exact Pilot 3 target

```text
research record: jp_access_jpysc_sbivc_2026_06_24
candidate: sog_cand_pr515_jpysc
proposed asset id: sog_st_jpysc
jurisdiction: JP / Japan
platform: SBI VC Trade
service: VCTRADE
effective from: 2026-06-24
review cutoff: 2026-08-05
functions: buy_sell, deposit, withdrawal, external_wallet_transfer
```

No replacement asset or provider is allowed.

## Review-only boundary

Market Access Record v1 requires an existing canonical asset identity before promotion. `sog_st_jpysc` is not canonical at this checkpoint.

PR #515 deferred JPYSC because the reviewed issue remained account-internal without a verified public-chain token identity or complete terms. PR #521 must freshly verify the current primary sources, function states, dates, platform scope, canonical Evidence coverage, and duplicate URLs.

PR #521 may update private editorial research and add reviewed decision artifacts. It may add zero canonical Market Access Records, zero canonical assets, and zero canonical Evidence identities.

Future public-chain circulation must remain future-only. Current buy/sell availability must not be used to infer deposit, withdrawal, or external-wallet transfer availability. JPYSC lending is outside Market Access Record v1 and is excluded.

## Pilot 3 exit

PR #521 must return one explicit reviewed disposition:

```text
blocked_canonical_asset_identity_absent
blocked_evidence_scope_incomplete
blocked_current_source_conflict
eligible_for_later_separate_authority
```

Every disposition exits to `REVIEW GATE`. Even an eligibility result does not authorize canonical promotion.

## Six-week operating cycle

The reviewed cycle remains 2026-08-03 through 2026-09-13. Dates are planning windows, not automatic authority.

```text
2026-08-03 to 2026-08-09  Record Growth Batch 5, bounded navigation insertion, closeout, and Pilot 3 authority
2026-08-05 onward          PR #521 JPYSC eligibility review, then REVIEW GATE
2026-08-17 to 2026-08-23  Evidence Archive Payload Verification Batch 2, only after separate authority
2026-08-24 to 2026-08-30  Tier A Dossier Deepening Batch 4, only after separate authority
2026-08-31 to 2026-09-06  cycle review, quality assessment, and backlog reconciliation
2026-09-07 to 2026-09-13  next operating authority and contingency window
```

## Remaining lanes

The following remain planned but not implementation-authorized:

```text
Evidence Archive Payload Verification Batch 2
Tier A Dossier Deepening Batch 4
cycle review and next operating authority
```

A separate reviewed authority PR must define the exact target set, evidence boundary, non-goals, validation, and exit gate before any lane begins.

## Deferred candidates

```text
SoFiUSD / SOFID — exact deployments and current assurance evidence unresolved
USA₮ — exact deployments and product-specific holder terms unresolved
XREUR — announced circulation date is 2026-09-03
JPYSC canonical asset — account-internal issue without verified public-chain identity and complete terms
Swiss CHF sandbox — no final asset identity or market-launch decision
Hazel Network token design — infrastructure/testing without a final independent production asset
```

No automatic recheck or promotion is authorized outside PR #521's exact JPYSC review.

## Preserved exclusions

```text
replacement asset
unreviewed canonical promotion
new dashboard, ranking, score, or recommendation
large navigation or UI redesign
legacy host redirect work
automatic monitoring promotion
country-wide availability inference
future capability represented as current access
```

## Deployment boundary

The only official public origin is `https://www.stableorgone.com`.

PR #520 and PR #521 authorize no deployment behavior, route-family, canonical data, machine-readable schema, or legacy redirect change.

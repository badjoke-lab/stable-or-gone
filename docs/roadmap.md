# Stable or Gone Roadmap

Updated: 2026-08-05  
Status: PR #521 active Japan Market Access Pilot 3 JPYSC review

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
Current production commit: 196f8e20cd55c9b229c88127afa236dc5060b3fd
Production canonical hash: sha256:57749955faa96d2bd836bac83ef41a0c5dc13f2342763dc4d975c588cd50c650
Convergence attempt: 2
```

## Completed current-cycle work

```text
PR #514 — six-week cycle and Batch 5 audit authority
PR #515 — eight-candidate private audit
PR #516 — EUB/USB complete-record authority
PR #517 — EUB/USB complete canonical implementation
PR #518 — sibling-registry footer links
PR #519 — post-PR #518 production closeout
PR #520 — JPYSC Pilot 3 review authority
```

## Current work

```text
PR #521 — JPYSC eligibility review only
```

PR #521 changes private reviewed artifacts and authority documentation only. Canonical and public data remain unchanged.

## Reviewed JPYSC result

```text
asset: JPYSC / proposed sog_st_jpysc
jurisdiction: JP / Japan
platform: SBI VC Trade
service: VCTRADE
effective from: 2026-06-24
observed at: 2026-08-05
buy_sell: account_internal_only
deposit: unavailable
withdrawal: unavailable
external_wallet_transfer: unavailable
```

JPYSC is issued and available for account-internal purchase, sale, and conversion. The reviewed current state does not establish deposit, withdrawal, external-wallet transfer, or public-chain circulation.

Future public-chain capability remains future-only. A network reference or technical-readiness statement does not override explicit current unavailability. JPYSC lending is outside Market Access Record v1 and is excluded.

## Eligibility decision

```text
blocked_canonical_asset_identity_absent
```

Market Access Record v1 requires an existing canonical asset identity. `sog_st_jpysc` is not present in the canonical 119-asset registry.

PR #521 therefore adds:

```text
canonical stable assets: 0
canonical Evidence identities: 0
canonical Evidence Relations: 0
canonical Market Access Records: 0
public changes: 0
```

The canonical Market Access count remains eight.

A later JPYSC promotion would require a separate complete canonical asset review, approved canonical identity, sufficient canonical Evidence scope, fresh current-state review, and a separate Market Access authority decision.

## PR #521 exit

PR #521 exits only to:

```text
REVIEW GATE
```

Evidence Archive Payload Verification Batch 2 remains the next planned lane but is not implementation-authorized.

## Six-week operating cycle

The cycle remains 2026-08-03 through 2026-09-13. Dates are planning windows, not automatic authority.

```text
2026-08-03 to 2026-08-09  Record Growth Batch 5, navigation insertion, closeout, and Pilot 3 review
2026-08-05 onward          PR #521 JPYSC review, then REVIEW GATE
2026-08-17 to 2026-08-23  Evidence Archive Payload Verification Batch 2, only after separate authority
2026-08-24 to 2026-08-30  Tier A Dossier Deepening Batch 4, only after separate authority
2026-08-31 to 2026-09-06  cycle review, quality assessment, and backlog reconciliation
2026-09-07 to 2026-09-13  next operating authority and contingency window
```

## Remaining lanes

```text
Evidence Archive Payload Verification Batch 2
Tier A Dossier Deepening Batch 4
cycle review and next operating authority
```

Each lane requires a separate reviewed authority PR defining the exact targets, evidence boundary, validation, and exit gate.

## Deferred candidates

```text
SoFiUSD / SOFID — exact deployments and current assurance evidence unresolved
USA₮ — exact deployments and product-specific holder terms unresolved
XREUR — announced circulation date is 2026-09-03
JPYSC canonical asset — account-internal current state without an approved canonical identity
Swiss CHF sandbox — no final asset identity or market-launch decision
Hazel Network token design — infrastructure/testing without a final independent production asset
```

## Preserved exclusions

```text
replacement asset
thin JPYSC canonical record
unreviewed canonical promotion
future capability represented as current access
lending represented as transfer evidence
country-wide availability inference
new dashboard, ranking, score, or recommendation
large navigation or UI redesign
legacy host redirect work
automatic monitoring promotion
```

## Deployment boundary

The only official public origin is `https://www.stableorgone.com`.

PR #521 authorizes no deployment behavior, route-family, canonical data, machine-readable schema, or legacy redirect change.
